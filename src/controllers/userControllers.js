const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const userModel = require("../models/userModel");
const { zodSignInSchema, zodSignUpSchema } = require("../utils/zod");

async function createAccount(req, res) {
	const data = zodSignUpSchema.parse(req.body);

	const hashPassword = await bcrypt.hash(data.password, 7);

	await userModel.create({ ...data, password: hashPassword });

	res.sendStatus(201);
}

async function loginAccount(req, res, next) {
	const data = zodSignInSchema.parse(req.body);

	const user = await userModel
		.findOne({ email: data.email })
		.select(["_id", "password"])
		.lean()
		.exec();

	if (!user) {
		throw new AppError(
			404,
			"Not Found",
			"User with this username or password doesn't exists."
		);
	}

	const match = await bcrypt.compare(data.password, user.password);

	if (match) {
		res.json({ token: jwt.sign({ userId: user._id }, process.env.JWT_USER) });
	} else throw new AppError(401, "Unauthorized", "User credentials are wrong!");
}

async function getAccountSummary(req, res, next) {
	const userId = req.userId;

	const data = await userModel
		.findById(userId)
		.select(["-_id", "fname", "lname", "email", "theme", "motto"])
		.lean()
		.exec();
	res.json(data);
}

async function changeTheme(req, res, next) {
	const userId = req.userId;

	const zodThemeSchema = z
		.object({
			theme: z.enum(["light", "dark"]),
		})
		.strict()
		.required();

	const data = zodThemeSchema.parse(req.body);

	const updatedTheme = await userModel
		.findByIdAndUpdate(userId, data, {
			returnDocument: "after",
		})
		.select(["fname", "lname", "email", "theme", "motto"])
		.lean()
		.exec();

	res.json(updatedTheme);
}

module.exports = {
	createAccount,
	loginAccount,
	getAccountSummary,
	changeTheme,
};
