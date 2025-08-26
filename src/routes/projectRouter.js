const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const {
    createProject,
    getProjectList,
    getProjectTodos,
    updateProject,
    deleteProject,
    getProject,
} = require('../controllers/projectControllers');

const router = express.Router();

router.use(auth);

router.get('/:projectId', getProject);

router.get('/user-project/list', getProjectList);

router.get('/project-todos/:projectId', getProjectTodos);

router.post('/', createProject);

router.put('/:projectId', updateProject);

router.delete('/:projectId', deleteProject);

module.exports = router;
