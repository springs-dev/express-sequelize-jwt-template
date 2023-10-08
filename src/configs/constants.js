import path from 'node:path';

// === Upload ===
export const UPLOAD_UI_PATH = '/uploads';
export const UPLOAD_SERVER_PATH = path.resolve(`${process.cwd()}/public${UPLOAD_UI_PATH}`);

// === Auth settings ===
export const AUTH_ACCESS_TOKEN_EXPIRATION_TIME = '15m';
export const AUTH_REFRESH_TOKEN_EXPIRATION_TIME = new Date(
  new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
); // This token expires in 30 days
export const AUTH_RESET_PASSWORD_TOKEN_EXPIRATION_TIME = '120m'; // This token expires in 2 hours
export const { AUTH_SECRET_KEY } = process.env;

// === Common ===
export const STATUS_SUCCESS = { status: true };
export const DEFAULT_PER_PAGE_COUNT = 20;

export const DEFAULT_SENDER_EMAIL = `Support <support@${process.env.MAILGUN_DOMAIN}>`;

// === Environment variables ===
export const { FRONTEND_BASE_URL } = process.env;
export const { BACKEND_BASE_URL } = process.env;
export const { ADMIN_EMAIL } = process.env;
export const { ADMIN_PASSWORD } = process.env;

export const SORT_ORDERS = {
  asc: 'asc',
  desc: 'desc',
};
