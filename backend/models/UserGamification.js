const mongoose = require("mongoose");

const userGamificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
			unique: true,
		},
		points: {
			type: Number,
			default: 0,
		},
		activities: [
			{
				type: {
					type: String,
					enum: [
						"course_enrolled",
						"lecture_completed",
						"course_completed",
						"review_given",
						"discussion_posted",
					],
				},
				points: { type: Number },
				timestamp: { type: Date, default: Date.now },
				referenceId: { type: mongoose.Schema.Types.ObjectId },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("UserGamification", userGamificationSchema);
