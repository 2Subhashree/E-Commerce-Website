const {Resend} = require('resend')
const dotenv = require('dotenv')
dotenv.config()

if(!process.env.RESEND_API){
  console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo, subject, html}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ecommerce <onboarding@resend.dev>',
      to: sendTo,
      subject: subject,
      html: html,
    });
    if (error) {
      return console.error({ error });
    }
    return data
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendEmail



// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail", // or use "smtp.ethereal.email" for testing
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async ({ sendTo, subject, html }) => {
//   try {
//     await transporter.sendMail({
//       from: `OTP Service <${process.env.EMAIL_USER}>`,
//       to: sendTo,
//       subject: subject,
//       html: html,
//     });
//     console.log("Email sent!");
//   } catch (error) {
//     console.error("Email sending failed:", error);
//   }
// };

// module.exports = sendEmail;
