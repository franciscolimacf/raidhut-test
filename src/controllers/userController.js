const passport = require("passport");
const User = require("../models/user");
const Log = require("../models/log");

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

class UserController {
  //  Register
  //
  //  Method : POST
  //  request body example:
  //  {
  //      "username": "username",
  //      "email": "email",
  //      "password": "password"
  //  }
  //
  async register(req, res) {
    if (!req.body.password)
      res.status(400).json({ message: "request must have password" });
    User.register(
      { username: req.body.username, email: req.body.email },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.status(400).json({ errors: err });
        } else {
          const newEvent = new Log({
            username: req.body.username,
            event: "User registered",
          });
          newEvent.save();

          passport.authenticate("local")(req, res, function () {
            const newEvent = new Log({
              username: req.body.username,
              event: "User logged in",
            });
            newEvent.save();

            res.redirect("/");
          });
        }
      }
    );
  }
  //  Login
  //
  //  Method : POST
  //  request body example:
  //  {
  //      "username": "username",
  //      "password": "password"
  //  }
  //
  async login(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: err });
      } else {
        passport.authenticate("local")(req, res, function () {
          const newEvent = new Log({
            username: req.body.username,
            event: "User logged in",
          });
          newEvent.save();

          res.redirect("/");
        });
      }
    });
  }
  //  Logout
  //
  //  Method : GET
  //  no request body required
  //
  //
  async logout(req, res) {
    req.logout(function (err) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: err });
      } else {
        res.redirect("/");
      }
    });
  }

  //  Edit user
  //
  //  Method : PUT
  //  request body example:
  //  {
  //      "email": "new email",
  //      "password": "new password"
  //  }
  //
  //  Note: both attributes are optional, but at least one is required.
  //
  async put(req, res) {
    if (!req.body.email && !req.body.password)
      res.status(401).json({
        message:
          "request must have at least an email or password to be updated",
      });

    if (req.isAuthenticated()) {
      if (req.body.password) {
        User.findByUsername(req.user.username).then(function (foundUser) {
          foundUser.setPassword(req.body.password, function () {
            const newEvent = new Log({
              username: req.user.username,
              event: "User changed password",
            });
            newEvent.save();
            foundUser.save();
            res.redirect("/profile");
          });
        });
      }

      if (req.body.email) {
        const updated = await User.findOneAndUpdate(
          { username: req.user.username },
          { email: req.body.email },
          { returnOriginal: false }
        );

        const newEvent = new Log({
          username: req.user.username,
          event: "User changed email",
        });
        newEvent.save();

        res.redirect("/profile");
      }
    } else {
      res.redirect("/");
    }
  }

  //  Delete user
  //
  //  Method : DELETE
  //  no request body required
  //
  //
  async delete(req, res) {
    if (req.isAuthenticated()) {
      const username = req.user.username;
      await User.findOneAndDelete({ username: req.user.username });

      req.logout(function (err) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: err });
        } else {
          const newEvent = new Log({
            username: username,
            event: "User deleted",
          });
          newEvent.save();

          res.status(200).json("user deleted");
        }
      });
    } else {
      res.redirect("/");
    }
  }

  //  Get user
  //
  //  Method : GET
  //  no request body required
  //
  //
  async profile(req, res) {
    if (req.isAuthenticated()) {
      const foundUser = await User.findOne({ username: req.user.username });
      res.status(200).json(foundUser);
    } else {
      res.status(401).json({ message: "user not authenticated" });
    }
  }

  //  Get user activity
  //
  //  Method : GET
  //  no request body required
  //
  //
  async logs(req, res) {
    if (req.isAuthenticated()) {
      const foundLogs = await Log.find({ username: req.user.username });
      res.status(200).json(foundLogs);
    } else {
      res.status(401).json({ message: "user not authenticated" });
    }
  }
}

module.exports = new UserController();
