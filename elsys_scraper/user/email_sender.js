const nodemailer = require("nodemailer");
class EmailSender {
  constructor(provider, senderEmail, senderPass) {
    this.transporter = nodemailer.createTransport({
      service: provider,
      auth: {
        user: senderEmail,
        pass: senderPass,
      },
    });
  }

  sendEmail(to, subject, text) {
    const mailOptions = {
      from: this.transporter.options.auth.user,
      to,
      subject,
      text,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error.message);
        throw new Error(error.message);
      } else {
        console.log("Email sent:", info.response);
        return;
      }
    });
  }
}

module.exports = { EmailSender };
