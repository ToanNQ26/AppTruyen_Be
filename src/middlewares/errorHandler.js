  import { ApiResponse } from "../utils/apiResponse.js";
  import { AppError } from "../utils/exeption/AppError.js";
  const errorHandler = (err, req, res, next) => {
    console.error(err);


    const status = err.statusCode || 500;
    let result = null;

    if (!(err instanceof AppError) && process.env.NODE_ENV === "development") {
      // chỉ show stack khi lỗi không phải AppError
      result = {
        stack: err.stack,
        name: err.name,
      };
    }

    res.status(status).json(
      new ApiResponse({
        code: err.code || 9999,
        message: err.message || 'Internal server error',
        result,
      })
    );
 };

  

  export default errorHandler;
