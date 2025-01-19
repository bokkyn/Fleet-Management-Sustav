
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Upute from "../components/Upute";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComboBoxUniverzalni from "@/components/ComboBoxUniverzalni"; // Adjust the path as necessary

const DodajRezervaciju = () => {
  const currentUser = JSON.parse(localStorage.getItem("userInfo")); // Pretpostavljam da koristiš localStorage za korisničke podatke

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    id_korisnika: currentUser ? currentUser.id : "",
    ime: currentUser ? currentUser.ime : "",
    prezime: currentUser ? currentUser.prezime : "",
    tip_vozila: "",
    razlog: "",
    vrijeme_pocetka: "",
    vrijeme_zavrsetka: "",
  });

  const [loading, setLoading] = useState(false);

  const tipoviVozila = [
    { value: "hatchback", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "kombi", label: "Kombi" },
    { value: "SUV", label: "SUV" },
    { value: "karavan", label: "Karavan" },
    { value: "coupe", label: "Coupe" },
    { value: "kabriolet", label: "Kabriolet" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.tip_vozila ||
      !formData.razlog ||
      !formData.vrijeme_pocetka ||
      !formData.vrijeme_zavrsetka
    ) {
      toast.error("Molimo vas da popunite sva obavezna polja.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/rezervacije", formData, {
        withCredentials: true,
      });

      toast.success(
        "Rezervacija uspješno poslana. Pričekajte da je administrator prihvati ili odbije."
      );
      setFormData({
        id_korisnika: currentUser ? currentUser.id : "",
        ime: currentUser ? currentUser.ime : "",
        prezime: currentUser ? currentUser.prezime : "",
        tip_vozila: "",
        razlog: "",
        vrijeme_pocetka: "",
        vrijeme_zavrsetka: "",
      });
    } catch (error) {
      toast.error("Došlo je do greške prilikom slanja rezervacije.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Upute
        className="mb-4 pb-3"
        naslov="Dodavanje rezervacije"
        opis="Dodati rezervaciju možete samo u svoje ime."
      ></Upute>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj Rezervaciju</CardTitle>
          <CardDescription>
            Popunite podatke za novu rezervaciju.
          </CardDescription>
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

          <div className="space-y-2 space-x-2">
            <Label htmlFor="tip_vozila">Tip Vozila: </Label>
            <ComboBoxUniverzalni
              options={tipoviVozila}
              value={formData.tip_vozila}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, tip_vozila: value }))
              }
              placeholder="Odaberite tip vozila"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razlog">Razlog</Label>
            <Input
              type="text"
              id="razlog"
              name="razlog"
              value={formData.razlog}
              onChange={handleChange}
              required
              placeholder="Unesite razlog za rezervaciju"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vrijeme_pocetka">Vrijeme Početka</Label>
              <Input
                type="datetime-local"
                id="vrijeme_pocetka"
                name="vrijeme_pocetka"
                value={formData.vrijeme_pocetka}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vrijeme_zavrsetka">Vrijeme Zavrsetka</Label>
              <Input
                type="datetime-local"
                id="vrijeme_zavrsetka"
                name="vrijeme_zavrsetka"
                value={formData.vrijeme_zavrsetka}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Učitavanje..." : "Pošaljite Rezervaciju"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DodajRezervaciju;
