const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // e.g. your Gmail address
    pass: process.env.EMAIL_PASSWORD, // app password or Gmail password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Your TODO App" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
