"use client";

import { useEffect, useState } from "react";
import Navbar from "../_components/userna/page";
import Footer from "../_components/lofooter/page";
import { getComptes, getsenaces, updateSolde } from "@/app/utils/api";
import { Seance } from "../model/seance";
import { compte } from "../model/compte";
import Hero from "../_components/hero/page";

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
      <Navbar /><Hero/><Footer/></>
      
    
  );
};

export default SeancePage;
