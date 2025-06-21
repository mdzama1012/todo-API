const errorHandler = async (err, _, res, next) => {
	if (err.headersSent) {
		return next(err);
	}

	console.error(err);
	console.error(err.stack);

	err.statusCode = err.statusCode ?? 500;
	err.statusMessage = err.name ?? "Internal server error!";

	res.json({ message: err.message });
};

module.exports = errorHandler;
