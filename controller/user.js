const User = require("../model/user");
const Order = require("../model/order");
const jwt = require("jsonwebtoken");
const user = require("../model/user");
const Product = require("../model/product");
const { validationResult } = require("express-validator");
const { MongoError } = require("mongodb");
exports.postSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const error = validationResult(req);
  if (!error.isEmpty) {
    res.status(422).json({ message: "need valid email" });
  }
  User.findOne({ email: email })
    .then((data) => {
      console.log(data);
      if (data) {
        const error = new Error("email already exits");

        return next(error);
      }
      const user = new User({
        name: name,
        email: email,
        password: password,
        cart: [],
      });
      user
        .save()
        .then((data) => {
          console.log(data);
          res.json(data);
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogin = (req, res, next) => {
  let { name, email, password } = req.body;
  User.findOne({ name, email, password })
    .then((data) => {
      if (data) {
        const token_user = jwt.sign(
          { email, _id: data._id },
          "secrateuser",
          { expiresIn: "2hr" }
        );
        res.json({ token_user, email });
      } else {
        const error = new Error("cant find please sign up");
        return next(error);
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postOrder = (req, res, next) => {
  const { items } = req.body;
  User.findOne({ _id: req.userId })
    .then((user) => {
      const order = new Order({
        user: req.userId,
        items: items,
      });
      order.save().then((data) => {
        User.updateOne({ _id: user._id }, { cart: [] })
          .then((data) => {
            res.json({ data });
          })
          .catch();
      });
    })
    .catch();
};
exports.postUser = (req, res, next) => {
  const id = req.userId;
  // Order.findOne({ user: id })
  //   .populate("items.prodId")
  //   .exec()
  //   .then((data) => {
  //     console.log("data");
  //   });
  User.findOne({ _id: id })
    .then((result) => {
      res.json({
        name: result.name,
        email: result.email,
        cart: result.cart,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.getCart = (req, res, next) => {
//   User.find({ _id: req.userId }).then((result) => {
//     res.json({ cart: result.cart });
//   });
// };

exports.getOrders = (req, res, next) => {
  console.log(req.userId);
  Order.find({ user: req.userId })
    .then((data) => {
      console.log(data);
      res.json({ orders: data });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
