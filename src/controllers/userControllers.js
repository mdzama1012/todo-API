const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const { zodSignInSchema, zodSignUpSchema } = require("../utils/zod");
const { todoModel } = require("../models/todoModel");

async function createAccount(req, res) {
	const data = zodSignUpSchema.parse(req.body);
	const hashPassword = await bcrypt.hash(data.password, 7);
	await userModel.create({ ...data, password: hashPassword });
	res.sendStatus(201);
}

async function loginAccount(req, res) {
	const data = zodSignInSchema.parse(req.body);
	const user = await userModel.findOne({ email: data.email }).lean().exec();
	if (!user) {
		return res.status(401).json({
			message: "Invalid credentials provided!",
		});
	}
	const isPasswordValid = await bcrypt.compare(data.password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({
			message: "Invalid credentials provided!",
		});
	}
	res.json({ token: jwt.sign({ userId: user._id }, process.env.JWT_USER) });
}

async function getAccountSummary(req, res) {
	const userId = req.userId;
	const data = await userModel
		.findOne({ _id: userId })
		.select(["fname", "lname", "email"])
		.lean()
		.exec();
	res.json(data);
}

async function getTodayProgress(req, res) {
	const userId = req.userId;
	// today start and end timestamps.
	const t1 = new Date().setHours(0, 0, 0, 0);
	const t2 = new Date().setHours(23, 59, 59, 0);

	const pendingCount = await todoModel
		.countDocuments({
			userId,
			endsAt: { $gte: t1, $lte: t2 },
			status: { $in: ["pending", "ongoing"] },
		})
		.lean()
		.exec();
	const completedCount = await todoModel
		.countDocuments({
			userId,
			endsAt: { $gte: t1, $lte: t2 },
			status: { $in: ["complete"] },
		})
		.lean()
		.exec();
	res.json({ pendingCount, completedCount });
}

module.exports = {
	getTodayProgress,
	loginAccount,
	createAccount,
	getAccountSummary,
};
