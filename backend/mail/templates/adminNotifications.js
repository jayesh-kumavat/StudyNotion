exports.adminNewUserEmail = (firstName, lastName, email, accountType) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>New User Registered</title>
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
            <div class="message">New User Registered</div>
            <div class="body">
                <p><span class="highlight">Name:</span> ${firstName} ${lastName}</p>
                <p><span class="highlight">Email:</span> ${email}</p>
                <p><span class="highlight">Account Type:</span> ${accountType}</p>
                ${accountType === "Instructor" ? `<p><span class="highlight">This instructor is pending your approval before they can create courses.</span></p>` : ""}
            </div>
        </div>
    </body>
    
    </html>`
}

exports.adminPaymentEmail = (studentName, studentEmail, courseNames, amount, orderId, paymentId) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>New Payment Received</title>
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
            <div class="message">New Payment Received 💰</div>
            <div class="body">
                <p>Amount: <span class="highlight">₹${amount}</span></p>
                <p><span class="highlight">Student:</span> ${studentName} (${studentEmail})</p>
                <p><span class="highlight">Course(s):</span> ${courseNames}</p>
                <p><span class="highlight">Order ID:</span> ${orderId}</p>
                <p><span class="highlight">Payment ID:</span> ${paymentId}</p>
            </div>
        </div>
    </body>
    
    </html>`
}

exports.instructorApprovedEmail = (firstName, lastName) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Instructor Account Approved</title>
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
            <div class="message">Your Instructor Account is Approved!</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Congratulations! Your instructor account on StudyNotion has been <span class="highlight">approved by the admin</span>.</p>
                <p>You can now create and publish courses and start selling to students on our platform.</p>
            </div>
            <div class="support">If you have any questions, feel free to reach out to us. We are here to help!</div>
        </div>
    </body>
    
    </html>`
}

exports.instructorRevokedEmail = (firstName, lastName) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    const supportEmail = process.env.MAIL_USER || "info@studynotion.com"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Instructor Access Revoked</title>
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
            <div class="message">Instructor Access Revoked</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Your instructor access on StudyNotion has been <span class="highlight">revoked by the admin</span>.</p>
                <p>You will no longer be able to create or publish new courses until your access is reinstated.</p>
                <p>If you believe this is a mistake, please contact our support team.</p>
            </div>
            <div class="support">Reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a> for assistance.</div>
        </div>
    </body>
    
    </html>`
}

exports.accountBannedEmail = (firstName, lastName) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    const supportEmail = process.env.MAIL_USER || "info@studynotion.com"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Account Banned</title>
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
            <div class="message">Your Account Has Been Banned</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Your StudyNotion account has been <span class="highlight">banned by the admin</span>.</p>
                <p>You will not be able to log in or access the platform until the ban is lifted.</p>
                <p>If you believe this is a mistake, please contact our support team.</p>
            </div>
            <div class="support">Reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a> for assistance.</div>
        </div>
    </body>
    
    </html>`
}

exports.accountUnbannedEmail = (firstName, lastName) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Account Reactivated</title>
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
            <div class="message">Your Account Has Been Reactivated</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Good news! Your StudyNotion account has been <span class="highlight">reactivated by the admin</span>.</p>
                <p>You can now log in and continue using the platform.</p>
            </div>
        </div>
    </body>
    
    </html>`
}

exports.accountDeletedEmail = (firstName, lastName) => {
    const supportEmail = process.env.MAIL_USER || "info@studynotion.com"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Account Deleted</title>
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
            <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
            <div class="message">Your Account Has Been Deleted</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Your StudyNotion account has been <span class="highlight">permanently deleted by the admin</span>.</p>
                <p>All your data, enrollments, and progress have been removed from our platform.</p>
                <p>If you believe this was done in error, please contact our support team.</p>
            </div>
            <div class="support">Reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a> for assistance.</div>
        </div>
    </body>
    
    </html>`
}

exports.adminUserSelfDeleteEmail = (firstName, lastName, email, accountType) => {
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:3000"
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>User Account Deleted</title>
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
            <div class="message">User Account Self-Deleted</div>
            <div class="body">
                <p>A user has <span class="highlight">deleted their own account</span> on StudyNotion.</p>
                <p><span class="highlight">Name:</span> ${firstName} ${lastName}</p>
                <p><span class="highlight">Email:</span> ${email}</p>
                <p><span class="highlight">Account Type:</span> ${accountType}</p>
                <p>All their data, enrollments, and progress have been permanently removed.</p>
            </div>
        </div>
    </body>
    
    </html>`
}
