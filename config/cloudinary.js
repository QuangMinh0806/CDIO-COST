const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const {CloudinaryStorage} = require("multer-storage-cloudinary");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats : ['jpg', 'png'],
    params : {
        folder : "CDIO_3"
    }
})



const upload = multer({ storage: storage });


module.exports = upload;