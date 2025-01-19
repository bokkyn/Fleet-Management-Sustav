import * as React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { getVehicleImage } from "./slikeVozila";
import { getVehicleTypeImage } from "./slikeTipova";
import { getVehicleImage2 } from "./slikeVozila2";
import { getVehicleTypeImage2 } from "./slikeTipova2";
import AlertUniverzalni from "../components/AlertUniverzalni";
import RezervacijaTablica from "../components/tablica/rezervacije-table-vozila";
import { toast } from "sonner";

const KarticaVozila = ({
  marka,
  model,
  tip_vozila,
  godina_proizvodnje,
  mjenjac,
  registracija,
  status,
  datum_tehnickog_pregleda,
  id,
}) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const vehicleImage =
    userInfo?.mode === "veselo"
      ? getVehicleImage2(marka)
      : getVehicleImage(marka);

  const typeImage =
    userInfo?.mode === "veselo"
      ? getVehicleTypeImage2(tip_vozila)
      : getVehicleTypeImage(tip_vozila);

  const handleBrisanje = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/vozila/brisanje/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Došlo je do pogreške pri brisanju vozila:", error);
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
      console.log("ID vozila koji šaljemo na servis:", id); // Ispis id vozila

      toast(
        "Došlo je do pogreške prilikom slanja vozila na servis ili povratka sa servisa."
      );
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-center mx-auto size-11">
          <img src={typeImage} alt="Tip vozila" />
        </div>
        <div className="flex flex-row justify-between px-1">
          <div className="flex flex-col pl-3">
            <CardTitle className="text-xl">{marka}</CardTitle>
            <CardDescription className="text-l">{model}</CardDescription>
          </div>
          <div className="">
            <img
              src={vehicleImage}
              className="w-12 h-12 object-contain"
              alt="Marka vozila"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Tip Vozila:</Label>
          <div className="pl-1 text-sm">{tip_vozila}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Godina proizvodnje:</Label>
          <div className="pl-1 text-sm">{godina_proizvodnje}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Mjenjač:</Label>
          <div className="pl-1 text-sm">{mjenjac}</div>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertUniverzalni
          title="Jeste li sigurni?"
          description={
            "Ova radnja se ne može poništiti.Trajno će izbrisati vozilo i ukloniti ga s poslužitelja.  Povijest i rezervacije vozila ostat će spremljene."
          }
          buttonLabel={"Izbriši"}
          onConfirm={handleBrisanje}
          buttonTextColor="text-red-400"
        ></AlertUniverzalni>
        <AlertUniverzalni
          title="Vozilo se vraća ili odlazi na servis?"
          description={
            "Mijenjate vozilu status. Ako vozilo nije na servisu, poslat ćete ga na servis. Ako je bilo na servisu, vratit ćete ga u bazu i učiniti dostupnim. Neregistrirana vozila ne možete slati na servis."
          }
          buttonLabel={"Servis"}
          onConfirm={handleServis}
          buttonTextColor="text-blue-900"
        ></AlertUniverzalni>
        <Drawer position="bottom">
          <DrawerTrigger asChild>
            <Button>Povijest i detalji</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <div className="flex flex-row justify-between gap-12">
                  <div>
                    <DrawerTitle>Najam odabranog vozila</DrawerTitle>
                    <DrawerDescription>
                      Pogledajte povijest najmova za:
                      <div className="font-semibold">
                        {marka} {model} ({registracija})
                      </div>
                    </DrawerDescription>
                  </div>
                  <img
                    src={vehicleImage}
                    className="size-14"
                    alt="Marka vozila"
                  />
                </div>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <RezervacijaTablica id_vozila={id}></RezervacijaTablica>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Nazad</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
};

export default KarticaVozila;
