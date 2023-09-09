const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    image: {
      type: String,
    },
    price:{
      type:Number
    },
    category:{
      type:String
    }
  },
  {
    collection: "ecommers",
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
