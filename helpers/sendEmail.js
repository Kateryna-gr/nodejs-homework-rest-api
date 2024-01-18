import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL_FROM, EMAIL_PASSWORD } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

// const email = {
//   from: EMAIL_FROM,
//   to: "femaw24842@grassdev.com",
//   subject: "Test",
//   text: "Test",
// };

const sendEmail = (data) => {
  const email = { ...data, from: EMAIL_FROM };
  return transporter.sendMail(email);
};

export default sendEmail;
