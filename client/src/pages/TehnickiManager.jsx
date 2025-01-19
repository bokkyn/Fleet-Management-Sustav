import React, { useState, useEffect } from "react";
import axios from "axios";
import KarticaTehnicki from "../components/KarticaTehnicki";
import Upute from "../components/Upute";

const TehnickiManager = () => {
  const [vozila, setVozila] = useState([]);
  useEffect(() => {
    const fetchVozila = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vozila", {
          withCredentials: true,
        });



        const danas = new Date();


        const filtriranaVozila = response.data.filter((vozilo) => {
          const datumTehnickog = new Date(vozilo.datum_tehnickog_pregleda);
          const razlikaDana = Math.ceil(
            (datumTehnickog - danas) / (1000 * 60 * 60 * 24)
          );
          console.log("razlika dana iz managera", razlikaDana);
          return razlikaDana <= 30;
        });

        setVozila(filtriranaVozila);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVozila();
  }, []);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("hr-HR", options);
    return formattedDate;
  };

  const calculateDaysUntilInspection = (datumTehnickog) => {
    const danas = new Date();
    const tehnickiDatum = new Date(datumTehnickog);
    const razlika = Math.ceil((tehnickiDatum - danas) / (1000 * 60 * 60 * 24));
    if (razlika > 0) {
      return "Broj dana do tehničkog pregleda: " + razlika;
    } else {
      return "Registracija je istekla.";
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Upute
        naslov="Tehnički pregledi"
        opis={
          "Prikaz vozila kojima je registracija pri kraju. Pritisnite tehnički pregled i odaberite novi datum nakon što ste ga registrirali, u protivnom, status vozila će postati 'neregistrirano' i korisnici ga neće moći rezervirati."
        }
      ></Upute>
      {vozila.map((vozilo) => (
        <KarticaTehnicki
          key={vozilo.registracija}
          id={vozilo._id} 
          marka={vozilo.marka}
          model={vozilo.model}
          godina_proizvodnje={vozilo.godina_proizvodnje}
          registracija={vozilo.registracija}
          status={vozilo.status}
          datum_tehnickog_pregleda={formatDate(vozilo.datum_tehnickog_pregleda)}
          children={
            <div>
              {calculateDaysUntilInspection(vozilo.datum_tehnickog_pregleda)}
            </div>
          }
        />
      ))}
    </div>
  );
};

export default TehnickiManager;
