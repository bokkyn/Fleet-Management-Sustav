import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const OtkazivanjeDialog = ({ idRezervacije, openDialog }) => {
  const [rezervacija, setRezervacija] = useState(null);

  const alertDialogRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (idRezervacije) {
        try {
          const rezervacijaResponse = await axios.get(
            `http://localhost:3000/rezervacije?id=${idRezervacije}`,
            {
              withCredentials: true,
            }
          );
          const fetchedRezervacija = rezervacijaResponse.data[0];
          setRezervacija(fetchedRezervacija);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();
  }, [idRezervacije]);

  useEffect(() => {
    if (openDialog && alertDialogRef.current) {
      alertDialogRef.current.click();
    }
  }, [openDialog]);

  const handleOtkazivanje = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/rezervacije/otkazi/${idRezervacije}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        window.location.reload();
        toast("Rezervacija je otkazana");
      } else {
        toast("Došlo je do pogreške pri otkazivanju rezervacije.");
      }
    } catch (error) {
      toast("Došlo je do pogreške pri otkazivanju rezervacije.");
    }
  };

  if (!rezervacija) {
    console.log("Loading reservation data...");
    return <div>Učitavanje...</div>;
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger ref={alertDialogRef}>
          <div className=" bg-gray-100 px-4 rounded-[30px] border border-gray-300 py-2 whitespace-nowrap font-semibold">
            OTKAŽI
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Otkaži rezervaciju</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ime" className="text-right">
                Ime:
              </Label>
              <div id="ime" className="col-span-3">
                {rezervacija.id_korisnika.ime}{" "}
                {rezervacija.id_korisnika.prezime}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tip" className="text-right">
                Tip vozila:
              </Label>
              <div id="tip" className="col-span-3">
                {rezervacija.tip_vozila}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razlog" className="text-right">
                Razlog i poruka:
              </Label>
              <div id="razlog" className="col-span-3">
                {rezervacija.razlog}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vrijeme_pocetka" className="text-right">
                Vrijeme početka:
              </Label>
              <div id="vrijeme_pocetka" className="col-span-3">
                {new Date(rezervacija.vrijeme_pocetka).toLocaleString("hr-HR", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>

              <Label htmlFor="vrijeme_zavrsetka" className="text-right">
                Vrijeme završetka:
              </Label>
              <div id="vrijeme_zavrsetka" className="col-span-3">
                {new Date(rezervacija.vrijeme_zavrsetka).toLocaleString(
                  "hr-HR",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Nazad</AlertDialogCancel>
            <AlertDialogAction onClick={handleOtkazivanje}>
              Otkaži
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OtkazivanjeDialog;
