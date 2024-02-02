import path from 'node:path';

// === Upload ===
export const UPLOAD_UI_PATH = '/uploads';
export const UPLOAD_SERVER_PATH = path.resolve(`${process.cwd()}/public${UPLOAD_UI_PATH}`);

// === Common ===
export const STATUS_SUCCESS = { status: true };

export const DEFAULT_PER_PAGE_COUNT = 20;

// === Environment variables ===
export const { FRONTEND_BASE_URL } = process.env;
export const { BACKEND_BASE_URL } = process.env;
export const { ADMIN_EMAIL } = process.env;
export const { ADMIN_PASSWORD } = process.env;

export const SORT_ORDERS = {
  asc: 'asc',
  desc: 'desc',
};
