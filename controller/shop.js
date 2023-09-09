const Product = require("../model/product");
exports.getProducts = (req, res, next) => {
  Product.find().then((data) => {
    res.status(200).json(data);
  });
};
