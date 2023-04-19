const ApiError = require("./../utils/apiError");

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const hendleInvalidTokenSignatureError = () => new ApiError(`invalid token , plz login again `,401);
const hendleTokenExpiredError = () => new ApiError(`Token Expired, plz login again `,401);


const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {

         sendErrorForDev(err, res);

  } else {

    if (err.name === "JsonWebTokenError") {

      const err2 = hendleInvalidTokenSignatureError();
          sendErrorForProd(err2, res);
    } else if (err.name === "TokenExpiredError") {

      const err2 = hendleTokenExpiredError();
          sendErrorForProd(err2, res);
    } else {
          sendErrorForProd(err, res);

    }
  }
};

module.exports = globalError;
