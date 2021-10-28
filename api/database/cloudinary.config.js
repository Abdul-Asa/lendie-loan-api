const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();

const { CLOUDINARY_HOST, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_HOST,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const picsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lendie profile pics',
    format: async () => 'png',
    public_id: (req, file) => file.filename,
  },
});



const profileParser = multer({ storage: picsStorage });

module.exports = { profileParser };
