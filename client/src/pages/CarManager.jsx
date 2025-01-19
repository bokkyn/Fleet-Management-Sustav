import React, { useState, useEffect } from "react";
import axios from "axios";
import KarticaVozila from "../components/KarticaVozila";
import Upute from "../components/Upute";
import Upozorenja from "../components/Upozorenja";
const CarManager = () => {
  const [vozila, setVozila] = useState([]);

  useEffect(() => {
    const fetchVozila = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vozila", {
          withCredentials: true,
        });

        setVozila(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchVozila();
  }, []);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("hr-HR", options);
    return formattedDate;
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Upozorenja></Upozorenja>
      <Upute
        naslov={"Vozila"}
        opis="Prikaz svih vozila u sustavu. Ovdje možete vozilo poslati na servis ili ga izbrisati iz baze. Također, možete vidjeti povijest rezervacija za svako vozilo."
      ></Upute>
      {vozila.map((vozilo) => (
        <KarticaVozila
          key={vozilo.registracija}
          id={vozilo._id}
          marka={vozilo.marka}
          model={vozilo.model}
          tip_vozila={vozilo.tip_vozila}
          godina_proizvodnje={vozilo.godina_proizvodnje}
          mjenjac={vozilo.mjenjac}
          registracija={vozilo.registracija}
          status={vozilo.status}
          datum_tehnickog_pregleda={formatDate(vozilo.datum_tehnickog_pregleda)}
        />
      ))}
    </div>
  );
};

export default CarManager;
