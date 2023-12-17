const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`file0 `, file);
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(`file multer `, file);
    cb(null, file.originalname);
  },
});

module.exports = upload = multer({ storage });
