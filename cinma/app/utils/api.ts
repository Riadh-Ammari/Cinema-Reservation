// utils/api.ts
import { format } from 'date-fns'; 
import { Film } from "@/app/model/Film";
import { compte } from "../model/compte";
import { Seance } from "../model/seance";
import { SalleProg } from "../model/salleProg";

const API_BASE_URL = "http://127.0.0.1:8080/cinemaresrvation/cinemaREST/me"; // Change this to your API URL

export const getFilms = async () => {
  const response = await fetch(`${API_BASE_URL}/films`);
  if (!response.ok) {
    throw new Error('Failed to fetch films');
  }
  return response.json();
};
export const getComptes = async () => {
    const response = await fetch(`${API_BASE_URL}/compte`);
    if (!response.ok) {
      throw new Error('Failed to fetch comptes');
    }
    return response.json();
  };

export const getFilmById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/films/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch film');
  }
  return response.json();
};

export const searchFilms = async (pattern: string) => {
  const response = await fetch(`${API_BASE_URL}/films/search/${pattern}`);
  if (!response.ok) {
    throw new Error('Failed to search films');
  }
  return response.json();
};



export const loginUser = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  return data; // You should handle success/failure response properly
};

export const registerUser = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  return data; // You should handle success/failure response properly
};
export const addCompte= async (compte: compte) => {
  const response = await fetch(`${API_BASE_URL}/compte`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(compte),
  });
  if (!response.ok) {
    throw new Error('Failed to add account');
  }
  return response.json();
};
export const deleteCompte = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/compte/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete compte');
  }
  return response.status; // Returns the status code (204 for success)
};
export const deleteFilm = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/films/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete film');
  }
  return response.status; // Returns the status code (204 for success)
};
export const getsenaces = async () => {
  const response = await fetch(`${API_BASE_URL}/seance`);
  if (!response.ok) {
    throw new Error("Failed to fetch salleProg data.");
  }
  return await response.json();
};
export const updateSolde = async (clientId: number, seanceId: number) => {
  const response = await fetch(`${API_BASE_URL}/compte/${clientId}/seance/${seanceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Failed to update solde. Status: ${response.status}, Message: ${errorMessage}`
    );
  }

  return response.status === 204; // No Content status
};
export const addSeance = async (seance: Seance) => {
  try {
    // Format the horaire property before sending it
    const formattedSeance = {
      ...seance,
      horaire: format(new Date(seance.horaire), "yyyy-MM-dd'T'HH:mm:ss"),
    };

    const response = await fetch(`${API_BASE_URL}/seance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedSeance),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to add seance. Status: ${response.status}, Message: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to add seance');
  }
};

export const addsalleprog= async (sallep: SalleProg) => {
  const response = await fetch(`${API_BASE_URL}/salleprog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sallep),
  });
  if (!response.ok) {
    throw new Error('Failed to add salleprog');
  }
  return response.json();
};
export const addFilm = async (film: Film) => {
  const response = await fetch(`${API_BASE_URL}/films`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(film),
  });
  if (!response.ok) {
    throw new Error('Failed to add film');
  }
  return response.json();
};
export const getsalleprog = async () => {
  const response = await fetch(`${API_BASE_URL}/salleProg`);
  if (!response.ok) {
    throw new Error("Failed to fetch salleProg data.");
  }
  return await response.json();
};
export const deleteSeance = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/seance/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete seance');
  }
  return response.status; // Returns the status code (204 for success)
};