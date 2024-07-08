const multer = require("multer");
const accountStorage = require("./cloudinaryAccountStorage");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/svg": "svg",
};

const fileUpload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  storage: accountStorage,
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext);
  },
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
