import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComboBoxUniverzalni from "@/components/ComboBoxUniverzalni";
import { toast } from "sonner";
import Upute from "@/components/Upute";

const PrijaviProblem = () => {
  const currentUser = JSON.parse(localStorage.getItem("userInfo"));

  const [formData, setFormData] = useState({
    id_korisnika: currentUser ? currentUser.id : "",
    ime: currentUser ? currentUser.ime : "",
    prezime: currentUser ? currentUser.prezime : "",
    id_vozila: "",
    opis_problema: "",
    kategorija: "",
    prioritet: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [vozila, setVozila] = useState([]);
  const [kategorije, setKategorije] = useState([
    { value: "mehanički kvar", label: "Mehanički Kvar" },
    { value: "oštećenje karoserije", label: "Oštećenje Karoserije" },
    { value: "administrativni problem", label: "Administrativni Problem" },
    { value: "ostalo", label: "Ostalo" },
  ]);
  const [prioriteti, setPrioriteti] = useState([
    { value: "nizak", label: "Nizak" },
    { value: "srednji", label: "Srednji" },
    { value: "visok", label: "Visok" },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/rezervacije", {
        params: {
          id_korisnika: currentUser ? currentUser.id : "",
          status: "odobreno",
          vrijeme_pocetka: {
            $lt: new Date(),
          },
        },
        withCredentials: true,
      })
      .then((response) => {
        const vozilaKorisnika = response.data
          .map((rezervacija) => {
            if (rezervacija.id_vozila && rezervacija.id_vozila._id) {
              return {
                value: rezervacija.id_vozila._id,
                label: `${rezervacija.id_vozila.marka} - ${rezervacija.id_vozila.registracija}`,
              };
            }
            return null;
          })
          .filter((vozilo) => vozilo !== null);

        const uniqueVozila = vozilaKorisnika.filter(
          (vozilo, index, self) =>
            index === self.findIndex((v) => v.value === vozilo.value)
        );

        setVozila(uniqueVozila);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju vozila: ", error);
      });
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:3000/problemi", formData, {
        withCredentials: true,
      });

      toast("Problem uspješno prijavljen.");
      setFormData({
        id_korisnika: currentUser ? currentUser.id : "",
        ime: currentUser ? currentUser.ime : "",
        prezime: currentUser ? currentUser.prezime : "",
        id_vozila: "",
        opis_problema: "",
        kategorija: "",
        prioritet: "",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const backendError =
          error.response.data.error || error.response.data.message;
        setErrorMessage(backendError);
      } else {
        setErrorMessage("Došlo je do greške prilikom prijave problema.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Upute
        naslov={"Prijavi Problem"}
        opis={
          "Ovdje možete prijaviti problem s vozilom. Problem možete prijaviti samo za ona vozila koja ste rezervirali, a rezervacija je odobrena."
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Prijavi Problem</CardTitle>
          <CardDescription>Prijavite problem s vozilom.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ime</Label>
              <Input
                type="text"
                name="ime"
                value={formData.ime}
                readOnly
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Prezime</Label>
              <Input
                type="text"
                name="prezime"
                value={formData.prezime}
                readOnly
                required
              />
            </div>
          </div>
          <div className="space-y-2 space-x-9">
            <Label htmlFor="id_vozila">Odaberite Vozilo:</Label>
            <ComboBoxUniverzalni
              options={vozila}
              value={formData.id_vozila}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, id_vozila: value }))
              }
              placeholder="Odaberite vozilo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opis_problema">Opis Problema</Label>
            <Input
              type="text"
              id="opis_problema"
              name="opis_problema"
              value={formData.opis_problema}
              onChange={handleChange}
              required
              placeholder="Unesite opis problema"
            />
          </div>

          <div className="space-y-2 space-x-3">
            <Label htmlFor="kategorija">Kategorija Problema: </Label>
            <ComboBoxUniverzalni
              options={kategorije}
              value={formData.kategorija}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, kategorija: value }))
              }
              placeholder="Odaberite kategoriju"
            />
          </div>

          <div className="align-middle space-y-2 space-x-3">
            <Label htmlFor="prioritet">Prioritet: </Label>
            <ComboBoxUniverzalni
              options={prioriteti}
              value={formData.prioritet}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, prioritet: value }))
              }
              placeholder="Odaberite prioritet"
            />
          </div>

          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Učitavanje..." : "Pošaljite Problem"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrijaviProblem;
