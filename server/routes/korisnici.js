const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Rezervacija } = require("./rezervacije");
const { Problem } = require("./problemi");
const saltRunde = 10;
const cors = require("cors");
const SECRET_KEY = "splitskibijeli"; //ovo ka nebi smia uploadat :)

router.use(cookieParser());
router.use(cors({ origin: "http://localhost:5173" }));

// -----------------------------------------------------------------------------

const korisnikShema = new mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  datum_rodjenja: {
    type: Date,
    required: true,
    validate: [
      {
        validator: function (v) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return v < today;
        },
        message: "Uozbiljite se, ovaj korisnik se nije ni rodio", //ovu poruku frontend piše kd dođe do problema
      },
      {
        validator: function (v) {
          const today = new Date();
          const age = today.getFullYear() - v.getFullYear();
          return age >= 18;
        },
        message:
          "Korisnik mora biti stariji od 18 godina kako bi imao vozačku dozvolu i mogao pristupiti vozilima",
      },
    ],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Unesite validnu email adresu",
    },
  },
  lozinka: { type: String, required: true },
  uloga: {
    type: String,
    required: true,
    enum: ["korisnik", "administrator"],
  },
  mode: {
    type: String,
    default: "normalno",
    enum: ["normalno", "veselo"],
  },
});

// -----------------------------------------------------------------------------
korisnikShema.pre("save", async function (next) {
  if (this.isModified("lozinka")) {
    try {
      this.lozinka = await bcrypt.hash(this.lozinka, saltRunde);
    } catch (error) {
      next(error);
    }
  }
  next();
});

const Korisnik = mongoose.model("Korisnik", korisnikShema, "Korisnici");

//ovdi provjeravamo cookie, ovo bi tribali na skoro svakoj ruti
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

// --------------------------LIB ZA OGRANIČAVANJE LOGINA--------------------------
const prijavaLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Previše pokušaja prijave. Pokušajte ponovno kasnije.",
});

// ---------------------DODAVANJE KORISNIKA--------------------------------------
router.post(
  "/",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { ime, prezime, datum_rodjenja, email, lozinka, uloga } = req.body;

    const noviKorisnik = new Korisnik({
      ime,
      prezime,
      datum_rodjenja,
      email,
      lozinka,
      uloga,
    });

    try {
      await noviKorisnik.save();
      res.send("Korisnik dodan u bazu");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// ----------------------PRIJAVA KORISNIKA------------------------
router.post("/prijava", prijavaLimiter, async (req, res) => {
  try {
    const korisnikBaza = await Korisnik.findOne({ email: req.body.email });
    if (
      korisnikBaza &&
      (await bcrypt.compare(req.body.lozinka, korisnikBaza.lozinka))
    ) {
      const token = jwt.sign(
        { id: korisnikBaza._id, uloga: korisnikBaza.uloga },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      res.cookie("accessToken", token, {
        httpOnly: true, // ovaj token smo zaštitili od pristupa
        maxAge: 7200000,
        secure: false,
      });

      res.cookie("loggedIn", true, {
        httpOnly: false, //ovaj nismo, i koristi mi da lakše znan kad je neko logiran, nasaje i nestaje u isto vrime kad i token
        maxAge: 7200000,
        secure: false,
      });

      // podatke spremamo u localstorage, naravno ove nabitne podatke, ne lozinku, iako njih može minjat, provalnik neće puno moć jer svaku funkciju pregledava token, pa neće imat pristup
      const korisnickiPodaci = {
        id: korisnikBaza._id.toString(),
        ime: korisnikBaza.ime,
        prezime: korisnikBaza.prezime,
        datum_rodjenja: korisnikBaza.datum_rodjenja,
        email: korisnikBaza.email,
        uloga: korisnikBaza.uloga,
        mode: korisnikBaza.mode,
      };
      res.status(200).json({
        message: "Prijava uspješna",
        korisnik: korisnickiPodaci,
      });
    } else {
      res.status(401).send("Neispravni podaci za prijavu");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ----------------------DOHVAT SVIH KORISNIKA (admin)----------------------------
router.get(
  "/",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    try {
      const korisnici = await Korisnik.find();
      res.status(200).json(korisnici);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// -------------------- ODJAVA (brisanje tokena) ----------------------
router.post("/odjava", (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
    });

    res.status(200).send("Uspješno ste odjavljeni");
  } catch (error) {
    res.status(500).send("Greška prilikom odjave");
  }
});

// ----------------------DOHVAT PODATAKA O TRENUTNOM KORISNIKU----------------------------
router.get("/me", provjeriCookie, async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.korisnik.id).select(
      "-lozinka" // bez lozinke naravno
    );

    if (!korisnik) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    res.status(200).json(korisnik);
  } catch (error) {
    res.status(500).send("Greška pri dohvaćanju podataka");
  }
});

//---------------------DOHVAT REZERVACIJA ZA SEBE----------------------------
router.get("/moje-rezervacije", provjeriCookie, async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.korisnik.id).select(
      "-lozinka" //radi sig nema lozinke
    );

    if (!korisnik) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    const rezervacije = await Rezervacija.find({ id_korisnika: korisnik.id })
      .populate("id_korisnika", "ime prezime email") //Ovako se popunjava s onim šta nije u našoj tablici već u drugim
      .populate("id_vozila", "marka model registracija tip_vozila")
      .exec();

    res.json(rezervacije);
  } catch (error) {
    console.error("Greška pri dohvaćanju rezervacija:", error);
    res.status(500).json({ poruka: "Greška pri dohvaćanju rezervacija." });
  }
});

//--------------------ISTO ZA PROBLEME----------------------------
router.get("/moji-problemi", provjeriCookie, async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.korisnik.id).select(
      "-lozinka"
    );

    if (!korisnik) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    const problemi = await Problem.find({ id_korisnika: korisnik.id })
      .populate("id_korisnika", "ime prezime email")
      .populate("id_vozila", "marka model registracija tip_vozila")
      .exec();

    res.json(problemi);
  } catch (error) {
    console.error("Greška pri dohvaćanju problema:", error);
    res.status(500).json({ poruka: "Greška pri dohvaćanju problema." });
  }
});

router.get(
  "/",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { status, id_vozila } = req.query;

    try {
      const filter = {};

      if (status) {
        filter.status = status;
      }

      if (id_vozila) {
        filter.id_vozila = id_vozila;
      }

      const rezervacije = await Rezervacija.find(filter)
        .populate("id_korisnika", "ime prezime email")
        .populate("id_vozila", "marka model registracija tip_vozila")
        .exec();

      res.status(200).json(rezervacije);
    } catch (error) {
      console.error("Greška pri dohvaćanju rezervacija:", error);
      res.status(500).send({ poruka: "Greška pri dohvaćanju rezervacija." });
    }
  }
);

// -------------------- BRISANJE KORISNIKA IZ BAZE ------------------------
router.delete(
  "/brisanje/:id",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const korisnikId = req.params.id;

    try {
      const korisnik = await Korisnik.findById(korisnikId);
      if (!korisnik) {
        return res.status(404).send("Korisnik nije pronađen");
      }

      await Korisnik.findByIdAndDelete(korisnikId); //postoji ovako par dobrih brzih funkcijica, da se ne mucis bzvz
      res.status(200).send("Korisnik je uspješno obrisan iz baze");
    } catch (error) {
      res.status(500).send("Greška pri brisanju korisnika");
    }
  }
);

// -------------------- POSTAVLJANJE MODE NA VESELO ----------------------
router.put("/postavi-veselo", provjeriCookie, async (req, res) => {
  try {
    if (!req.korisnik || !req.korisnik.id) {
      return res.status(401).send("Korisnik nije autentificiran");
    }

    const korisnik = await Korisnik.findById(req.korisnik.id);

    if (!korisnik) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    korisnik.mode = "veselo";
    await korisnik.save();

    res.status(200).json({
      message: "Mode je uspješno postavljen na veselo",
      korisnik,
    });
  } catch (error) {
    console.error("Greška pri postavljanju moda na veselo:", error);
    res.status(500).send("Greška pri postavljanju mode atributa");
  }
});

router.put("/postavi-normalno", provjeriCookie, async (req, res) => {
  try {
    if (!req.korisnik || !req.korisnik.id) {
      return res.status(401).send("Korisnik nije autentificiran");
    }

    const korisnik = await Korisnik.findById(req.korisnik.id);

    if (!korisnik) {
      return res.status(404).send("Korisnik nije pronađen");
    }

    korisnik.mode = "normalno";
    await korisnik.save();

    res.status(200).json({
      message: "Mode je uspješno postavljen na normalno",
      korisnik,
    });
  } catch (error) {
    console.error("Greška pri postavljanju moda na normalno:", error);
    res.status(500).send("Greška pri postavljanju mode atributa");
  }
});

module.exports = router;
