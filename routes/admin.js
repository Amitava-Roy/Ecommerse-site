const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/adminAuth");
const adminController = require("../controller/admin");
// end point for adding product
router.post(
  "/add-product",
  isAuth,
  adminController.postProduct
);
// end point for editing product
router.post(
  "/edit-product",
  isAuth,
  adminController.editProduct
);
router.post("/signup", adminController.postSignup);
router.post("/login", adminController.postLogin);
router.post("/delet", isAuth, adminController.postDelet);

module.exports = router;
