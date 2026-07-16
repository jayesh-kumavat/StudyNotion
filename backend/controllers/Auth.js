const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const { adminNewUserEmail } = require("../mail/templates/adminNotifications")
const { welcomeEmail } = require("../mail/templates/welcomeEmail")
const Profile = require("../models/Profile")
require("dotenv").config()


exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body

    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "Generate OPT for the email to register",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let approved = ""
    approved = accountType === "Instructor" ? false : true


    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}-${lastName}`
    })

    // Send welcome email to new user
    try {
      await mailSender(
        email,
        "Welcome to StudyNotion!",
        welcomeEmail(firstName, lastName, accountType)
      )
    } catch (err) {
      console.error("Welcome email failed:", err)
    }

    // Notify admin of new user registration
    if (process.env.ADMIN_EMAIL) {
      try {
        await mailSender(
          process.env.ADMIN_EMAIL,
          `New ${accountType} Registered - ${firstName} ${lastName}`,
          adminNewUserEmail(firstName, lastName, email, accountType)
        )
      } catch (err) {
        console.error("Admin notification email failed:", err)
      }
    }

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
      error: error.message,
    })
  }
}

// login controller
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        let user = await User.findOne({email}).populate('additionalDetails');   
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        // // Check if the user has requested deletion
        // if (user.deletedTequest) {
        //     const requestedAt = user.deleteRequestAt;
        //     const currentTime = new Date();
        //     const timeDifference = currentTime - requestedAt;
        //     const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
        //     if (hoursDifference < 24) {
        //         user.deletedTequest = false;
        //         user.deleteRequestAt = null;
        //         await user.save();
        //     } else {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Account is deleted. Please contact support."
        //         });
        //     }
        // }

        const payload = {
            id: user._id,
            email: user.email,
            accountType: user.accountType
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            if (!user.active) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been banned. Please contact support."
                })
            }
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'});
            // user.token = token;
            // user.password = undefined; // to not send password in response
            res.cookie("token", token, {
                expires: new Date(Date.now() + 24 * 3600000), // 24 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
            }).status(200).json({
                success: true,
                message: "User logged in successfully",
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    accountType: user.accountType,
                    active: user.active,
                    approved: user.approved,
                    image: user.image,
                    additionalDetails: user.additionalDetails,
                },
                token
            });  
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error logging in user"
        });
    }
}

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

exports.logout = async (req, res) => {  
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "User logged out successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ 
      success: false,
      message: "Error occurred while logging out",
      error: error.message,
    })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" })
    }

    // Verify current token (even if close to expiry)
    const decode = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: false })

    // Issue new token with same payload
    const payload = { id: decode.id, email: decode.email, accountType: decode.accountType }
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.cookie("token", newToken, {
      expires: new Date(Date.now() + 24 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    }).status(200).json({
      success: true,
      token: newToken,
      message: "Token refreshed successfully",
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    })
  }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )

    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}