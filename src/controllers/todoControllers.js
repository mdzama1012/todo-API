const { z } = require("zod");
const projectModel = require("../models/projectModel");
const { todoModel, projectTodoModel } = require("../models/todoModel");
const { zodTodoSchema } = require("../utils/zod");

async function createProjectTodo(req, res) {
	const userId = req.userId;
	const projectId = req.params.projectId;

	const data = zodTodoSchema.parse(req.body);
	const project = await projectModel.findById(projectId).lean().exec();
	await projectTodoModel.create({
		...data,
		userId,
		project: {
			projectId: project._id,
			color: project.color,
			title: project.title,
		},
	});
	res.sendStatus(201);
}

async function createNormalTodo(req, res) {
	const userId = req.userId;

	const data = zodTodoSchema.parse(req.body);
	await todoModel.create({ ...data, userId });
	res.sendStatus(201);
}

async function getNormalTodo(req, res) {
	const userId = req.userId;
	const todoId = req.params.todoId;

	const data = await todoModel.findOne({ _id: todoId, userId }).lean().exec();
	res.json(data);
}

async function getTodosForToday(req, res) {
	const userId = req.userId;
	// today start and end timestamps.
	const t1 = new Date().setUTCHours(0, 0, 0, 0);
	const t2 = new Date().setUTCHours(23, 59, 59, 0);

	const data = await todoModel
		.find({
			userId,
			endsAt: { $gte: t1, $lte: t2 },
			status: { $in: ["pending", "ongoing"] },
		})
		.sort({ priority: "desc", createdAt: "desc" })
		.lean()
		.exec();
	res.json(data);
}

async function getUpcomingTodos(req, res) {
	const userId = req.userId;
	const timestamp = new Date().setUTCHours(23, 59, 59, 0);

	const data = await todoModel
		.find({
			userId,
			endsAt: { $gt: timestamp },
			status: { $in: ["pending", "ongoing"] },
		})
		.sort({ priority: "desc", createdAt: "desc" })
		.lean()
		.exec();
	res.json(data);
}

async function getDueTodos(req, res) {
	const userId = req.userId;
	const timestamp = new Date().setUTCHours(0, 0, 0, 0);

	const data = await todoModel
		.find({
			userId,
			endsAt: { $lt: timestamp },
			status: { $in: ["pending", "ongoing"] },
		})
		.sort({ priority: "desc", createdAt: "desc" })
		.lean()
		.exec();
	res.json(data);
}

async function getCompletedTodo(req, res) {
	const userId = req.userId;

	const data = await todoModel
		.find({ userId, status: "completed" })
		.sort({ priority: "desc", createdAt: "desc" })
		.lean()
		.exec();
	res.json(data);
}

async function changeTodoStatus(req, res) {
	const todoId = req.params.todoId;

	// zod schema to sanitize payload.
	const zodStatusSchema = z
		.object({ status: z.enum(["completed", "ongoing", "pending"]) })
		.strict()
		.required();

	const data = zodStatusSchema.parse(req.body);
	await todoModel.findByIdAndUpdate(todoId, data).lean().exec();
	res.sendStatus(204);
}

async function deleteTodo(req, res) {
	const todoId = req.params.todoId;

	await todoModel.deleteOne({ _id: todoId }).exec();
	res.sendStatus(204);
}

module.exports = {
	deleteTodo,
	getDueTodos,
	getNormalTodo,
	getTodosForToday,
	createNormalTodo,
	getUpcomingTodos,
	getCompletedTodo,
	changeTodoStatus,
	createProjectTodo,
};
