const express = require("express");
const controller = require("./snippet.controller");
const router = express.Router();

router.get("/", controller.getAll);

router.put("/create", controller.addOne);

module.exports = router;
