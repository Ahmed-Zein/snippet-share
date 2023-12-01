const express = require("express");

const controller = require("./snippet.controller");
const protect = require("../../utils/auth").protect;

const router = express.Router();

router.get("/share/", controller.getOne);

router.get("/", protect, controller.getAll);

router.post("/create", protect, controller.addOne);
// router.delete()

module.exports = router;
