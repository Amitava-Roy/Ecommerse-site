const Product = require("../model/product");
const Admin = require("../model/admin");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.postProduct = (req, res, next) => {
  let { name, details, price, category, image } = req.body;
  // if (!req.file) {
  //   const error = new Error("Need an image to add Product");
  //   return next(error);
  // }

  // const image = req.file.path;

  if (!price) {
    price = 0;
  }
  if (!category) {
    category = "any";
  }
  Admin.findOne({ email: req.email }).then((result) => {
    const creator = result._id;
    console.log(creator);
    const product = new Product({
      name,
      details,
      creator,
      image,
      price,
      category,
    });
    product
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.editProduct = (req, res, next) => {
  const { name, details, price, category, _id, image } =
    req.body;

  Product.findOneAndUpdate(
    { _id: _id },
    {
      name: name,
      details: details,
      price: price,
      category: category,
      image: image,
    },
    { new: true }
  )
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  Admin.findOne({ email: email }).then((result) => {
    if (result) {
      console.log("what");
      const error = new Error(
        "the email already exit try to log in"
      );
      error.statusCode = 404;
      return next(error);
    }
    const admin = new Admin({
      name,
      email,
      password,
    });
    admin
      .save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postLogin = (req, res, next) => {
  const { name, email, password } = req.body;

  Admin.findOne({
    name: name,
    email: email,
    password: password,
  })
    .then((result) => {
      if (!result) {
        const error = new Error("no user found. sign up");
        return next(error);
      }

      const token = jwt.sign(
        { email: email, _id: result._id },
        "secrate",
        {
          expiresIn: "2h",
        }
      );

      res.json({
        token: token,
        admin: result._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postDelet = (req, res, next) => {
  const { image, _id, creator } = req.body;
  if (creator.toString() !== req._id.toString()) {
    return new Error("Cant delet product you didnt create");
  }
  Product.deleteOne({ _id: _id })
    .then((result) => {
      fs.unlink(image, (error) => {
        console.log(error);
        res.json({ message: "Deleted" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
