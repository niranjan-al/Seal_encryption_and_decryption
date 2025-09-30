import dotenv from 'dotenv';

dotenv.config();

export const SERVICE_CONFIG = {
  PACKAGE_ID: process.env.PACKAGE_ID!,
  MODULE_NAME: process.env.MODULE_NAME!,
  SUI_NETWORK: process.env.SUI_NETWORK || 'testnet',
  KEY_SERVERS: [
    {
      objectId: process.env.KEY_SERVER_OBJECT_ID_1!,
      url: process.env.KEY_SERVER_URL_1!,
      weight: 1,
    },
    {
      objectId: process.env.KEY_SERVER_OBJECT_ID_2!,
      url: process.env.KEY_SERVER_URL_2!,
      weight: 1,
    }
  ]
} as const;