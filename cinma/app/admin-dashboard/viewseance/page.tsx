"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/_components/adminna/page";
import Footer from "@/app/_components/adfooter/page";
import { getsenaces, deleteSeance } from "@/app/utils/api";
import { Seance } from "@/app/model/seance";

const SeancePage = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [seancesPerPage] = useState(6);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);

  // Fetch seances from API
  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const seanceData = await getsenaces();
        setSeances(seanceData);
      } catch (err) {
        console.error("Error fetching seances:", err);
        setError("Failed to fetch seances.");
      }
    };
    fetchSeances();
  }, []);

  // Pagination calculations
  const indexOfLastSeance = currentPage * seancesPerPage;
  const indexOfFirstSeance = indexOfLastSeance - seancesPerPage;
  const currentSeances = seances.slice(indexOfFirstSeance, indexOfLastSeance);
  const totalPages = Math.ceil(seances.length / seancesPerPage);

  // Function to open the delete confirmation popup
  const openPopup = (seance: Seance) => {
    setSelectedSeance(seance);
    setIsPopupVisible(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedSeance(null);
  };

  // Function to handle delete
  const handleDeleteSeance = async (id: number) => {
    try {
      await deleteSeance(id);
      setSeances((prevSeances) =>
        prevSeances.filter((seance) => seance.id_seance !== id)
      );
    } catch (err) {
      console.error("Failed to delete seance:", err);
      setError("Failed to delete seance.");
    }
  };

  const handleDelete = () => {
    if (selectedSeance) {
      handleDeleteSeance(selectedSeance.id_seance);
      closePopup();
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
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

          {/* Seance grid */}
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentSeances.length > 0 ? (
              currentSeances.map((seance) => (
                <li key={seance.id_seance}>
                  <div className="group relative flex flex-col items-center justify-center overflow-hidden border border-gray-100 bg-white rounded-2xl shadow-lg transition hover:shadow-xl">
                    <img
                      src={"/images.jpg"}
                      alt={seance.salleProg.film.nom}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72 rounded-t-2xl"
                    />
                    <div className="p-4 flex flex-col items-center">
                      <h3 className="mt-2 text-lg font-semibold text-gray-900 text-center group-hover:underline group-hover:text-indigo-600">
                        Film Name: <strong>{seance.salleProg.film.nom}</strong>
                      </h3>
                      <p className="text-gray-700 mt-2">
                        Projection Salle: {seance.salleProg.id_salleprog}
                      </p>
                      <p className="text-gray-700 mt-2">
                        Price: <strong>${seance.tarif.toFixed(2)}</strong>
                      </p>
                      <button
                        onClick={() => openPopup(seance)}
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
                No seances available.
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

      {/* Delete Confirmation Popup */}
      {isPopupVisible && selectedSeance && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75"
        >
          <div
            className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8"
            role="alert"
          >
            <p className="font-medium sm:text-lg">Delete Seance?</p>
            <p className="mt-4 text-gray-500">
              Are you sure you want to delete the seance "{selectedSeance.salleProg.film.nom}"?
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

      <Footer />
    </>
  );
};

export default SeancePage;
