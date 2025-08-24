import nodemailer from "nodemailer";
import "dotenv/config";

const sendMail = async (otp, Email, subject) => {
  const pass = process.env.SMTP_PASS;
  const user = process.env.SMTP_USER || "hg227575@gmail.com";

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: user,
      to: Email,
      subject: subject,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>OTP Verification</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:'Segoe UI', sans-serif;">
        <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <div style="background:#4f46e5; padding:20px; text-align:center;">
            <h1 style="color:white; margin:0;">🔐 YukiLux Verification</h1>
          </div>
          <div style="padding:30px;">
            <p style="font-size:18px; color:#333;">Hi there 👋,</p>
            <p style="font-size:16px; color:#555;">Thanks for signing up! Use the code below to verify your email address.</p>
            <div style="text-align:center; margin:30px 0;">
              <span style="font-size:32px; letter-spacing:5px; font-weight:bold; background:#f0f0f0; padding:12px 24px; border-radius:8px; display:inline-block;">
                ${otp}
              </span>
            </div>
            <p style="font-size:16px; color:#888;">This OTP is valid for <strong>5 minutes</strong>.</p>
            <p style="font-size:16px; color:#999; margin-top:30px;">With 💙, <br/>Team YukiLux</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error(" Error sending email:", error.message);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

export default sendMail;
