const todoModel = require("../models/todoModel");
const projectModel = require("../models/projectModel");
const userModel = require("../models/userModel");
const { zodProjectSchema } = require("../utils/zod");

async function createProject(req, res) {
	const userId = req.userId;
	const data = zodProjectSchema.parse(req.body);

	const newProject = await projectModel.create({ ...data, userId });

	await userModel
		.findOneAndUpdate(
			{ _id: userId },
			{
				$push: {
					projects: {
						projectId: newProject._id,
						title: newProject.title,
						color: newProject.color,
					},
				},
			}
		)
		.lean()
		.exec();

	res.sendStatus(201);
}

async function getProjectList(req, res) {
	const userId = req.userId;

	const data = await userModel
		.findById(userId)
		.select("projects")
		.lean()
		.exec();

	res.json(data.projects);
}

async function getProjectTodos(req, res) {
	const projectId = req.params.projectId;

	const data = await todoModel.projectTodoModel
		.find({ "project.projectId": projectId })
		.lean()
		.exec();

	res.json(data);
}

async function updateProject(req, res) {
	const data = zodProjectSchema.parse(req.body);

	const projectId = req.params.projectId;

	const newData = await projectModel
		.findByIdAndUpdate(projectId, data, { returnDocument: "after" })
		.lean()
		.exec();

	res.json(newData);
}

async function deleteProject(req, res) {
	const projectId = req.params.projectId;
	const userId = req.userId;

	await userModel.updateOne(
		{ _id: userId },
		{
			$pull: {
				projects: {
					projectId: projectId,
				},
			},
		}
	);

	await todoModel.projectTodoModel.deleteMany({
		"project.projectId": projectId,
	});

	await projectModel.deleteOne({ _id: projectId });

	res.sendStatus(204);
}

async function getProject(req, res) {
	const projectId = req.params.projectId;

	const data = await projectModel
		.findById(projectId)
		.select("-__v")
		.lean()
		.exec();

	res.json(data);
}

module.exports = {
	createProject,
	getProjectList,
	getProjectTodos,
	updateProject,
	deleteProject,
	getProject,
};
