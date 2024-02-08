const express = require("express");

const router = express.Router();

const User = require("../models/user");
const Log = require("../models/log");

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home", { user: req.user });
  } else {
    res.render("home");
  }
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/profile", async function (req, res) {
  if (req.isAuthenticated()) {
    const foundUser = await User.findOne({ username: req.user.username });
    const foundLogs = await Log.find({ username: req.user.username }).sort({
      createdAt: -1,
    });

    res.render("profile", { activity: foundLogs, user: foundUser });
  } else {
    res.redirect("/");
  }
});

router.get("/changeemail", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("changeemail");
  } else {
    res.redirect("/");
  }
});

router.get("/changepassword", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("changepassword");
  } else {
    res.redirect("/");
  }
});
module.exports = router;
