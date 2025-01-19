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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 
const LoginForma = () => {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "lozinka") {
      setLozinka(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/korisnici/prijava", 
        {
          email,
          lozinka,
        },
        { withCredentials: true }
      );

    if (response.status === 200) {
        const korisnickiPodaci = response.data.korisnik; 

       localStorage.setItem("userInfo", JSON.stringify(korisnickiPodaci));

        toast("Prijava uspješna");

        navigate("/rezervacije");
        window.location.reload();     } else {
        setErrorMessage("Greška od servera.");
      }
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data : "Došlo je do greške."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prijava</CardTitle>
        <CardDescription>
          Unesite svoje podatke kako biste se prijavili.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
            placeholder="Unesite svoj email"
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
            placeholder="Unesite svoju lozinku"
          />
        </div>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Učitavanje..." : "Prijavi se"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForma;
