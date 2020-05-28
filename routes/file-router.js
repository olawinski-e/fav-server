const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const router = express.Router();

module.exports = router;

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `favlix${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//let upload = multer({ dest: 'uploads/' })

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
