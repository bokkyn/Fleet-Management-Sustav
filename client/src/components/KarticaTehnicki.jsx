import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { getVehicleImage } from "./slikeVozila";
import AlertUniverzalni from "../components/AlertUniverzalni";

const KarticaTehnicki = ({
  marka,
  model,
  godina_proizvodnje,
  registracija,
  status,
  datum_tehnickog_pregleda,
  id,
  children,
}) => {
  const vehicleImage = getVehicleImage(marka);

  const [noviDatum, setNoviDatum] = useState("");

  const handleTehnicki = async () => {
    if (!noviDatum) {
      toast("Molimo odaberite datum za tehnički pregled.");
      return;
    }

    try {
      const novi_datum_tehnickog_pregleda = new Date(noviDatum).toISOString();
      console.log("Poslati datum (ISO format):", novi_datum_tehnickog_pregleda); // Dodaj log za proveru

      const response = await axios.put(
        `http://localhost:3000/vozila/azurirajTehnicki/${id}`,
        { novi_datum_tehnickog_pregleda },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      toast("Tehnički pregled je uspešno ažuriran.");
      window.location.reload();
    } catch (error) {
      console.log("novi datum", noviDatum, "--id:", id);
      console.error(
        "Došlo je do greške pri ažuriranju tehničkog pregleda vozila:",
        error
      );
      toast("Došlo je do greške. Molimo pokušajte ponovo.");
    }
  };

  const handleServis = async () => {
    try {
      console.log("Trenutni status vozila:", status);

      if (status === "neregistrirano") {
        toast("Vozilo nije registrirano, ne može biti poslano na servis.");
        return;
      }

      if (status === "servis") {
        const response = await axios.put(
          `http://localhost:3000/vozila/povrat-sa-servisa/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(
          "Odgovor sa servera pri povratku sa servisa:",
          response.data
        );
        toast("Vozilo je vraćeno sa servisa");
        window.location.reload();
      } else {
        const response = await axios.put(
          `http://localhost:3000/vozila/servis/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(
          "Odgovor sa servera pri slanju vozila na servis:",
          response.data
        );
        window.location.reload();
        toast("Vozilo je poslano na servis");
      }
    } catch (error) {
      console.error("Došlo je do pogreške:", error);
      // Provjera id u back-endu
      console.log("ID vozila koji šaljemo na servis:", id); // Ispis id vozila

      toast(
        "Došlo je do pogreške prilikom slanja vozila na servis ili povratka sa servisa."
      );
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex flex-row justify-between px-1">
          <div className="flex flex-col pl-3">
            <CardTitle className="text-xl">{marka}</CardTitle>
            <CardDescription className="text-l">{model}</CardDescription>
          </div>
          <div className="">
            <img src={vehicleImage} className="size-11" alt="Marka vozila" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Godina proizvodnje:</Label>
          <div className="pl-1 text-sm">{godina_proizvodnje}</div>
        </div>

        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Registracija:</Label>
          <div className="pl-1 text-sm">{registracija}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Status:</Label>
          <div className="pl-1 text-sm">{status}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Tehnički pregled:</Label>
          <div className="pl-1 text-sm">{datum_tehnickog_pregleda}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center text-red-800">
          {children && <div className="">{children}</div>}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <AlertUniverzalni
          title="Vozilo odlazi na servis?"
          description={
            "Mijenjate vozilu status. Ako vozilo nije na servisu, poslat ćete ga na servis. Ako je bilo na servisu, vratit ćete ga u bazu i učiniti dostupnim. Neregistrirana vozila ne možete slati na servis."
          }
          buttonLabel={"Servis"}
          onConfirm={handleServis}
          buttonTextColor="text-blue-900"
        ></AlertUniverzalni>

        <AlertUniverzalni
          title="Vozilo odlazi ili je bilo na tehničkom pregledu?"
          description="Unesite datum do kojeg traje nova registracija automobila."
          buttonLabel={"Tehnički pregled"}
          onConfirm={handleTehnicki}
          buttonTextColor="text-black-900"
        >
          <input
            type="date"
            value={noviDatum}
            onChange={(e) => setNoviDatum(e.target.value)}
            className=" p-1 border rounded w-full"
          />
        </AlertUniverzalni>
      </CardFooter>
    </Card>
  );
};

export default KarticaTehnicki;
