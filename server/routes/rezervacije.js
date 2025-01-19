const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET_KEY = "splitskibijeli"; //ovo ka nebi smia uploadat :)
router.use(cookieParser());
// -----------------------------------------------------------------------------
const rezervacijaShema = new mongoose.Schema({
  id_korisnika: {
    type: mongoose.Schema.Types.ObjectId, //tip je iz druge tablice pa se ovako spaja
    ref: "Korisnik",
    required: true,
  },
  tip_vozila: {
    type: String,
    enum: [
      "hatchback",
      "sedan",
      "karavan",
      "kombi",
      "SUV",
      "coupe",
      "kabriolet",
    ],
    required: true,
  },
  id_vozila: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vozilo",
  },
  vrijeme_pocetka: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const currentTime = new Date();
        if (value < currentTime) {
          return false;
        }
        return true;
      },
      message: "Vrijeme početka ne može biti u prošlosti.",
    },
  },
  vrijeme_zavrsetka: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const startTime = this.vrijeme_pocetka;
        if (value <= startTime) {
          return false;
        }
        return true;
      },
      message: "Vrijeme završetka mora biti nakon vremena početka.",
    },
  },
  razlog: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["na čekanju", "odobreno", "odbijeno", "otkazano"],
    default: "na čekanju",
  },
});

const Rezervacija = mongoose.model(
  "Rezervacija",
  rezervacijaShema,
  "Rezervacije"
);
//--------------------------------------------------------------------------------

const provjeriCookie = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).send("Token nije dostavljen");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.korisnik = decoded;
    next();
  } catch (error) {
    res.status(401).send("Neispravan token");
  }
};

// provjera uloge
const provjeriUlogu = (uloga) => (req, res, next) => {
  if (req.korisnik && req.korisnik.uloga === uloga) {
    next();
  } else {
    res
      .status(403)
      .send(`Zabranjen pristup - vaša uloga je ${req.korisnik.uloga}`);
  }
};

// ---------------------DODAVANJE REZERVACIJE-------------------------------------
router.post("/", provjeriCookie, async (req, res) => {
  const {
    id_korisnika,
    tip_vozila,
    vrijeme_pocetka,
    vrijeme_zavrsetka,
    id_vozila,
    razlog,
  } = req.body;

  try {
    const korisnik = await mongoose.model("Korisnik").findById(id_korisnika);
    if (!korisnik) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    const novaRezervacija = new Rezervacija({
      id_korisnika,
      tip_vozila,
      id_vozila,
      vrijeme_pocetka,
      vrijeme_zavrsetka,
      razlog,
    });

    await novaRezervacija.validate();

    await novaRezervacija.save();
    res
      .status(201)
      .send(
        "Rezervacija uspješno poslana. Pričekajte da je administrator prihvati ili odbije."
      );
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ------------------DOHVAT i FILTRIRANJE-------------------------------------
router.get("/", async (req, res) => {
  const { id_korisnika, status, id_vozila, id } = req.query;

  try {
    const filter = {};

    if (id_korisnika) {
      filter.id_korisnika = id_korisnika;
    }

    if (status) {
      filter.status = status;
    }

    if (id_vozila) {
      filter.id_vozila = id_vozila;
    }

    if (id) {
      filter._id = id;
    }

    const rezervacije = await Rezervacija.find(filter)
      .populate("id_korisnika", "ime prezime email")
      .populate("id_vozila", "marka model registracija tip_vozila")
      .exec();

    res.status(200).json(rezervacije);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ------------------------RUTE ZA STATISTIKU---------------------------------------------
//i ovdje provjeravamo ulogu, šta imaju oni koji nisu admini gledat statistiku
router.get(
  "/top-korisnici",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    try {
      const korisniciRezervacije = await Rezervacija.aggregate([
        { $match: { status: "odobreno" } },
        { $group: { _id: "$id_korisnika", brojRezervacija: { $sum: 1 } } },
        { $sort: { brojRezervacija: -1 } },
        { $limit: 5 },
      ]);

      const korisniciPodaci = await mongoose
        .model("Korisnik")
        .find({ _id: { $in: korisniciRezervacije.map((item) => item._id) } })
        .select("ime prezime");

      const chartData = korisniciRezervacije.map((item) => {
        const korisnik = korisniciPodaci.find(
          (k) => k._id.toString() === item._id.toString()
        );
        return {
          korisnik: `${korisnik.ime} ${korisnik.prezime}`,
          brojrezervacija: item.brojRezervacija,
        };
      });

      res.status(200).json(chartData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.get(
  "/top-odbijeni-korisnici",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    try {
      const korisniciRezervacije = await Rezervacija.aggregate([
        { $match: { status: "odbijeno" } },
        { $group: { _id: "$id_korisnika", brojRezervacija: { $sum: 1 } } },
        { $sort: { brojRezervacija: -1 } },
        { $limit: 5 }, // Ograniči na top 5 korisnika
      ]);

      const korisniciPodaci = await mongoose
        .model("Korisnik")
        .find({ _id: { $in: korisniciRezervacije.map((item) => item._id) } })
        .select("ime prezime");

      const chartData = korisniciRezervacije.map((item) => {
        const korisnik = korisniciPodaci.find(
          (k) => k._id.toString() === item._id.toString()
        );
        return {
          korisnik: `${korisnik.ime} ${korisnik.prezime}`,
          brojrezervacija: item.brojRezervacija,
        };
      });

      res.status(200).json(chartData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);
router.get(
  "/top-vozila",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    try {
      const vozilaRezervacije = await Rezervacija.aggregate([
        { $match: { status: "odobreno" } },
        { $group: { _id: "$id_vozila", brojRezervacija: { $sum: 1 } } },
        { $sort: { brojRezervacija: -1 } },
        { $limit: 5 },
      ]);

      const vozilaPodaci = await mongoose
        .model("Vozilo")
        .find({ _id: { $in: vozilaRezervacije.map((item) => item._id) } })
        .select("model marka");

      const chartData = vozilaRezervacije
        .map((item) => {
          const vozilo = vozilaPodaci.find(
            (k) => k._id.toString() === item._id.toString()
          );

          if (vozilo) {
            return {
              vozilo: `${vozilo.marka} ${vozilo.model}`,
              brojrezervacija: item.brojRezervacija,
            };
          }
        })
        .filter((item) => item);

      res.status(200).json(chartData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//koji su tipovi najcesci
router.get(
  "/chart-data",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    try {
      const { godina, id_korisnika } = req.query;

      const trenutnaGodina = new Date().getFullYear();
      const filtriranaGodina = godina ? parseInt(godina, 10) : trenutnaGodina;

      const filter = {
        vrijeme_pocetka: {
          $gte: new Date(filtriranaGodina, 0, 1),
          $lt: new Date(filtriranaGodina + 1, 0, 1),
        },
        status: "odobreno",
      };

      if (id_korisnika) {
        filter.id_korisnika = id_korisnika;
      }

      const rezervacije = await Rezervacija.find(filter).exec();

      // Mjeseci naši
      const mjeseci = [
        "Siječanj",
        "Veljača",
        "Ožujak",
        "Travanj",
        "Svibanj",
        "Lipanj",
        "Srpanj",
        "Kolovoz",
        "Rujan",
        "Listopad",
        "Studeni",
        "Prosinac",
      ];

      const podaciPoMjesecima = mjeseci.reduce((acc, mjesec) => {
        acc[mjesec] = {
          mjesec: mjesec,
          hatchback: 0,
          sedan: 0,
          karavan: 0,
          kombi: 0,
          SUV: 0,
          coupe: 0,
          kabriolet: 0,
        };
        return acc;
      }, {});

      rezervacije.forEach((rezervacija) => {
        const vrijemePocetka = new Date(rezervacija.vrijeme_pocetka);
        const mjesecIndex = vrijemePocetka.getMonth();
        const mjesecNaziv = mjeseci[mjesecIndex];

        const tipVozila = rezervacija.tip_vozila;
        if (podaciPoMjesecima[mjesecNaziv][tipVozila] !== undefined) {
          podaciPoMjesecima[mjesecNaziv][tipVozila]++;
        }
      });

      const chartData = mjeseci.map((mjesec) => podaciPoMjesecima[mjesec]);

      res.status(200).json(chartData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//------------VOZILA U PROBLEMU-------------------------------------
//za obavijest adminu koja vozila su obecana a ne mogu se koristiti
router.get(
  "/rezervacije-specijalne",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    try {
      const currentTime = new Date();

      const vozila = await mongoose
        .model("Vozilo")
        .find({ status: "servis" })
        .select("_id status datum_tehnickog_pregleda");

      const vozilaServis = new Set(vozila.map((v) => v._id.toString()));

      const rezervacije = await mongoose
        .model("Rezervacija")
        .find({
          vrijeme_pocetka: { $gte: currentTime },
          status: { $in: ["odobreno", "na čekanju"] },
        })
        .populate("id_korisnika", "ime prezime email")
        .populate(
          "id_vozila",
          "marka model registracija status datum_tehnickog_pregleda vrijeme_pocetka"
        )
        .exec();

      const rezultat = rezervacije
        .map((rezervacija) => {
          try {
            const idVozila = rezervacija.id_vozila?._id?.toString();
            const razlozi = [];

            if (!idVozila || !rezervacija.id_vozila) return null;

            if (vozilaServis.has(idVozila)) {
              razlozi.push("servis");
            }

            if (
              rezervacija.id_vozila.datum_tehnickog_pregleda &&
              rezervacija.id_vozila.datum_tehnickog_pregleda <=
                rezervacija.vrijeme_zavrsetka
            ) {
              razlozi.push("tehnički pregled");
            }

            if (razlozi.length > 0) {
              return {
                ...rezervacija.toObject(),
                razlozi,
              };
            }

            return null;
          } catch (error) {
            return null;
          }
        })
        .filter((item) => item !== null);

      res.status(200).json(rezultat);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// --------------------PRIHVAĆANJE: STATUS=ODOBRENO, i VOZILO--------------------------------------
router.put(
  "/prihvati/:id",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { id } = req.params;
    const { id_vozila } = req.body;

    try {
      const rezervacija = await Rezervacija.findById(id);
      if (!rezervacija) {
        return res.status(404).json({ error: "Rezervacija nije pronađena" });
      }

      const vozilo = await mongoose.model("Vozilo").findById(id_vozila);
      if (!vozilo) {
        return res.status(404).json({ error: "Vozilo nije pronađeno" });
      }

      if (vozilo.status !== "dostupno") {
        return res.status(400).json({ error: "Vozilo nije dostupno" });
      }

      //ništa od ovoga se u pravilu neće desiti jer daje samo dostupna vozila koja mogu bit tad rezervirana u ponudu, al ajde

      if (vozilo.tip_vozila !== rezervacija.tip_vozila) {
        return res.status(400).json({
          error: `Tip vozila ne odgovara traženom tipu. Traženi tip je ${rezervacija.tip_vozila}, a dodijeljeni tip je ${vozilo.tip_vozila}.`,
        });
      }

      const odobreneRezervacije = await Rezervacija.find({
        id_vozila: id_vozila,
        status: "odobreno",
      });

      const vrijemePocetka = new Date(rezervacija.vrijeme_pocetka);
      const vrijemeZavrsetka = new Date(rezervacija.vrijeme_zavrsetka);

      for (let r of odobreneRezervacije) {
        const rPocetak = new Date(r.vrijeme_pocetka);
        const rZavrsetak = new Date(r.vrijeme_zavrsetka);

        if (
          (vrijemePocetka >= rPocetak && vrijemePocetka < rZavrsetak) ||
          (vrijemeZavrsetka > rPocetak && vrijemeZavrsetka <= rZavrsetak) ||
          (vrijemePocetka <= rPocetak && vrijemeZavrsetka >= rZavrsetak)
        ) {
          return res.status(400).json({
            error:
              "Vrijeme rezervacije se preklapa s postojećom odobrenom rezervacijom za ovo vozilo",
          });
        }
      }

      const korisnikRezervacije = await Rezervacija.find({
        id_korisnika: rezervacija.id_korisnika,
        status: "odobreno",
      });

      for (let r of korisnikRezervacije) {
        const rPocetak = new Date(r.vrijeme_pocetka);
        const rZavrsetak = new Date(r.vrijeme_zavrsetka);

        if (
          (vrijemePocetka >= rPocetak && vrijemePocetka < rZavrsetak) ||
          (vrijemeZavrsetka > rPocetak && vrijemeZavrsetka <= rZavrsetak) ||
          (vrijemePocetka <= rPocetak && vrijemeZavrsetka >= rZavrsetak)
        ) {
          return res.status(400).json({
            error:
              "Vrijeme rezervacije se preklapa s postojećom odobrenom rezervacijom ovog korisnika",
          });
        }
      }

      rezervacija.id_vozila = id_vozila;
      rezervacija.status = "odobreno";

      await rezervacija.save();

      res.status(200).json({ message: "Rezervacija je prihvaćena" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// -----------------------------------------------------------------------------

router.put("/otkazi/:id", async (req, res) => {
  const { id } = req.params; // ID korisnika
  try {
    const rezervacija = await Rezervacija.findById(id);
    if (!rezervacija) {
      return res.status(404).send("Rezervacija nije pronađena");
    }

    const currentTime = new Date();
    if (rezervacija.vrijeme_pocetka < currentTime) {
      return res
        .status(400)
        .send("Rezervacija je već počela, ne može se otkazati");
    }

    rezervacija.status = "otkazano";
    await rezervacija.save();

    res.status(200).send("Rezervacija je uspješno otkazana");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// --------------------------ODBIJANJE------------------------------------------
router.put(
  "/odbij/:id",

  async (req, res) => {
    const { id } = req.params;

    try {
      const rezervacija = await Rezervacija.findById(id);
      if (!rezervacija) {
        return res.status(404).json({ error: "Rezervacija nije pronađena" });
      }

      if (rezervacija.status === "odobreno") {
        return res.status(400).json({
          error: "Odobrena rezervacija ne može biti odbijena",
        });
      }

      rezervacija.status = "odbijeno";
      await rezervacija.save();

      res.status(200).json({ message: "Rezervacija je odbijena" });
    } catch (error) {
      console.error("Greška pri obradi zahtjeva: ", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = {
  router,
  Rezervacija,
};
