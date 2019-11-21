const mailgun = require('mailgun-js');

module.exports = mailgun({
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  host: 'api.eu.mailgun.net',
  testMode: process.env.NODE_ENV === 'development',
});
