const { z } = require("zod");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");

function auth(req, _, next) {
	let token = req.headers.token;

	if (!token) {
		throw new AppError(403, "Invalid Token", "Forbidden: invalid token!");
	}

	token = z.string().parse(token);

	const decodePayload = jwt.verify(token, process.env.JWT_USER);

	req.userId = decodePayload.userId;
	next();
}

module.exports = { auth };
