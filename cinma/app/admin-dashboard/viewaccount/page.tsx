"use client";

import { useEffect, useState } from "react";
import { getComptes, deleteCompte } from "@/app/utils/api";
import { compte } from "@/app/model/compte";
import Navbar from "@/app/_components/adminna/page";
import Footer from "@/app/_components/adfooter/page";
const AdminPage = () => {
  const [comptes, setComptes] = useState<compte[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [comptesPerPage] = useState(4);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState<compte | null>(null);

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const data = await getComptes();
        setComptes(data);
      } catch (err) {
        setError("Failed to fetch comptes.");
        console.error(err);
      }
    };
    fetchComptes();
  }, []);

  // Pagination logic
  const indexOfLastCompte = currentPage * comptesPerPage;
  const indexOfFirstCompte = indexOfLastCompte - comptesPerPage;
  const currentComptes = comptes.slice(indexOfFirstCompte, indexOfLastCompte);
  const totalPages = Math.ceil(comptes.length / comptesPerPage);

  const openPopup = (compte: compte) => {
    setSelectedCompte(compte);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedCompte(null);
  };

  const handleDeleteCompte = async (id: number) => {
    try {
      await deleteCompte(id);
      const data = await getComptes();
      setComptes(data);
    } catch (err) {
      setError("Failed to delete compte.");
      console.error(err);
    }
  };

  const handleDelete = () => {
    if (selectedCompte) {
      handleDeleteCompte(selectedCompte.id);
      closePopup();
    }
  };

  return (
    <><Navbar /><section
          className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center"
          style={{ backgroundImage: `url('/bg.jpg')` }}
      >
          <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
              {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {currentComptes.length > 0 ? (
                      currentComptes.map((compte) => (
                          <li key={compte.id}>
                              <div className="group relative flex flex-col items-center justify-center overflow-hidden border border-gray-100 bg-white rounded-2xl shadow-lg transition hover:shadow-xl">
                                  <img
                                      src={"/user.png"}
                                      alt={compte.name}
                                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72 rounded-t-2xl" />
                                  <div className="p-4 flex flex-col items-center">
                                      <h3 className="mt-2 text-lg font-semibold text-gray-900 text-center group-hover:underline group-hover:text-indigo-600">
                                          {compte.name}
                                      </h3>
                                      <p className="text-gray-700 mt-2">ID: {compte.id}</p>
                                      <p className="text-gray-700">Solde: {compte.solde}</p>
                                      <button
                                          onClick={() => openPopup(compte)}
                                          className="mt-4 inline-block rounded-full border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                                      >
                                          Delete
                                      </button>
                                  </div>
                              </div>
                          </li>
                      ))
                  ) : (
                      <p className="text-center text-gray-600 col-span-full">No comptes available</p>
                  )}
              </ul>

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
                                          : "border border-gray-100 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"}`}
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

              {isPopupVisible && selectedCompte && (
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
                                          fillRule="evenodd" />
                                  </svg>
                              </span>
                              <p className="font-medium sm:text-lg">Delete Compte?</p>
                          </div>
                          <p className="mt-4 text-gray-500">
                              Are you sure you want to delete the compte with ID: {selectedCompte.id}?
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
      <Footer/></>
  );
};

export default AdminPage;
