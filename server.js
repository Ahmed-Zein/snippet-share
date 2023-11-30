require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// const router = require("./routes/router");
const auth = require("./utils/auth");
// const apiRouter = require("./routes/api");

const app = express();

app.disable("x-powered-by");

// app.set("view engine", "ejs");
// app.set("views", "views");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signup", auth.singup);
app.post("/signin", auth.singin);

app.use("/api", auth.protect);
// app.use("/api", apiRouter);

// app.get("/", (req, res, err) => {
//   res.send("dd");
// });

module.exports = async () =>
  mongoose.connect(process.env.mongoUri).then((result) => {
    app.listen(3000, () => {
      console.log(">> server started");
    });
  });
