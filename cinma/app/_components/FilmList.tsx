import React from "react";
import { Film } from "../model/Film";

interface FilmListProps {
  films: Film[];
}

const FilmList: React.FC<FilmListProps> = ({ films }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 p-6">
      {films.map((film) => (
        <div
          key={film.id_film}
          className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center"
          style={{ width: "300px", height: "400px" }}
        >
          <div className="w-full h-3/5 bg-gray-200">
            {/* Replace with the actual image source */}
            <img
              src={ "/cinema.webp" }
              alt={film.nom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center h-2/5 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-black">{film.nom}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilmList;
