const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const storage = (folder = "uploads") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./public/${folder}`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = (folder) => multer({ storage: storage(folder), fileFilter });

module.exports = upload;
