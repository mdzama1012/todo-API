const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
	createProjectTodo,
	createNormalTodo,
	getNormalTodo,
	getTodosForToday,
	getUpcomingTodos,
	getDueTodos,
	getCompletedTodo,
	updateTodo,
	deleteTodo,
	changeTodoStatus,
} = require("../controllers/todoControllers");

const router = express.Router();
router.use(auth);

router.get("/:todoId", getNormalTodo);

router.get("/user-todos/today", getTodosForToday);

router.get("/user-todos/upcoming", getUpcomingTodos);

router.get("/user-todos/due-date", getDueTodos);

router.get("/user-todos/complete", getCompletedTodo);

router.post("/", createNormalTodo);

router.post("/project/:projectId", createProjectTodo);

router.put("/:todoId", updateTodo);

router.patch("/status/:todoId", changeTodoStatus);

router.delete("/:todoId", deleteTodo);

module.exports = router;
