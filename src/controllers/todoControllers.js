const { z } = require("zod");
const projectModel = require("../models/projectModel");
const { todoModel, projectTodoModel } = require("../models/todoModel");
const { zodTodoSchema } = require("../utils/zod");

async function createProjectTodo(req, res) {
	const data = zodTodoSchema.parse(req.body);

	const projectId = req.params.projectId;

	const userId = req.userId;

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
	const data = zodTodoSchema.parse(req.body);

	const userId = req.userId;

	await todoModel.create({ ...data, userId });

	res.sendStatus(201);
}

async function getNormalTodo(req, res) {
	const todoId = req.params.todoId;

	const data = await todoModel.findById(todoId).lean().exec();

	res.json(data);
}

async function getTodosForToday(req, res) {
	const userId = req.userId;
	const todayStart = new Date();
	const todayEnd = new Date();

	todayStart.setHours(0, 0, 0, 0);
	todayEnd.setHours(23, 59, 59, 999);

	const data = await todoModel
		.find({
			userId,
			endsAt: { $gte: todayStart, $lte: todayEnd },
			status: { $in: ["pending", "ongoing"] },
		})
		.lean()
		.exec();

	res.json(data);
}

async function getUpcomingTodos(req, res) {
	const userId = req.userId;
	const todayEnd = new Date();

	todayEnd.setHours(23, 59, 59, 999);

	const data = await todoModel
		.find({
			userId,
			endsAt: { $gt: todayEnd },
			status: { $in: ["pending", "ongoing"] },
		})
		.lean()
		.exec();

	res.json(data);
}

async function getDueTodos(req, res) {
	const userId = req.userId;
	const todayStart = new Date();

	todayStart.setHours(0, 0, 0, 0);

	const data = await todoModel
		.find({
			userId,
			endsAt: { $lt: todayStart },
			status: { $in: ["pending", "ongoing"] },
		})
		.lean()
		.exec();

	res.json(data);
}

async function getCompletedTodo(req, res) {
	const userId = req.userId;
	const data = await todoModel
		.find({ userId, status: "complete" })
		.lean()
		.exec();

	res.json(data);
}

async function updateTodo(req, res) {
	const data = zodTodoSchema.parse(req.body);
	const todoId = req.params.todoId;

	const newData = await todoModel
		.findByIdAndUpdate(todoId, data, {
			returnDocument: "after",
		})
		.lean()
		.exec();

	res.json(newData);
}

async function changeTodoStatus(req, res) {
	const zodStatusSchema = z
		.object({
			status: z.enum(["complete", "ongoing", "pending"]),
		})
		.strict()
		.required();

	const data = zodStatusSchema.parse(req.body);
	const { todoId } = req.params;

	await todoModel.findByIdAndUpdate(todoId, data).lean().exec();
	res.sendStatus(204);
}

async function deleteTodo(req, res) {
	const todoId = req.params.todoId;
	await todoModel.deleteOne({ _id: todoId }).exec();
	res.sendStatus(204);
}

module.exports = {
	createProjectTodo,
	createNormalTodo,
	getNormalTodo,
	getTodosForToday,
	getUpcomingTodos,
	getDueTodos,
	getCompletedTodo,
	updateTodo,
	changeTodoStatus,
	deleteTodo,
};
