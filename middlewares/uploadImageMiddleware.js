const multer = require('multer')
const setMulterSettings = () => {
    const storage = multer.memoryStorage()

    const fileFilter = function (req, file, cb) {
        //["jpg","jpeg","png","doc","docx","pdf","xlsx"].includes(file.mimetype.split("/")[1])
        if (file.mimetype.startsWith("image")) {
            return cb(null, true)
        }
        cb(new apiError("Only images allowed , I don't have a permision to accept this file!", 400))

    }

    const upload = multer({
        storage: storage, fileFilter: fileFilter, limits: {
            fileSize: 100000000000,
        }
    });

    return upload;
}

exports.uploadSingelImage = (fieldName) => {
    const upload = setMulterSettings();
   
   return upload.single(fieldName);
}
exports.uploadMixlImage = (arrayOfFields) => {
        const upload = setMulterSettings();

   return upload.fields(arrayOfFields);
}