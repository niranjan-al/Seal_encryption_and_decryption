CREATE TABLE "decryption_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"owner_address" text NOT NULL,
	"decrypted_data" text NOT NULL,
	"decrypted_data_hex" text NOT NULL,
	"allowlist_object_id" text NOT NULL,
	"processing_time_ms" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "decryption_records_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "encryption_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"data" text NOT NULL,
	"encrypted_data_hex" text NOT NULL,
	"key_hex" text NOT NULL,
	"policy_id_hex" text NOT NULL,
	"owner_address" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "encryption_records_uuid_unique" UNIQUE("uuid")
);
