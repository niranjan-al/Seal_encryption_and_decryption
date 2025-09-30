import { pgTable, text, timestamp, serial, uuid } from 'drizzle-orm/pg-core';

export const encryptionRecords = pgTable('encryption_records', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  data: text('data').notNull(), // Original data
  encryptedDataHex: text('encrypted_data_hex').notNull(),
  keyHex: text('key_hex').notNull(),
  policyIdHex: text('policy_id_hex').notNull(),
  ownerAddress: text('owner_address').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const decryptionRecords = pgTable('decryption_records', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  ownerAddress: text('owner_address').notNull(),
  decryptedData: text('decrypted_data').notNull(),
  decryptedDataHex: text('decrypted_data_hex').notNull(),
  allowlistObjectId: text('allowlist_object_id').notNull(),
  processingTimeMs: text('processing_time_ms').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
