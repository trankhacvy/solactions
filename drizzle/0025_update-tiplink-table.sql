CREATE TABLE IF NOT EXISTS "tiplink" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar(256) DEFAULT 'Tiplink',
	"message" text DEFAULT '',
	"amount" numeric NOT NULL,
	"token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb NOT NULL,
	"link" varchar NOT NULL,
	"claimant" varchar,
	"claimed" boolean DEFAULT false NOT NULL,
	"status" "status" DEFAULT 'PROCESSING',
	"reference" varchar,
	"signature" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"expired_at" timestamp with time zone,
	CONSTRAINT "tiplink_reference_unique" UNIQUE("reference"),
	CONSTRAINT "tiplink_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiplink" ADD CONSTRAINT "tiplink_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
