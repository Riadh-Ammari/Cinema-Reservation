"use client";

import { useEffect, useState } from "react";
import Navbar from "../_components/nav/page";
import Footer from "../_components/footer/page";
import { getFilms } from "@/app/utils/api";
import { Film } from "../model/Film";

const FilmsPage = () => {
  const [films, setFilms] = useState<Film[]>([]); // All films fetched from API
  const [searchTerm, setSearchTerm] = useState<string>(""); // User's search term
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [filmsPerPage] = useState(4); // Films per page
  const [error, setError] = useState<string | null>(null);

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
                              className="mt-4 inline-block rounded-full border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                            >
                              <a href="/login" className="block">
                                View Details
                              </a>
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
                    className={`block px-4 py-2 rounded-full ${
                      currentPage === index + 1
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
                  onClick={() =>
                    setCurrentPage(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 rtl:rotate-180 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                >
                  Next
                </button>
              </li>
            </ol>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FilmsPage;
