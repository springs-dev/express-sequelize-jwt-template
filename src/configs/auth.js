export const AUTH_ACCESS_TOKEN_EXPIRATION_TIME = '15m';
export const AUTH_REFRESH_TOKEN_EXPIRATION_TIME = new Date(
  new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
); // This token expires in 30 days
export const AUTH_RESET_PASSWORD_TOKEN_EXPIRATION_TIME = '120m'; // This token expires in 2 hours
export const { AUTH_SECRET_KEY } = process.env;
