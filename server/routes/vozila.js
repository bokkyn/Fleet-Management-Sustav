const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET_KEY = "splitskibijeli";
router.use(cookieParser());
//-----------------------------------------------------------------
const voziloShema = new mongoose.Schema({
  registracija: { type: String, unique: true, required: true },
  marka: { type: String, required: true },
  model: { type: String, required: true },
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
  mjenjac: {
    type: String,
    enum: ["automatski", "sekvencijski", "mehanički"],
    required: true,
  },
  godina_proizvodnje: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v <= new Date().getFullYear();
      },
      message: "Godina proizvodnje ne može biti veća od trenutne godine",
    },
  },
  status: {
    type: String,
    enum: ["dostupno", "nedostupno", "servis", "neregistrirano"],
    default: "dostupno",
  },
  datum_tehnickog_pregleda: { type: Date, required: true },
});

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

const provjeriUlogu = (uloga) => (req, res, next) => {
  if (req.korisnik && req.korisnik.uloga === uloga) {
    next();
  } else {
    res
      .status(403)
      .send(`Zabranjen pristup - vaša uloga je ${req.korisnik.uloga}`);
  }
};

//-----------------------------------------------------------------
voziloShema.pre("save", function (next) {
  if (this.datum_tehnickog_pregleda < new Date()) {
    this.status = "neregistrirano";
  }
  next();
});

const Vozilo = mongoose.model("Vozilo", voziloShema, "Vozila");

// ---------------------------------------------------DODAVANJE VOZILA---------------------------------
router.post("/", async (req, res) => {
  const {
    registracija,
    marka,
    model,
    tip_vozila,
    mjenjac,
    godina_proizvodnje,
    status,
    datum_tehnickog_pregleda,
  } = req.body;

  try {
    const novoVozilo = await Vozilo.create({
      registracija,
      marka,
      model,
      tip_vozila,
      mjenjac,
      godina_proizvodnje,
      status,
      datum_tehnickog_pregleda,
    });
    res
      .status(201)
      .json({ message: "Vozilo spremljeno u bazu", data: novoVozilo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { marka, mjenjac, tip_vozila } = req.query;

    try {
      const filter = {};

      if (marka) {
        filter.marka = marka;
      }

      if (mjenjac) {
        filter.mjenjac = mjenjac;
      }

      if (tip_vozila) {
        filter.tip_vozila = tip_vozila;
      }

      const vozila = await Vozilo.find(filter);
      res.status(200).json(vozila);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// ------------------------------DOHVAT DOSTUPNIH------------------------------------------------

router.post(
  "/spremna-za-iznajmljivanje",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { pocetak, zavrsetak, tip_vozila } = req.body;

    const vrijemePocetka = new Date(pocetak);
    const vrijemeZavrsetka = new Date(zavrsetak);

    try {
      const filter = { status: "dostupno" };

      if (tip_vozila) {
        filter.tip_vozila = tip_vozila;
      }

      const dostupnaVozila = await Vozilo.find(filter);

      const zauzeteRezervacije = await mongoose.model("Rezervacija").find({
        status: "odobreno",
        $or: [
          {
            vrijeme_pocetka: { $lt: vrijemeZavrsetka },
            vrijeme_zavrsetka: { $gt: vrijemePocetka },
          },
        ],
      });

      const zauzetaVozilaIds = zauzeteRezervacije.map((rezervacija) =>
        rezervacija.id_vozila.toString()
      );
      const slobodnaVozila = dostupnaVozila.filter(
        (vozilo) => !zauzetaVozilaIds.includes(vozilo._id.toString())
      );

      res.status(200).json(slobodnaVozila);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// ------------------------------SERVIS------------------------------------------------
router.put("/servis/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Neispravan ID vozila");
    }

    const vozilo = await Vozilo.findById(id);
    if (!vozilo) {
      return res.status(404).send("Vozilo nije pronađeno");
    }

    vozilo.status = "servis";
    await vozilo.save();

    res.status(200).send("Vozilo je uspješno poslano na servis");
  } catch (error) {
    console.error("Greška pri slanju vozila na servis:", error.message);
    res.status(500).send("Došlo je do pogreške pri slanju vozila na servis");
  }
});

// ------------------------------POVRAT VOZILA SA SERVISA------------------------------------
router.put("/povrat-sa-servisa/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const vozilo = await Vozilo.findById(id);
    if (!vozilo) {
      return res.status(404).send("Vozilo nije pronađeno");
    }

    const trenutniDatum = new Date();

    if (
      vozilo.datum_tehnickog_pregleda &&
      vozilo.datum_tehnickog_pregleda < trenutniDatum
    ) {
      vozilo.status = "neregistrirano"; //ovisno koji je status, možda je u međuvremenu istekla reg
    } else {
      vozilo.status = "dostupno";
    }

    await vozilo.save();

    res.status(200).send("Vozilo je vraćeno sa servisa");
  } catch (error) {
    console.error("Greška pri povratu vozila sa servisa:", error.message);
    res.status(500).send("Došlo je do pogreške pri povratu vozila sa servisa");
  }
});

router.put("/azurirajTehnicki/:id", async (req, res) => {
  const { id } = req.params;
  const { novi_datum_tehnickog_pregleda } = req.body;

  console.log(
    "Primljeni novi datum tehničkog pregleda:",
    novi_datum_tehnickog_pregleda
  );

  try {
    const noviDatumObj = new Date(novi_datum_tehnickog_pregleda);
    console.log("Pretvoreni novi datum objekat:", noviDatumObj);

    if (isNaN(noviDatumObj)) {
      return res.status(400).send("Nevalidan datum tehničkog pregleda.");
    }

    const vozilo = await Vozilo.findById(id);
    if (!vozilo) {
      console.error("Vozilo nije pronađeno");
      return res.status(404).send("Vozilo nije pronađeno");
    }

    console.log(
      "Trenutni datum tehničkog pregleda vozila:",
      vozilo.datum_tehnickog_pregleda
    );

    if (noviDatumObj <= vozilo.datum_tehnickog_pregleda) {
      console.error("Novi datum mora biti nakon trenutnog datuma");
      return res
        .status(400)
        .send(
          "Novi datum tehničkog pregleda mora biti nakon trenutnog datuma tehničkog pregleda"
        );
    }

    vozilo.datum_tehnickog_pregleda = noviDatumObj;
    await vozilo.save();

    res.status(200).send("Datum tehničkog pregleda uspješno ažuriran");
  } catch (error) {
    console.error("Greška u serveru: ", error.message);
    res.status(500).send(error.message);
  }
});

router.delete(
  "/brisanje/:id",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const vozilo = await Vozilo.findById(id);
      if (!vozilo) {
        return res.status(404).send("Vozilo nije pronađeno");
      }
      await Vozilo.findByIdAndDelete(id);

      res.status(200).send("Vozilo uspješno obrisano");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
