const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();


exports.auth = async (req, res, next) => {
	try {
		// Extracting JWT from request cookies, body or header
		const token =
			req.cookies?.token ||
			req.body?.token ||
			(req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

		console.log("Auth middleware - token exists:", !!token);
		console.log("Auth middleware - source:", req.cookies?.token ? "cookie" : req.body?.token ? "body" : req.header("Authorization") ? "header" : "none");

		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			// Verifying the JWT
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log(decode);

			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			console.log("JWT verify error:", error.message);
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// Check if user is banned
		const userDetails = await User.findById(req.user.id).select("active approved accountType")
		if (!userDetails) {
			return res.status(401).json({ success: false, message: "token is invalid" })
		}
		if (!userDetails.active) {
			return res.status(403).json({ success: false, message: "Your account has been banned. Please contact support." })
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		console.log("Auth middleware outer error:", error.message);
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};

// Auth without active/approved checks — for settings, password change, delete account
exports.authLite = async (req, res, next) => {
	try {
		const token =
			req.cookies?.token ||
			req.body?.token ||
			(req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			req.user = decode;
		} catch (error) {
			return res.status(401).json({ success: false, message: "token is invalid" });
		}

		next();
	} catch (error) {
		return res.status(401).json({ success: false, message: `Something Went Wrong While Validating the Token` });
	}
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (!userDetails.accountType || userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		if (!userDetails.accountType || userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (!userDetails.accountType || userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};