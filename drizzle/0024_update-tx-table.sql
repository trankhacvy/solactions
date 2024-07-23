DO $$ BEGIN
 CREATE TYPE "public"."reference_type" AS ENUM('DONATION', 'TIPLINK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reference" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" varchar NOT NULL,
	"reference_type" "reference_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "reference_reference_unique" UNIQUE("reference")
);
ALTER TABLE "donation_transaction" DROP CONSTRAINT "donation_transaction_tx_id_transaction_id_fk";
--> statement-breakpoint
ALTER TABLE "donation_transaction" ADD COLUMN "status" "status" DEFAULT 'PROCESSING';--> statement-breakpoint
ALTER TABLE "donation_transaction" ADD COLUMN "reference" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "donation_transaction" ADD COLUMN "signature" varchar;--> statement-breakpoint
ALTER TABLE "donation_transaction" DROP COLUMN IF EXISTS "tx_id";--> statement-breakpoint
ALTER TABLE "donation_transaction" ADD CONSTRAINT "donation_transaction_reference_unique" UNIQUE("reference");--> statement-breakpoint
ALTER TABLE "donation_transaction" ADD CONSTRAINT "donation_transaction_signature_unique" UNIQUE("signature");