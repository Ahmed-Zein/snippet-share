require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// const router = require("./routes/router");
const apiRouter = require("./routes/api");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api", apiRouter);

app.get("/", (req, res, err) => {
  res.send("dd");
});

mongoose.connect(process.env.mongoUri).then((result) => {
  app.listen(3000, () => {
    console.log(">> server started");
  });
});
