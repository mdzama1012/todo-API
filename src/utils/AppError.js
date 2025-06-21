class AppError extends Error {
	constructor(statusCode, name, message) {
		super(message);

		this.name = name;
		this.statusCode = statusCode;
	}
}

module.exports = AppError;
