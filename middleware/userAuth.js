const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.get("Authorization");
  try {
    data = jwt.verify(token, "secrateuser");
    if (data._id) {
      req.userId = data._id;
      next();
    }
  } catch {
    throw new Error("try log in");
  }
};
