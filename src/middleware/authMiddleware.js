const jwt = require("jsonwebtoken");
const { z } = require("zod");

function auth(req, res, next) {
	let token = req.headers["authorization"].split(" ")[1];
	try {
		token = z.string().parse(token);
		const decodePayload = jwt.verify(token, JWT_USER);
		req.userId = decodePayload.userId;
		next();
	} catch (error) {
		res.status(403).json({ message: "Forbidden: invalid token!", error });
	}
}

module.exports = {
	auth,
	JWT_USER,
};
