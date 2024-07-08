require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'de3fd656e',
  api_key: '567136493151877',
  api_secret: 'qgupOewshfhVbTN8denyEQVYXQQ',
  secure: true,
});


module.exports = cloudinary;