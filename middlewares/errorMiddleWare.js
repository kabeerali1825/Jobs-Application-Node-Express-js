const errorMiddleware = (err, req, res, next) => {
    const defaultErrors = {
        statusCode: 500,
        message: err.message,
        stack: err.stack,
        err: err,
    };

    console.log(err);

    if (err.name === "ValidationError") {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    // Duplicate key error
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }

    res
        .status(defaultErrors.statusCode)
        .json({ message: defaultErrors.message, success: false, stack: defaultErrors.stack, err: defaultErrors.err });
};

export default errorMiddleware;
