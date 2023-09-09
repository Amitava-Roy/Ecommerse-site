const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const userController = require("../controller/user");
const isAuth = require("../middleware/userAuth");

router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("wrong email"),
  ],
  userController.postSignup
);
router.post("/login", userController.postLogin);
// router.post(
//   "/add-to-cart",
//   isAuth,
//   userController.postCart
// );
router.post("/info", isAuth, userController.postUser);
router.post("/order", isAuth, userController.postOrder);
router.post("/get-order", isAuth, userController.getOrders);

module.exports = router;
