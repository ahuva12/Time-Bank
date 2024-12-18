const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ahuvareshit@gmail.com',
    pass: 'wxqm zesw mhht ccir', // Use an app password for better security
  },
});

// Email sending mailerfunction
export const sendEmail = async (toEmail:string, subjectEmail:string, textEmail:string) => {

  const mailOptions = {
    from: 'ahuvareshit@gmail.com', 
    to: toEmail,
    subject: subjectEmail,
    text: textEmail,
  };

  return transporter.sendMail(mailOptions);
};
