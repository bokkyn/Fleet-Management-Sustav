import React from "react";
import axios from "axios";
import Upute from "../components/Upute";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ModeIzbornik = () => {
  const postaviMode = async (mode) => {
    try {
      const endpoint =
        mode === "normalno"
          ? "http://localhost:3000/korisnici/postavi-normalno"
          : "http://localhost:3000/korisnici/postavi-veselo";

      const response = await axios.put(endpoint, {}, { withCredentials: true });

      if (response.status === 200) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo);
        if (userInfo) {
          userInfo.mode = mode; 
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }

        alert(response.data.message);
        window.location.reload();
      } else {
        alert("Nešto je pošlo po zlu.");
      }
    } catch (error) {
      console.error("Greška:", error);
      alert("Došlo je do greške prilikom postavljanja moda.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Upute
        naslov="Odaberi izgled!"
        opis="Ovdje možete odabrati standardne crno-bijele postavke ili veseli mode, s kojim dolaze auto-marke u boji te šareni grafovi. Opcija koju odaberete bit će sačuvana za vaš korisnički račun, nebitno gdje se prijavili."
      ></Upute>
      <Tabs defaultValue="normalno" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="normalno">Normalno</TabsTrigger>
          <TabsTrigger value="veselo">Veselo</TabsTrigger>
        </TabsList>
        <TabsContent value="normalno">
          <Card>
            <CardHeader>
              <CardTitle>Elegancija u jednostavnosti</CardTitle>
              <CardDescription>
                Crno-bijeli način je sinonim za sofisticiranost i eleganciju.
                Bez nepotrebnih distrakcija, omogućuje vam da se fokusirate na
                bitne stvari. Ovaj minimalistički pristup stvara smirenost i
                osjećaj ravnoteže, idealan za one koji cijene ljepotu u
                jednostavnosti.
                <div className="flex flex-row justify-center">
                  <img
                    src="/assets/primjeri/normalno1.png"
                    alt="Normalno"
                    className="w-50 h-40"
                  />
                  <img
                    src="/assets/primjeri/normalno2.png"
                    alt="Normalno"
                    className="w-50 h-40"
                  />
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => postaviMode("normalno")}>
                NORMALNI MODE
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="veselo">
          <Card>
            <CardHeader>
              <CardTitle>Malo života!</CardTitle>
              <CardDescription>
                Neki to ipak vole veselo!
                <div className="flex flex-row justify-center">
                  <img
                    src="/assets/primjeri/veselo1.png"
                    alt="Veselo"
                    className="w-50 h-40"
                  />
                  <img
                    src="/assets/primjeri/veselo2.png"
                    alt="Veselo"
                    className="w-50 h-40"
                  />
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => postaviMode("veselo")}>VESELI MODE</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeIzbornik;
