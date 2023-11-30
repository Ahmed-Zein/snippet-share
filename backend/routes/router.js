const express = require("express");

const authController = require("../controllers/auth");
const snippetController = require("../controllers/snippet");

const router = express.Router();

router.post("/createsnippet", snippetController.createSnippet);

router
  .route("/auth/signup")
  .post(authController.postSignup)
  .get((req, res, err) => {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: "",
      oldInput: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      isAuthenticated: false,
      validationErrors: [],
    });
  });

router
  .route("/login")
  .get(authController.getLogin)
  .post(authController.postLogin);

module.exports = router;
