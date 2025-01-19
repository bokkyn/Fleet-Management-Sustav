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
import AlertUniverzalni from "../components/AlertUniverzalni";
import RezervacijaTablica from "../components/tablica/rezervacije-table-korisnici";

const KarticaKorisnika = ({
  prezime,
  ime,
  email,
  datum_rodjenja,
  uloga,
  id,
}) => {
  const handleBrisanje = async () => {
    try {
      console.log("ID:", id);
      const response = await axios.delete(
        `http://localhost:3000/korisnici/brisanje/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Došlo je do pogreške pri brisanju korisnika:", error);
    }
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <div className="flex justify-center mx-auto size-11">
          <img
            className="size-9"
            src={
              uloga === "administrator"
                ? "/assets/admin.svg"
                : "/assets/user.svg"
            }
          />
        </div>
        <div className="flex flex-row justify-between px-1">
          <div className="flex flex-col pl-3">
            <CardTitle className="text-xl">{prezime}</CardTitle>
            <CardDescription className="text-l">{ime}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Email:</Label>
          <div className="pl-1 text-sm">{email}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Datum Rođenja:</Label>
          <div className="pl-1 text-sm">{datum_rodjenja}</div>
        </div>
        <div className="flex flex-row w-full pl-3 items-center">
          <Label htmlFor="name">Uloga:</Label>
          <div className="pl-1 text-sm">{uloga}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertUniverzalni
          title="Jeste li sigurni?"
          description={
            "Ova radnja se ne može poništiti. Trajno će izbrisati korisnika i ukloniti ga s poslužitelja.  Povijest i rezervacije korisnika ostat će spremljene."
          }
          buttonLabel={"Izbriši"}
          onConfirm={handleBrisanje}
          buttonTextColor="text-red-400"
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
                    <DrawerTitle>Najmovi odabranog korisnika</DrawerTitle>
                    <DrawerDescription>
                      Pogledajte povijest najmova za:
                      <span className="font-semibold">
                        {" "}
                        {prezime}, {ime} ({email}){" "}
                      </span>
                    </DrawerDescription>
                  </div>
                  <img
                    className="size-11"
                    src={
                      uloga === "administrator"
                        ? "/assets/admin.svg"
                        : "/assets/user.svg"
                    }
                  />
                </div>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <RezervacijaTablica id_korisnika={id}></RezervacijaTablica>
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

export default KarticaKorisnika;
