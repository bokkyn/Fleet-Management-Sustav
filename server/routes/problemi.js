const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET_KEY = "splitskibijeli";
router.use(cookieParser());

const problemShema = new mongoose.Schema({
  id_korisnika: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Korisnik",
    required: true,
  },
  id_vozila: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vozilo",
    required: true,
  },
  opis_problema: { type: String, required: true },
  datum_prijave: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["otvoreno", "u tijeku", "odbijeno", "zatvoreno"],
    default: "otvoreno",
  },
  kategorija: {
    type: String,
    enum: [
      "mehanički kvar",
      "oštećenje karoserije",
      "administrativni problem",
      "ostalo",
    ],
    required: true,
  },
  prioritet: {
    type: String,
    enum: ["nizak", "srednji", "visok"],
    required: true,
  },
});

const Problem = mongoose.model("Problem", problemShema, "Problemi");

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

router.post("/", provjeriCookie, async (req, res) => {
  const { id_korisnika, id_vozila, opis_problema, kategorija, prioritet } =
    req.body;

  if (
    !id_korisnika ||
    !id_vozila ||
    !opis_problema ||
    !kategorija ||
    !prioritet
  ) {
    return res.status(400).send("Svi podaci moraju biti poslani.");
  }

  const noviProblem = new Problem({
    id_korisnika,
    id_vozila,
    opis_problema,
    kategorija,
    prioritet,
  });

  try {
    await noviProblem.save();
    res.status(200).send("Problem uspješno prijavljen");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get(
  "/",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { prioritet, kategorija, id_vozila, id } = req.query;

    try {
      const filter = {};

      if (prioritet) {
        filter.prioritet = prioritet;
      }

      if (kategorija) {
        filter.kategorija = kategorija;
      }

      if (id_vozila) {
        filter.id_vozila = id_vozila;
      }

      if (id) {
        filter._id = id;
      }

      const problemi = await Problem.find(filter)
        .populate("id_korisnika", "ime prezime email")
        .populate("id_vozila", "marka model registracija tip_vozila")
        .exec();

      res.status(200).json(problemi);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.put(
  "/prihvati/:id",
  async (req, res) => {
    const { id } = req.params;

    try {
      const problem = await Problem.findById(id);
      if (!problem) {
        return res.status(404).send("Problem nije pronađen");
      }

      if (problem.status !== "otvoreno") {
        return res.status(400).send("Problem je već riješen ili nije otvoren");
      }
      problem.status = "u tijeku";
      await problem.save();
      res.status(200).send("Problem prihvaćen");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.put(
  "/odbij/:id",
  async (req, res) => {
    const { id } = req.params;
    try {
      const problem = await Problem.findById(id);
      if (!problem) {
        return res.status(404).send("Problem nije pronađen");
      }
      if (problem.status !== "otvoreno") {
        return res
          .status(400)
          .send("Problem je već riješen ili je prihvaćen na rješavanje");
      }
      problem.status = "odbijeno";
      await problem.save();

      res.status(200).send("Problem odbijen");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.put("/zatvori/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).send("Problem nije pronađen");
    }

    problem.status = "zatvoreno";
    await problem.save();

    res.status(200).send("Problem zatvoren");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = {
  router,
  Problem,
};
