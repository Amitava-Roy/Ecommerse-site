const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },

    cart: [
      {
        product: {
          type: Object,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.method.findUser = (password, name, email) => {
  User.findOne({
    email: email,
  }).then((data) => {
    if (data) {
      console.log("found");
      return Promise.resolve(data);
    }
    console.log("not found");

    return Promise.resolve(false);
  });
};

module.exports = mongoose.model("User", userSchema);
