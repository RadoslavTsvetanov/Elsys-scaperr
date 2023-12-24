const nodemailer = require("nodemailer");

class EmailSender {
  constructor(provider, senderEmail, senderPass) {
    console.log(senderEmail, senderPass);
    this.transporter = nodemailer.createTransport({
      service: provider,
      host: `smtp.${provider}.com`,
      port: 587,
      auth: {
        user: senderEmail,
        pass: senderPass,
      },
    });
  }

  sendEmail(to, subject, text) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: to,
        subject,
        text,
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred:", error.message);
          reject(error.message); // Reject the promise on error
        } else {
          console.log("Email sent:", info.response);
          resolve(info.response); // Resolve the promise on success
        }
      });
    });
  }
}

module.exports = { EmailSender };
