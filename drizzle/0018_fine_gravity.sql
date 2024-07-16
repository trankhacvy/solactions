CREATE TABLE IF NOT EXISTS "tipLinks" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar(256) DEFAULT 'Tiplink',
	"description" text DEFAULT '',
	"amount" numeric NOT NULL,
	"token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"multiple" boolean DEFAULT false,
	"claimable" boolean DEFAULT true,
	"wallet" varchar,
	"num_of_claims" integer DEFAULT 1,
	"link" varchar,
	"claimant" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"claim_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tipLinks" ADD CONSTRAINT "tipLinks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
