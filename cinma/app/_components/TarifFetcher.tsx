"use client";

import { useEffect, useState } from "react";

const TarifFetcher = ({ filmId }: { filmId: number }) => {
  const [tarif, setTarif] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch the tarif for the given film ID
    const fetchTarif = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/cinemaresrvation/cinemaREST/me/tarif/${filmId}`);
        if (!response.ok) {
          const errorText = await response.text(); // Read error message from backend
          throw new Error(errorText);
        }
        const data: number = await response.json(); // Backend returns tarif as a single number
        setTarif(data); // Set tarif if fetched successfully
      } catch (err: any) {
        setError(err.message); // Set error message if fetch fails
      }
    };

    fetchTarif();
  }, [filmId]); // Re-fetch if the filmId changes

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "400px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    fontSize: "20px",
    color: "#333",
    marginBottom: "10px",
  };

  const messageStyle = {
    fontSize: "16px",
    color: tarif !== null ? "#2d6a4f" : "#f77f00", // Green for tarif, orange for loading
  };

  const errorStyle = {
    fontSize: "16px",
    color: "#d90429",
    fontWeight: "bold" as const,
  };

  if (error) {
    return <div style={{ ...containerStyle, ...errorStyle }}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Détails du Tarif</h2>
      {tarif !== null ? (
        <div style={messageStyle}>
          Le tarif pour le film avec ID {filmId} est: <strong>{tarif} DT</strong>
        </div>
      ) : (
        <div style={messageStyle}>Chargement du tarif...</div>
      )}
    </div>
  );
};

export default TarifFetcher;
