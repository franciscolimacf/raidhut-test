const express = require("express");
const passport = require("passport");

const router = new express.Router();

const userController = require("../controllers/userController");

router.get("/profile", userController.profile);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.put("/edit", userController.put);
router.delete("/delete", userController.delete);
router.get("/activity", userController.logs);

module.exports = router;
