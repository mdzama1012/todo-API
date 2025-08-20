const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 100,
			trim: true,
		},
		description: {
			type: String,
			maxLength: 500,
			trim: true,
		},
		status: {
			type: String,
			enum: {
				values: ["pending", "ongoing", "complete"],
				message:
					"Status can't be `VALUE`. It should be pending, ongoing or completed!",
			},
			default: "pending",
		},
		priority: {
			type: Number,
			min: 1,
			max: 4,
			default: 4,
		},
		endsAt: {
			type: Date,
			validate: {
				validator: function (value) {
					return this.createdAt ? value > this.createdAt : true;
				},
				message: "Task end date must be after created date!",
			},
			// if no deadline is assigned use EOD as deadline.
			default: function () {
				const date = new Date();
				date.setHours(23, 59, 59, 0);
				return date;
			},
		},
		userId: mongoose.Schema.Types.ObjectId,
	},
	{ timestamps: true, discriminatorKey: "kind" }
);

const todoModel = mongoose.model("todos", todoSchema);

const projectTodoModel = todoModel.discriminator(
	"project-todo",
	new mongoose.Schema({
		project: {
			projectId: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
			color: {
				type: String,
				enum: {
					values: [
						"#FF6666",
						"#F2A761",
						"#B5FF66",
						"#45E6BB",
						"#47B1B3",
						"#668FFF",
						"#B366FF",
						"#999999",
					],
				},
				default: "#999999",
			},
			title: {
				type: String,
				required: true,
				minLength: 3,
				maxLength: 100,
				trim: true,
			},
		},
	})
);

module.exports = { todoModel, projectTodoModel };
