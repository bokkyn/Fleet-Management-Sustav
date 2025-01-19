import React, { useState } from "react";
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
import { toast } from "sonner";

const RegistracijaForma = () => {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [datumRodjenja, setDatumRodjenja] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("korisnik"); // Defaultna uloga je korisnik
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler za promjene u input poljima
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "ime":
        setIme(value);
        break;
      case "prezime":
        setPrezime(value);
        break;
      case "datumRodjenja":
        setDatumRodjenja(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "lozinka":
        setLozinka(value);
        break;
      case "uloga":
        setUloga(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/korisnici",

        {
          ime,
          prezime,
          datum_rodjenja: datumRodjenja,
          email,
          lozinka,
          uloga,
        },
        {
          withCredentials: true,
        }
      );

         console.log(response.data);
      toast("Registracija uspješna! Možete se prijaviti.");
      setIme("");
      setPrezime("");
      setDatumRodjenja("");
      setEmail("");
      setLozinka("");
    } catch (error) {
      if (error.response) {
        const errorMessage =
          typeof error.response.data === "string"
            ? error.response.data.split(": ").pop() 
            : "Došlo je do greške.";
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("Došlo je do greške.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Registracija</CardTitle>
          <CardDescription>
            Unesite svoje podatke kako biste se registrirali.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="flex space-x-4">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="ime">Ime</Label>
              <Input
                type="text"
                id="ime"
                name="ime"
                value={ime}
                onChange={handleInputChange}
                required
                placeholder="Ime"
              />
            </div>
            <div className="space-y-2 w-1/2">
              <Label htmlFor="prezime">Prezime</Label>
              <Input
                type="text"
                id="prezime"
                name="prezime"
                value={prezime}
                onChange={handleInputChange}
                required
                placeholder="Prezime"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="datumRodjenja">Datum rođenja</Label>
            <Input
              type="date"
              id="datumRodjenja"
              name="datumRodjenja"
              value={datumRodjenja}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lozinka">Lozinka</Label>
            <Input
              type="password"
              id="lozinka"
              name="lozinka"
              value={lozinka}
              onChange={handleInputChange}
              required
              placeholder="Lozinka"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uloga">Uloga</Label>
            <select
              id="uloga"
              name="uloga"
              value={uloga}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="korisnik">Korisnik</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Učitavanje..." : "Registriraj se"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistracijaForma;
