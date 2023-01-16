const multer = require('multer');
const path = require("path")
const { v4: uuidv4 } = require('uuid');

const UploadDate = multer().single('email');
const UploadToken = multer().single('token');

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../images"),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + file.originalname)
    }
})

const UploadFile = multer({
    storage: storage
}).single('img');
module.exports = {
    UploadFile,
    UploadDate,
    UploadToken,
}