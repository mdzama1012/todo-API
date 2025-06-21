const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");

const connectToDatabase = require("./config/db");
const userRouter = require("./routes/userRouter");
const todoRouter = require("./routes/todoRouter");
const projectRouter = require("./routes/projectRouter");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use("/projects", projectRouter);

app.use(errorHandler);

(async () => {
	await connectToDatabase();
	app.listen(3000, "localhost", () =>
		console.log("Server is running on the port:", 3000)
	);
})();
