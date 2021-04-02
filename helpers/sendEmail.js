const MailComposer = require("nodemailer/lib/mail-composer");
const mailgun = require("../config/mailgun");
const { SENDER_EMAIL } = require("../config/constants");

const sendEmail = ({ to, subject, text, html }) =>
  new Promise((resolve, reject) => {
    const emailData = {
      from: SENDER_EMAIL,
      to,
      subject,
      text,
    };

    const resolveOrReject = (err, res) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      return resolve(res);
    }

    if (!html) {
      return mailgun.messages().send(emailData, resolveOrReject);
    }

    emailData.html = html;
    const mail = new MailComposer(emailData);
    mail.compile().build((err, message) => {
      if (err) {
        console.log(err);
        return;
      }

      const dataToSend = {
        to,
        message: message.toString("ascii"),
      };

      mailgun.messages().sendMime(dataToSend, resolveOrReject);
    });
  });


module.exports = sendEmail;
