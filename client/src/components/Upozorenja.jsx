import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Upozorenja = () => {
  const [rezervacije, setRezervacije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchRezervacije = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/rezervacije/rezervacije-specijalne",
          {
            withCredentials: true,
          }
        );
        setRezervacije(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRezervacije();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl">
      <Card className="bg-red-100 ">
        <CardHeader>
          <CardTitle>Upozorenja za vozila</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Ako će nekom vozilu tijekom rezervacije isteći registracija ili
            vozilo zahtjeva servis, vožnja takvog vozila bila bi ilegalna ili
            opasna. Bilo bi dobro da se problem otkloni, vozilo registrira ili
            servisira prije početka rezervacije. U najgorem slučaju
            kontaktirajte korisnika i otkažite rezervaciju.
          </CardDescription>
          <button
            className=" text-black p-2 rounded mt-4 "
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? "Sakrij upozorenja" : "Prikaži upozorenja"}
          </button>
          {showContent && (
            <div className="mt-4">
              {rezervacije.length === 0 ? (
                <p className="font-bold">
                  Nema posebnih upozorenja za rezervacije.
                </p>
              ) : (
                <ul className="list-none">
                  {rezervacije.map((rezervacija) => (
                    <li
                      className="flex flex-col items-center mb-4 p-2 border-b border-gray-300"
                      key={rezervacija._id}
                    >
                      <span className="font-bold">
                        {rezervacija.id_vozila.marka}{" "}
                        {rezervacija.id_vozila.model} (
                        {rezervacija.id_vozila.registracija})
                      </span>
                      <span className="italic">
                        {rezervacija.id_korisnika.ime}{" "}
                        {rezervacija.id_korisnika.prezime}
                      </span>
                      <span>
                        <strong>Razlog:</strong>{" "}
                        {rezervacija.razlozi.join(", ")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upozorenja;
