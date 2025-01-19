const express = require("express");
const vozilaRouter = require("./routes/vozila");
const korisniciRouter = require("./routes/korisnici");
const { router: rezervacijeRouter } = require("./routes/rezervacije");
const { router: problemiRouter } = require("./routes/problemi");
const feedbackRouter = require("./routes/feedback");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Greška pri spajanju:", error);
});
db.once("open", function () {
  console.log("Spojeni smo na MongoDB bazu");
});

app.use("/vozila", vozilaRouter);
app.use("/korisnici", korisniciRouter);
app.use("/rezervacije", rezervacijeRouter);
app.use("/problemi", problemiRouter);
app.use("/feedback", feedbackRouter);
