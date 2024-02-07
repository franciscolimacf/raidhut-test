require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const secret = process.env.SESSION_SECRET || "frasesecreta";

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const ipdb = process.env.IP_DB;

const db_connection = require("./config/db");

app.use("/user", userRoutes);

app.listen(3000, function () {
  console.log("App running on port 3000");
});
