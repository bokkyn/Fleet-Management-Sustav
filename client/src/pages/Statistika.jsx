import React from "react";
import { GrafTipovi } from "../components/grafovi/GrafTipovi";
import { GrafKorisnici } from "../components/grafovi/GrafKorisnici";
import { GrafVozila } from "../components/grafovi/GrafVozila";


const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const Statistika = () => {
  return (
    <div className="flex flex-col">

      <div className="flex flex-1">
        {/* Gornji livi */}
        <div className="flex-1 p-4 border-r border-b">
          <GrafTipovi></GrafTipovi>
        </div>
        {/* Gornji desni */}
        <div className="flex-1 p-4 border-b">
          <GrafKorisnici
            title="Korisnici s najviše rezervacija"
            description="Top 5 korisnika s najviše odobrenih rezervacija"
            link={"http://localhost:3000/rezervacije/top-korisnici"}
            color={
              userInfo?.mode === "veselo"
                ? `hsl(${Math.random() * 360}, 100%, 70%)`
                : `hsl(0, 0%, ${Math.random() * 100}%)`
            }
          ></GrafKorisnici>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Donji liv */}
        <div className="flex-1 p-4 border-r border-t">
          <GrafKorisnici
            title="Najodbijaniji korisnici"
            description="Top 5 korisnika s najviše odbijenih rezervacija"
            link={"http://localhost:3000/rezervacije/top-odbijeni-korisnici"}
            color={`hsl(0, 100%, ${Math.random() * (70 - 30) + 30}%)`}
          ></GrafKorisnici>
        </div>

        {/* Donji desni  */}
        <div className="flex-1 p-4 border-t">
          <GrafVozila></GrafVozila>
        </div>
      </div>
    </div>
  );
};

export default Statistika;
