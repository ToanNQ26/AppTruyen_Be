import { ApiResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/exeption/AppError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;

  const result =
    !(err instanceof AppError) && process.env.NODE_ENV === "development"
      ? { stack: err.stack, name: err.name }
      : null;

  return res.status(status).json(
    new ApiResponse({
      code: err.code ?? 9999,
      message: err.message || "Internal server error",
      result,
    })
  );
};

export default errorHandler;