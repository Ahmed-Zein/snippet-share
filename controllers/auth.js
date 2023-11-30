const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../model/user");

exports.getSignup = (req, res, err) => {
  res.send({ message: "hello back" });
};

exports.putSignup = (req, res, err) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password != confirmPassword) {
    res.status = 400;
    res.send({ message: "err" });
  }

  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.send({ message: "user already exists" });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          snippets: [],
        });
        return user.save();
      })
      .then((res) => {
        console.log("usr created");
        res.send({ message: "user created" });
      });
  });
};

exports.getLogin = (req, res, next) => {
  res.send({ message: "hello back" });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.send({ message: "email not exist" });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            return res.send({ user: user });
          }
          return res.send({ message: "wrong password" });
        })
        .catch((err) => {
          res.status(500).send({ message: "server error" });
        });
    })
    .catch((err) => console.log(err));
};
