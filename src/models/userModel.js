const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		fname: {
			type: String,
			required: true,
			minLength: 3,
			trim: true,
		},
		lname: {
			type: String,
			required: true,
			minLength: 3,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		theme: {
			type: String,
			enum: {
				values: ["light", "dark"],
			},
			default: "light",
		},
		motto: {
			type: String,
			minLength: 3,
			maxLength: 250,
			trim: true,
		},
		// nested path (not using sub-document)
		projects: [
			{
				_id: false,
				projectId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "projects",
					required: true,
				},
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
		],
	},
	{ timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
