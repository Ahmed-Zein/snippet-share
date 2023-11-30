require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const auth = require("./utils/auth");
const snippet = require("./resources/snipppet/snippet.route");

const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signup", auth.singup);
app.post("/signin", auth.singin);

app.use("/api", auth.protect);
app.use("/api", snippet);

module.exports = async () =>
  mongoose.connect(process.env.mongoUri).then((result) => {
    app.listen(3000, () => {
      console.log(">> server started");
    });
  });
