CREATE TABLE IF NOT EXISTS "donation_transaction" (
	"id" varchar PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"status" "status" DEFAULT 'PROCESSING',
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"reference" varchar NOT NULL,
	"currency" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "donation_transaction_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
DROP TABLE "donationTransactions";--> statement-breakpoint
ALTER TABLE "donation_profile" DROP CONSTRAINT "donation_profile_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "donation_profile" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_transaction" ADD CONSTRAINT "donation_transaction_profile_id_donation_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."donation_profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_profile" ADD CONSTRAINT "donation_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
