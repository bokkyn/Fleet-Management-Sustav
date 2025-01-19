import React from "react";
import RezervacijaTablica from "../components/tablica/rezervacije-table-me";
import Upute from "../components/Upute";
import ProblemiTablica from "@/components/tablica/problemi-table-me";

const Osobno = () => {
  return (
    <div className="space-y-4">
      <Upute
        naslov="Osobno"
        opis="Ovdje možete pregledati vlastite rezervacije i prijavljene probleme."
      ></Upute>
      <h1 className="font-bold">Rezervacije</h1>

      <RezervacijaTablica></RezervacijaTablica>

      <ProblemiTablica></ProblemiTablica>
    </div>
  );
};

export default Osobno;
