"use client";
import { useEffect, useState } from "react";
import { getFilms, deleteFilm, addFilm } from "@/app/utils/api";
import { Film } from "@/app/model/Film";
import Navbar from "@/app/_components/adminna/page";
const AddFilm = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [filmError, setFilmError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilmForm, setShowFilmForm] = useState(true);

  // Fetch and display all films
  const fetchFilms = async () => {
    try {
      const data = await getFilms();
      setFilms(data);
    } catch (err) {
      setFilmError("Failed to fetch films.");
      console.error(err);
    }
  };

  // Form state and handler
  const [filmData, setFilmData] = useState<Film>({
    id_film: 0,
    nom: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch films to determine the next ID
  useEffect(() => {
    const fetchFilmsData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/cinemaresrvation/cinemaREST/me/films");
        if (response.ok) {
          const films: Film[] = await response.json();
          const maxId = Math.max(...films.map(film => film.id_film), 0);
          setFilmData((prevData) => ({
            ...prevData,
            id_film: maxId + 1,
          }));
        } else {
          throw new Error("Failed to fetch films.");
        }
      } catch (error) {
        setFilmError("Error fetching films.");
        console.error(error);
      }
    };

    fetchFilmsData();
  }, []);

  // Handle form input changes for Film
  const handleFilmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilmData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Film
  const handleFilmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addFilm(filmData);
      setShowFilmForm(true);  // Keep the form visible after adding the film
      setFilmData({
        id_film: filmData.id_film + 1,
        nom: '',
        imageUrl: '',
      });
    } catch (error) {
      setFilmError("Failed to add film. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-white dark:bg-gray-900">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="/bg.png"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to CinemaHub 🎥
              </h2>

              <p className="mt-4 leading-relaxed text-white/90">
                Dive into the world of movies, explore your favorite theaters, and book your tickets effortlessly!
              </p>
            </div>
          </section>

          <main
            className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
          >
            <div className="max-w-xl lg:max-w-3xl">
              <form onSubmit={handleFilmSubmit} className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="filmName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Film Name
                  </label>

                  <input
                    type="text"
                    id="filmName"
                    name="nom"
                    value={filmData.nom}
                    onChange={handleFilmChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 resize-none h-8"
                    required
                  />
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Add Film"}
                  </button>

                  {error && (
                    <p className="mt-2 text-sm text-red-500 sm:mt-0">
                      {error}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
      
    </>
  );
};

export default AddFilm;