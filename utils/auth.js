const bcrypt = require("bcryptjs");
const User = require("../resources/user/user.model");
const jwt = require("jsonwebtoken");

exports.newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.jwtSecret, {
    expiresIn: process.env.jwtExp,
  });
};

exports.verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.jwtSecret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

exports.singup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password != confirmPassword) {
    res.status = 400;
    res.send({ message: "passwords doesn't match" });
  }

  const alreadyExists = await User.findOne({ email: email }).exec();
  if (alreadyExists) {
    return res.send({ message: "user already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) throw Error("server error");

    const user = await User.create({
      email: email,
      password: hashedPassword,
      snippets: [],
    });
    const token = this.newToken(user);
    res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e });
  }
};

exports.singin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email })
    .select("email password")
    .exec();

  if (!user) {
    return res.send({ message: "email not exist" });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.send({ message: "wrong password" });
  }
  const token = this.newToken(user);

  res.send({ token });
};

exports.protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;

  try {
    payload = await this.verifyToken(token);
  } catch (e) {
    console.error(e);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};
