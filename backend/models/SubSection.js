const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: {
		type: String
	},
	timeDuration: {
		type: String
	},
	description: {
		type: String
	},
	videoUrl: {
		type: String
	},
	transcript: {
		type: String,
		default: ""
	},
	resources: [{
		name: { type: String },
		url: { type: String },
	}],
});

module.exports = mongoose.model("SubSection", SubSectionSchema);