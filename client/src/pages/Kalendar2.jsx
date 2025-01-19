import CalendarApp from "../components/Kalendar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Upute from "../components/Upute";

function Kalendar2() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/rezervacije", {
          withCredentials: true,
        });
        const rezervacije = response.data;

        const approvedReservations = rezervacije.filter(
          (rezervacija) => rezervacija.status === "odobreno"
        );

        const newEvents = approvedReservations.map((rezervacija) => ({
          id: String(rezervacija._id),
          title: `${rezervacija.id_korisnika.ime} ${
            rezervacija.id_korisnika.prezime
          } - ${rezervacija.id_vozila?.marka || ""} ${
            rezervacija.id_vozila?.model || ""
          } ${rezervacija.id_vozila?.registracija || ""}`,
          start: formatDate(rezervacija.vrijeme_pocetka),
          end: formatDate(rezervacija.vrijeme_zavrsetka),
          calendarId: `${rezervacija.id_vozila?.tip_vozila || "SUV"}`,
        }));

        setEvents(newEvents);
        console.log(newEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (isLoading) {
    return <div>Učitavanje...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Upute
        naslov={"Kalendar"}
        opis="Jednostavni kalendar prikazuje današnji datum, te odobrene rezervacije"
      ></Upute>
      <CalendarApp className="min-w-full w-fit" events={events} />
    </div>
  );
}

export default Kalendar2;
