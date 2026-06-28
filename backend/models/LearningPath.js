const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		interests: [{ type: String }],
		skillLevel: {
			type: String,
			enum: ["beginner", "intermediate", "advanced"],
			default: "beginner",
		},
		courses: [
			{
				courseId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Course",
				},
				order: { type: Number },
				status: {
					type: String,
					enum: ["pending", "in_progress", "completed"],
					default: "pending",
				},
			},
		],
		progress: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);
