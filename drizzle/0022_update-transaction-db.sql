CREATE TABLE IF NOT EXISTS "transaction" (
	"id" varchar PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'PROCESSING',
	"reference" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transaction_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "donation_transaction" DROP CONSTRAINT "donation_transaction_reference_unique";--> statement-breakpoint
ALTER TABLE "donation_transaction" ADD COLUMN "tx_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_transaction" ADD CONSTRAINT "donation_transaction_tx_id_transaction_id_fk" FOREIGN KEY ("tx_id") REFERENCES "public"."transaction"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "donation_transaction" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
ALTER TABLE "donation_transaction" DROP COLUMN IF EXISTS "reference";