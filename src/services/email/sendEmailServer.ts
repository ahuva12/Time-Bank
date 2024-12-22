const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (toEmail:string, subjectEmail:string, textEmail:string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: toEmail,
    subject: subjectEmail,
    html: textEmail,
  };

  return transporter.sendMail(mailOptions);
};
