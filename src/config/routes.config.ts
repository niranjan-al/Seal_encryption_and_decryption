export const ROUTES = {
  API_PREFIX: '/api',
  ENCRYPT_DATA: '/encrypt-data',
  HEALTH: '/health',
} as const;

export const API_ENDPOINTS = {
  ENCRYPT_DATA: `${ROUTES.API_PREFIX}${ROUTES.ENCRYPT_DATA}`,
} as const;