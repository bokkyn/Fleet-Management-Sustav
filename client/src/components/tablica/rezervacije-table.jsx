import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./data-table";
import columns from "./columns";
import Upute from "../Upute";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Upozorenja from "../Upozorenja";

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

      <DataTable columns={columns} data={rezervacije} pagination />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Može li netko rezervirati vozilo koje je već netko rezervirao?
          </AccordionTrigger>
          <AccordionContent>
            Ne. Kad pošaljete zahtjev, administrator može dodijeliti jedno
            vozilo samo jednom korisniku u isto vrijeme, u izborniku će mu se
            pojaviti samo vozila koja su slobodna u tom periodu, i čiji tip
            odgovara tipu vozila koje je korisnik odabrao. Ako je vozilo već
            rezervirano, neće se pojaviti u izborniku.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Može li se rezervirati više vozila odjednom?
          </AccordionTrigger>
          <AccordionContent>
            Ne. Softver neće dopustiti korisniku da u istom periodu rezervira još
            jedno vozilo, ako je prva rezervacija odobrena. Ako je prva
            rezervacija odbijena, korisnik može pokušati opet rezervirati
            vozilo.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Postoji li šansa da se odobrena rezervacija ipak ne dogodi?
          </AccordionTrigger>
          <AccordionContent>
            Ako je rezervacija odobrena, jedini načini da se ne provede su da
            korisnik otkaže rezervaciju ili da se dogodi nepredviđeni problem,
            ko da vozilo završi na servisu. Tad administrator mora obavijestiti
            korisnika i pokušati pronaći rješenje. Popis upozorenja u vezi
            takvih spornih rezervacija se nalazi ispod.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Upozorenja></Upozorenja>
    </div>
  );
};

export default RezervacijaTablica;
