import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./data-table"; 
import columns from "./columns"; 
import Upute from "../Upute";

const RezervacijaTablica = () => {
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/rezervacije", {
          withCredentials: true,
        });

        const flatData = response.data.map((item) => ({
          ...item,
          ime: item.id_korisnika?.ime || "",
          prezime: item.id_korisnika?.prezime || "",
          email: item.id_korisnika?.email || "",
          marka: item.id_vozila?.marka || "",
          model: item.id_vozila?.model || "",
          registracija: item.id_vozila?.registracija || "",
        }));

        setRezervacije(flatData);
      } catch (error) {
        console.error("Error fetching reservations", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold">Rezervacije</h1>
      <Upute
        naslov="Tablica rezervacija"
        opis="Ovdje možete pregledati sve rezervacije, bile one odbijene, odobrene... Rezervacije koje niste odobrili niti odbili, prikazat će se po defaultu na vrhu, ali za sortiranje možete dodirnuti tipke naslova stupca, za filtriranje po statusu možete koristiti izbornik desno, a ako trebate filtrirati po vozilu, korisniku ili čak datumu, slobodno upišite prvih par znakova u izbornik lijevo. Ako je vrijeme rezervacije prošlo, a na nju niste reagirali, status će biti označen s 'prošlo', potrudite se da se to ne događa. Na rezervacije kojima je status 'na čekanju' možete kliknuti kako biste ih odobrili ili odbili. Tad će se pojaviti izbornih s više detalja i opcija."
      ></Upute>

      <DataTable
        columns={columns} 
        data={rezervacije} 
        pagination
      />
    </div>
  );
};

export default RezervacijaTablica;
