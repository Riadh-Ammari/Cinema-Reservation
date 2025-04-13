"use client";
import { useEffect, useState } from "react";
import { getFilms, getsalleprog, addSeance, addsalleprog } from "@/app/utils/api";
import { Film } from "@/app/model/Film";
import Navbar from "@/app/_components/adminna/page";
import { Seance } from "@/app/model/seance";
import { SalleProg } from "@/app/model/salleProg";

const AddSeance = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [salleProgs, setSalleProgs] = useState<SalleProg[]>([]);
  const [filmError, setFilmError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSeanceForm, setShowSeanceForm] = useState(true);

  const [seanceData, setSeanceData] = useState<Seance>({
    id_seance: 0,
    horaire: '',
    places: 0,
    salleProg: { id_salleprog: 0, film: { id_film: 0, nom: '', imageUrl: '' }, capacite: 0 },
    tarif: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filmsResponse = await getFilms();
        setFilms(filmsResponse);

        const salleProgsResponse = await getsalleprog();
        setSalleProgs(salleProgsResponse);
      } catch (err) {
        setFilmError("Failed to fetch films or salleProgs.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSeanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSeanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSeanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!seanceData.salleProg || !seanceData.salleProg.film || !seanceData.salleProg.capacite) {
        setError(null);  // Clear any previous error message
        return; // Exit the function to prevent submission
      }

      const existingSalleProg = salleProgs.find(
        (salleprog) => salleprog.film.id_film === seanceData.salleProg.film.id_film
      );

      if (existingSalleProg) {
        // If salleprog exists, associate the session with it
        seanceData.salleProg = existingSalleProg;
      } else {
        // Create new salleprog and associate the session with it
        const newSalleProg: SalleProg = {
          film: { ...seanceData.salleProg.film },
          capacite: seanceData.places,
          id_salleprog: salleProgs.length + 1, // Auto-incrementing ID logic
        };

        const addedSalleProg = await addsalleprog(newSalleProg);
        setSalleProgs([...salleProgs, addedSalleProg]);
        seanceData.salleProg = addedSalleProg;
      }

      await addSeance(seanceData); // Add the seance to the server

      // Reset form and display success message
      setSeanceData({
        id_seance: 0,
        horaire: '',
        places: 0,
        salleProg: { id_salleprog: 0, film: { id_film: 0, nom: '', imageUrl: '' }, capacite: 0 },
        tarif: 0,
      });
      setSuccess("Seance added successfully!");
    } catch (error) {
      setError("Failed to add seance. Please try again.");
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
              <form onSubmit={handleSeanceSubmit} className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="horaire"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Horaire
                  </label>

                  <input
                    type="datetime-local"
                    id="horaire"
                    name="horaire"
                    value={seanceData.horaire}
                    onChange={handleSeanceChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 resize-none h-8"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="places"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Places
                  </label>

                  <input
                    type="number"
                    id="places"
                    name="places"
                    value={seanceData.places}
                    onChange={handleSeanceChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="tarif"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Tarif
                  </label>

                  <input
                    type="number"
                    id="tarif"
                    name="tarif"
                    value={seanceData.tarif}
                    onChange={handleSeanceChange}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="film"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Film Name
                  </label>

                  <select
                    id="film"
                    name="salleProg.film.id_film"
                    onChange={(e) => setSeanceData({ ...seanceData, salleProg: { ...seanceData.salleProg, film: { ...films.find(film => film.id_film === Number(e.target.value))! } } })}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    required
                  >
                    <option value="">Select a film</option>
                    {films.map(film => (
                      <option key={film.id_film} value={film.id_film}>
                        {film.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Add Seance"}
                  </button>

                  {error && (
                    <p className="mt-2 text-sm text-red-500 sm:mt-0">
                      {error}
                    </p>
                  )}

                  {success && (
                    <p className="mt-2 text-sm text-green-500 sm:mt-0">
                      {success}
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

export default AddSeance;
