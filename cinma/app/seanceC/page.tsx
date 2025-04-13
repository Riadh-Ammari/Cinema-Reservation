"use client";

import { useEffect, useState } from "react";
import Navbar from "../_components/userna/page";
import Footer from "../_components/footer/page";
import { getComptes, getsenaces, updateSolde } from "@/app/utils/api";
import { Seance } from "../model/seance";
import { compte } from "../model/compte";

const SeancePage = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [seancesPerPage] = useState(6);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [clientSolde, setClientSolde] = useState(100); // Default solde
  const [loading, setLoading] = useState(false);
  const [comptes, setComptes] = useState<compte[]>([]);


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

  useEffect(() => {
    // Fetch comptes (user accounts) from your API
    const fetchComptes = async () => {
      try {
        const comptedata = await getComptes();
        setComptes(comptedata);
      } catch (error) {
        console.error("Error fetching comptes:", error);
      }
    };
    fetchComptes();
  }, []);

  const handleConfirm = async (seance: Seance) => {
    // Find the matching account based on the entered username and password
    const compte = comptes.find(
      (compte) => compte.name === clientName && compte.password === clientPassword
    );
  
    if (compte) {
      if (compte.solde >= seance.tarif) {
        try {
          setLoading(true);
  
          // Call the backend to update solde using the client ID and seance ID
          await updateSolde(compte.id, seance.id_seance);
  
          // Simulate the new solde locally
          const newSolde = compte.solde - seance.tarif;
          setClientSolde(newSolde);
  
          // Update the local comptes state
          setComptes((prevComptes) =>
            prevComptes.map((c) =>
              c.id === compte.id ? { ...c, solde: newSolde } : c
            )
          );
  
          alert(`Reservation successful! Your new solde is $${newSolde.toFixed(2)}`);
  
          // Close the popup after successful reservation
          setPopupVisible(false);
        } catch (err) {
          console.error("Reservation error:", err);
          alert("An error occurred while reserving. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        alert("Insufficient solde to make this reservation.");
      }
    } else {
      alert("Invalid credentials, please try again.");
    }
  };
  

  // Pagination calculations
  const indexOfLastSeance = currentPage * seancesPerPage;
  const indexOfFirstSeance = indexOfLastSeance - seancesPerPage;
  const currentSeances = seances.slice(indexOfFirstSeance, indexOfLastSeance);
  const totalPages = Math.ceil(seances.length / seancesPerPage);

  // Show popup for reservation
  const handleShowPopup = (seance: Seance) => {
    setSelectedSeance(seance); // Ensure seance contains id_seance
    setPopupVisible(true);
  };
  

  return (
    <>
      <Navbar />
      <section
        className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundImage: `url('/bg.jpg')` }}
      >
        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Error message */}
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
                        onClick={() => handleShowPopup(seance)}
                        className="mt-2 inline-block rounded-full border border-green-600 px-12 py-3 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring active:bg-green-500"
                      >
                        Check and Reserve
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
                  onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
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

      {/* Popup */}
      {popupVisible && selectedSeance && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold">Reservation Details</h3>
            <p>
              Selected Film: <strong>{selectedSeance.salleProg.film.nom}</strong>
            </p>
            <p>
              Price: <strong>${selectedSeance.tarif.toFixed(2)}</strong>
            </p>
            <div className="mt-4">
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="clientPassword" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="clientPassword"
                type="password"
                value={clientPassword}
                onChange={(e) => setClientPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            
            <button
              onClick={() => handleConfirm(selectedSeance)}
              disabled={loading}
              className="mt-4 w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {loading ? "Processing..." : "Confirm Reservation"}
            </button>
            <button
              onClick={() => setPopupVisible(false)}
              className="mt-2 w-full rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SeancePage;
