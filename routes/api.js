const express = require("express");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../model/user");
const authController = require("../controllers/auth");
const snippetContoller = require("../controllers/snippet");

const router = express.Router();

router
  .route("/auth/signup")
  .get(authController.getSignup)
  .put(authController.putSignup);

router
  .route("/auth/login")
  .get(authController.getLogin)
  .post(authController.postLogin);

router
  .route("/snippet")
  .get(snippetContoller.createSnippet)
  .post(snippetContoller.createSnippet);

module.exports = router;
