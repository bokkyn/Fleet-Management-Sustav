const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET_KEY = "splitskibijeli"; //ovo ka nebi smia uploadat :)
router.use(cookieParser());

// -----------------------------------------------------------------------------

const feedbackSchema = new mongoose.Schema({
  text: { type: String, required: true },
  datum: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema, "Feedback");

// ------------ovo svako može vidit, al ne ćelimo da neko treći piše komentare, tako da pregledajemo cookie i ovdje---------------------------------------------------------

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

// ------------------------DODAVANJE--------------------------------------------
router.post("/", provjeriCookie, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).send("Feedback tekst je obavezan.");
  }

  const noviFeedback = new Feedback({
    text: text.trim(),
  });

  try {
    await noviFeedback.save();
    res.send("Feedback uspješno poslan.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// -----------------------DOHVAĆANJE--------------------------------------------
router.get("/", provjeriCookie, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ datum: -1 }); // Sortirano od najnovijeg
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ------------------------BRISANJE---------------------------------------------
router.delete(
  "/:id",
  provjeriCookie,
  provjeriUlogu("administrator"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const feedback = await Feedback.findByIdAndDelete(id);
      if (!feedback) {
        return res.status(404).send("Feedback nije pronađen.");
      }
      res.send("Feedback uspješno obrisan.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
