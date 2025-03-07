const { constants } = require("../constants/constants");


/**
 * Error handler middleware function
 * @param {Error} err - The error object
 * @param {Request} req - The express request object
 * @param {Response} res - The express response object
 * @param {NextFunction} next - The next function to call in the middleware chain
 * @description
 * This function handles any errors that may occur during the processing of a request.
 * It logs the error and returns a JSON response with the error message and stack trace.
 * If the error status code is not set, it defaults to a 500 status code.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
 
  switch (statusCode) {
    case constants.NOT_FOUND:
      res.status(statusCode).json({
        title: "not found",
        message: err.message,
        stacktrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: "server error",
        message: err.message,
        stacktrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.BAD_REQUEST:
      res.status(statusCode).json({
        title: "bad request",
        message: err.message,
        stacktrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.status(statusCode).json({
        title: "unauthorized",
        message: err.message,
        stacktrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.status(statusCode).json({
        title: "forbidden",
        message: err.message,
        stacktrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    default:
      console.log("no error found, system functioning fine");
      break;
  }
};

module.exports = errorHandler;
