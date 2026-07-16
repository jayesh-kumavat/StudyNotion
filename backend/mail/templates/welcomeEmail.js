exports.welcomeEmail = (firstName, lastName, accountType) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    const supportEmail = process.env.MAIL_USER || "info@studynotion.com"
    const isInstructor = accountType === "Instructor"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Welcome to StudyNotion</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="${frontendUrl}"><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png"
                    alt="StudyNotion Logo"></a>
            <div class="message">Welcome to StudyNotion! 🎉</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Thank you for joining StudyNotion! Your account has been successfully created.</p>
                ${isInstructor
                    ? `<p>Your instructor account is currently <span class="highlight">pending admin approval</span>. You will receive an email once approved and can start creating courses.</p>`
                    : `<p>You can now browse and enroll in courses, track your progress, and start your learning journey.</p>`
                }
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                    href="mailto:${supportEmail}">${supportEmail}</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`
}
