const mongoose = require("mongoose");

function errorHandler(err, req, res, next) {
	// prevent default error handler
	if (res.headersSent) {
		return next(err);
	}

	if (err.code === 11000) {
		res.status(409).json({
			message: "Email provided, is already in use!",
		});
	} else if (
		err instanceof z.ZodError ||
		err instanceof mongoose.Error.CastError
	) {
		res.status(400).json({
			message: "Invalid payload provided",
		});
	} else if (error instanceof mongoose.Error.DocumentNotFoundError) {
		res.status(404).json({
			message: "Document not found!",
		});
	} else {
		console.error(err);
		res.status(500).json({
			message: "Internal server error!",
		});
	}
}

module.exports = errorHandler;
