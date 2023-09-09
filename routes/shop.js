const express = require("express");

const router = express.Router();
//Controller import
const shopController = require("../controller/shop");

router.get("/shop", shopController.getProducts);

module.exports = router;
