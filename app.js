const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const compression = require("compression");

//flie storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "img" +
        Date.now().toString() +
        "-" +
        file.originalname
    );
  },
});
//filtering to allow only jpg file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//route import
const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
// compression middleware
app.use(compression());

app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(
  "/images",
  express.static(path.join(__dirname, "images"))
);

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

app.use(shopRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use((error, req, res, next) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  res
    .status(error.statusCode)
    .json({ error: error.message });
});

//connect to database
const url = `mongodb+srv://user:1234@cluster0.tb7sua0.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => app.listen(process.env.PORT || 8080))
  .catch((err) => console.log(err));
