CREATE TABLE IF NOT EXISTS "donation_profile" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256) DEFAULT 'Anon',
	"I use solactions.fun to connect with people." text,
	"slug" varchar(256) NOT NULL,
	"wallet" varchar NOT NULL,
	"accepted_token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"thanks_message" text DEFAULT 'Thank you for your donation; you made my day. <3',
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "donation_profile_slug_unique" UNIQUE("slug"),
	CONSTRAINT "donation_profile_wallet_unique" UNIQUE("wallet")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "screen_name" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_profile" ADD CONSTRAINT "donation_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
