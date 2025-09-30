import dotenv from 'dotenv';

dotenv.config();

export const moduleName = process.env.MODULE_NAME!;
export const allowlistId = process.env.ALLOWLIST_ID || process.env.PACKAGE_ID!;