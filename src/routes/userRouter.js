const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
	createAccount,
	loginAccount,
	getAccountSummary,
	changeTheme,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/basic-details", auth, getAccountSummary);

router.post("/signup", createAccount);

router.post("/login", loginAccount);

router.patch("/theme", auth, changeTheme);

module.exports = router;
