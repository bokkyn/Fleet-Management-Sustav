import React, { useState, useEffect } from "react";
import axios from "axios";
import KarticaKorisnika from "../components/KarticaKorisnika";
import Upute from "../components/Upute";

const UserManager = () => {
  const [korisnici, setKorisnici] = useState([]);

  useEffect(() => {
    const fetchKorisnici = async () => {
      try {
        const response = await axios.get("http://localhost:3000/korisnici/", {
          withCredentials: true,
        });

        console.log("API Response:", response); 
        console.log("API Data:", response.data); 
        if (response.data && Array.isArray(response.data)) {
          setKorisnici(response.data);
          console.log("Korisnici updated:", response.data); // Confirm state update
        } else {
          console.log("No valid data returned.");
        }
      } catch (error) {
        console.error("Error fetching korisnici:", error);
      }
    };

    fetchKorisnici();
  }, []);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("hr-HR", options);
    return formattedDate;
  };

  console.log(korisnici);
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Upute
        naslov={"Korisnici"}
        opis="Prikaz svih korisnika u sustavu. Ovdje možete korisniku pregledati podatke, izbrisati ga iz baze, te vidjeti povijest njegovih rezervacija."
      ></Upute>
      {korisnici.map((korisnik) => (
        <KarticaKorisnika
          key={`${korisnik._id}-${korisnik.email}`}
          id={korisnik._id} 
          prezime={korisnik.prezime}
          ime={korisnik.ime}
          email={korisnik.email}
          mjenjac={korisnik.mjenjac}
          uloga={korisnik.uloga}
          datum_rodjenja={formatDate(korisnik.datum_rodjenja)} 
        />
      ))}
    </div>
  );
};

export default UserManager;
