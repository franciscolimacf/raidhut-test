require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const methodOverride = require("method-override");

const userRoutes = require("./routes/userRoutes");
const pageRoutes = require("./routes/pagesRoutes");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride("_method"));

const port = process.env.APP_PORT || 3000;
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
app.use("/", pageRoutes);

app.listen(port, function () {
  console.log(`Front-end running on port http://localhost:${port}`);
});
