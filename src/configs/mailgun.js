// Configuration for Mailgun API
export const MAILGUN_CONFIG = {
  key: process.env.MAILGUN_KEY, // Your Mailgun API key for authenticating API requests.
  username: 'api', // Default username for Mailgun API is 'api'.
  timeout: 60000, // The timeout in milliseconds for API requests. Default is 60000 (60 seconds).
  url: `https://${process.env.MAILGUN_HOST}`, // The base URL for Mailgun API requests, which includes the Mailgun host from your environment variables.
};

// Your Mailgun domain used for sending emails, extracted from environment variables.
export const { MAILGUN_DOMAIN } = process.env;

// It's recommended to refer to the official Mailgun documentation for more details on configuration:
// Mailgun API Quickstart: https://documentation.mailgun.com/en/latest/quickstart.html
// Mailgun API User Manual: https://documentation.mailgun.com/en/latest/user_manual.html
