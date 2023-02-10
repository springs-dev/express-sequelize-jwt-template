const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);

module.exports = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_KEY || '',
  timeout: 60000,
  url: `https://${process.env.MAILGUN_HOST}`,
});
