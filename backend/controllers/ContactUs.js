const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    // Send confirmation email to user
    await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )

    // Send notification email to admin
    if (process.env.ADMIN_EMAIL) {
      await mailSender(
        process.env.ADMIN_EMAIL,
        `New Contact Form Submission from ${firstname} ${lastname}`,
        contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
      )
    }

    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}