import nodeMailer from "nodemailer";
import { htmlTemplate } from "../utils/htmlTemplate.js";

const transporter = nodeMailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port : process.env.NODEMAILER_PORT,
  secure : false,
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASSWORD,
  },
});

export const sendMailer = (username, senderEmail) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL_FROM,
    to: senderEmail,
    subject: "Hello from NewsAPIx",
    html: htmlTemplate(username),
  };

  //* sending email

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
