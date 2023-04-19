"use strict";

var multer = require('multer');

var setMulterSettings = function setMulterSettings() {
  var storage = multer.memoryStorage();

  var fileFilter = function fileFilter(req, file, cb) {
    //["jpg","jpeg","png","doc","docx","pdf","xlsx"].includes(file.mimetype.split("/")[1])
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    }

    cb(new apiError("Only images allowed , I don't have a permision to accept this file!", 400));
  };

  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 100000000000
    }
  });
  return upload;
};

exports.uploadSingelImage = function (fieldName) {
  var upload = setMulterSettings();
  return upload.single(fieldName);
};

exports.uploadMixlImage = function (arrayOfFields) {
  var upload = setMulterSettings();
  return upload.fields(arrayOfFields);
};