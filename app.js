require("rootpath")();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("config/jwt");
const errorHandler = require("config/error-handler");
const multer = require("multer");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes users
app.use("/profile", require("./users/users.controller"));

// upload file
//app.use("/api", require("./routes/file-router.js"));

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `favlix-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//let upload = multer({ dest: "uploads/" });

app.post("/file", upload.single("file"), (req, res, next) => {
  const file = req.file;
  console.log(file.filename);
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

// global error handler
app.use(errorHandler);

// Assume 404 since no middleware responded
app.use(function (req, res, next) {
  console.log("error (404)");
  res.status(404).render("errors/404", {
    url: req.url,
    error: "Not found",
  });
});

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 5000;
const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
