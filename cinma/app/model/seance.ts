import { SalleProg } from "./salleProg";

export interface Seance {
    id_seance: number;
    horaire: string;
    places: number;
    salleProg: SalleProg;
    tarif: number;
  }