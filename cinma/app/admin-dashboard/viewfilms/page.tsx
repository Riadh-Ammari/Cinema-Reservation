"use client";

import { useEffect, useState } from "react";
import { deleteFilm, getFilms, addFilm } from "@/app/utils/api";
import { Film } from "@/app/model/Film";
import Navbar from "@/app/_components/adminna/page";
import Footer from "@/app/_components/adfooter/page";

const FilmsPage = () => {
  const [films, setFilms] = useState<Film[]>([]); // All films fetched from API
  const [searchTerm, setSearchTerm] = useState<string>(""); // User's search term
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [filmsPerPage] = useState(4); // Films per page
  const [error, setError] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showFilmForm, setShowFilmForm] = useState(false);
  const [filmData, setFilmData] = useState<Film>({ id_film: 0, nom: '', imageUrl: '' });
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch films from API
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const filmsData = await getFilms();
        setFilms(filmsData);
      } catch (err) {
        console.error("Error fetching films:", err);
        setError("Failed to fetch films.");
      }
    };
    fetchFilms();
  }, []);

  // Filtered films based on search term
  const filteredFilms = films.filter((film) =>
    film.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  // Total pages for pagination
  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

  const openPopup = (film: Film) => {
    setSelectedFilm(film);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedFilm(null);
  };

  const handleDeleteFilm = async (id: number) => {
    try {
      await deleteFilm(id);
      const data = await getFilms();
      setFilms(data);
    } catch (err) {
      console.error("Failed to delete film:", err);
      setError("Failed to delete film.");
    }
  };

  const handleDelete = () => {
    if (selectedFilm) {
      handleDeleteFilm(selectedFilm.id_film);
      closePopup();
    }
  };

  // Show the Add Film Form
  const toggleFilmForm = () => {
    setShowFilmForm(!showFilmForm);
  };

  // Form state and handler
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
      const filmsData = await getFilms();
      setFilms(filmsData);
      setShowFilmForm(false);  // Close the form after adding the film
    } catch (error) {
      console.error(error);
      setError("Failed to add film. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section
        className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundImage: `url('/bg.jpg')` }}
      >
        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="flex justify-center mt-12">
            <input
              type="text"
              placeholder="Search for films..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              className="w-full max-w-lg p-4 text-lg border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          {/* Error message */}
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

          {/* Film cards */}
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentFilms.length > 0 ? (
              currentFilms.map((film: Film) => (
                <li key={film.id_film}>
                  <div className="group relative flex flex-col items-center justify-center overflow-hidden border border-gray-100 bg-white rounded-2xl shadow-lg transition hover:shadow-xl">
                    <img
                      src={"/cinema.webp"}
                      alt={film.nom}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72 rounded-t-2xl"
                    />
                    <div className="p-4 flex flex-col items-center">
                      <h3 className="mt-2 text-lg font-semibold text-gray-900 text-center group-hover:underline group-hover:text-indigo-600">
                        {film.nom}
                      </h3>
                      <button
                        onClick={() => openPopup(film)}
                        className="mt-4 inline-block rounded-full border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No films match your search.
              </p>
            )}
          </ul>

          {/* Add Film Button */}
          

          {/* Pagination */}
          <div className="mt-8 flex justify-center space-x-2">
            <ol className="flex justify-center gap-1 text-xs font-medium">
              <li>
                <button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                  className="inline-flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 rtl:rotate-180 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                >
                  Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`block px-4 py-2 rounded-full ${currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-100 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                      }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )}
                  className="inline-flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 rtl:rotate-180 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                >
                  Next
                </button>
              </li>
            </ol>
          </div>

          {/* Add Film Form Popup */}
          {showFilmForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8"
                role="alert"
              >
                <div className="flex items-center gap-4">
                  <span className="shrink-0 rounded-full bg-blue-400 p-2 text-white">
                    <svg
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>

                  <p className="font-medium sm:text-lg">Add New Film</p>
                </div>

                <form onSubmit={handleFilmSubmit} noValidate className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="nom" className="block text-lg font-medium mb-2">
                      Film Name:
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={filmData.nom}
                      onChange={handleFilmChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="imageUrl" className="block text-lg font-medium mb-2">
                      Image URL:
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={filmData.imageUrl}
                      onChange={handleFilmChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowFilmForm(false)}
                      className="rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
                    >
                      {loading ? "Adding..." : "Add Film"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Popup */}
          {isPopupVisible && selectedFilm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75"
              onClick={closePopup}
            >
              <div
                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8"
                role="alert"
              >
                <div className="flex items-center gap-4">
                  <span className="shrink-0 rounded-full bg-blue-400 p-2 text-white">
                    <svg
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>

                  <p className="font-medium sm:text-lg">Delete Film?</p>
                </div>

                <p className="mt-4 text-gray-500">
                  Are you sure you want to delete the film "{selectedFilm.nom}"?
                </p>

                <div className="mt-6 sm:flex sm:gap-4">
                  <button
                    onClick={handleDelete}
                    className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
                  >
                    Yes, Delete
                  </button>

                  <button
                    onClick={closePopup}
                    className="mt-2 inline-block w-full rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
                  >
                    No, Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FilmsPage;
