import formData from 'form-data';
import Mailgun from 'mailgun.js';

import { MAILGUN_CONFIG, MAILGUN_DOMAIN } from '#src/configs/mailgun.js';

const transport = new Mailgun(formData).client(MAILGUN_CONFIG);

/**
 * Sends an email using Mailgun.
 *
 * @param {object} options - The options for sending the email.
 * @param {string} options.from - The email address of the sender.
 * @param {string} options.to - The email address of the recipient.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.html - The HTML content of the email.
 * @param {string} options.text - The plain text content of the email.
 * @param {object} options.attachment - Attachments for the email.
 *
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const send = ({ from, to, subject, html, text, attachment }) => {
  return transport.messages.create(MAILGUN_DOMAIN, {
    from,
    to,
    subject,
    html,
    text,
    attachment,
  });
};
