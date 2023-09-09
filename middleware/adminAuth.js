const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.get("Authorization");

  try {
    const data = jwt.verify(token, "secrate");
    if (data) {
      req.email = data.email;
      req._id = data._id;
      next();
    }
  } catch (err) {
    next(err);
  }
};
