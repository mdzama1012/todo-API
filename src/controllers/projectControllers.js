const todoModel = require('../models/todoModel');
const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');
const { zodProjectSchema } = require('../utils/zod');

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
                        isFavorite: newProject.isFavorite,
                    },
                },
            },
        )
        .lean()
        .exec();
    res.sendStatus(201);
}

async function getProjectList(req, res) {
    const userId = req.userId;

    const data = await userModel
        .findById(userId)
        .select('projects')
        .lean()
        .exec();
    res.json(data.projects);
}

async function getProjectTodos(req, res) {
    const userId = req.userId;
    const projectId = req.params.projectId;

    const data = await todoModel.projectTodoModel
        .find({ 'project.projectId': projectId, userId, status: 'pending' })
        .sort({ priority: 'desc', createdAt: 'desc' })
        .lean()
        .exec();
    res.json(data);
}

async function updateProject(req, res) {
    const userId = req.userId;
    const projectId = req.params.projectId;

    const data = zodProjectSchema.parse(req.body);
    await projectModel.findOneAndUpdate(
        { _id: projectId, userId },
        {
            title: data.title,
            color: data.color,
            isFavorite: data.isFavorite,
        },
    );
    await userModel.updateOne(
        { _id: userId, 'projects.projectId': projectId },
        {
            $set: {
                'projects.$.title': data.title,
                'projects.$.color': data.color,
                'projects.$.isFavorite': data.isFavorite,
            },
        },
    );
    res.sendStatus(204);
}

async function deleteProject(req, res) {
    const userId = req.userId;
    const projectId = req.params.projectId;

    await userModel.updateOne(
        { _id: userId },
        {
            $pull: {
                projects: {
                    projectId: projectId,
                },
            },
        },
    );
    await todoModel.projectTodoModel.deleteMany({
        'project.projectId': projectId,
    });
    await projectModel.deleteOne({ _id: projectId });

    res.sendStatus(204);
}

async function getProject(req, res) {
    const userId = req.userId;
    const projectId = req.params.projectId;

    const data = await projectModel
        .findOne({ _id: projectId, userId })
        .lean()
        .exec();

    if (!data) {
        return res.status(404).json({ message: 'Project not found!' });
    }
    res.json(data);
}

module.exports = {
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectList,
    getProjectTodos,
};
