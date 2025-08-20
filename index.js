require("dotenv").config();

// Fail fast for invalid environmental variables
const { zodEnvSchema } = require("./src/utils/zod");

try {
	zodEnvSchema.parse(process.env);
} catch {
	console.error("Invalid environmental variables");
	process.exit(1);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectToDatabase = require("./src/config/db");
const userRouter = require("./src/routes/userRouter");
const todoRouter = require("./src/routes/todoRouter");
const projectRouter = require("./src/routes/projectRouter");
const errorHandler = require("./src/utils/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
	cors((_, cb) => {
		const whitelist = process.env.ALLOWED_ORIGINS.split(",");
		cb(null, { origin: whitelist });
	})
);

app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use("/projects", projectRouter);

app.use(errorHandler);

(async () => {
	await connectToDatabase();
	app.listen(process.env.PORT, "localhost", () =>
		console.log("Server is running on the port:", process.env.PORT)
	);
})();
