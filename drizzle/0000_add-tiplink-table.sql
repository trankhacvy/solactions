DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('PROCESSING', 'SUCCESS', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"screen_name" text,
	"email" text NOT NULL,
	"wallet" varchar,
	"emailVerified" timestamp,
	"image" text,
	"description" text,
	"is_new_user" boolean DEFAULT true,
	CONSTRAINT "user_wallet_unique" UNIQUE("wallet")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" varchar PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'PROCESSING',
	"reference" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transaction_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donation_profile" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256) DEFAULT 'Anon',
	"image" text,
	"I use solactions.fun to connect with people." text,
	"slug" varchar(256) NOT NULL,
	"wallet" varchar NOT NULL,
	"accepted_token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb NOT NULL,
	"amount_options" integer[] DEFAULT '{}'::int[] NOT NULL,
	"thanks_message" text DEFAULT 'Thank you for your donation; you made my day. <3',
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "donation_profile_slug_unique" UNIQUE("slug"),
	CONSTRAINT "donation_profile_wallet_unique" UNIQUE("wallet")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donation_transaction" (
	"id" varchar PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"tx_id" text NOT NULL,
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"currency" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiplink" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar(256) DEFAULT 'Tiplink',
	"message" text DEFAULT '',
	"amount" numeric NOT NULL,
	"amount_per_link" numeric NOT NULL,
	"token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb NOT NULL,
	"multiple" boolean DEFAULT false,
	"claimable" boolean DEFAULT true,
	"wallet" varchar,
	"num_of_claims" integer DEFAULT 1,
	"claimed" integer DEFAULT 0,
	"link" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiplink_claim" (
	"id" varchar PRIMARY KEY NOT NULL,
	"tiplink_id" varchar NOT NULL,
	"claimant" varchar NOT NULL,
	"note" text DEFAULT '',
	"tx_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"claim_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_profile" ADD CONSTRAINT "donation_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_transaction" ADD CONSTRAINT "donation_transaction_profile_id_donation_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."donation_profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donation_transaction" ADD CONSTRAINT "donation_transaction_tx_id_transaction_id_fk" FOREIGN KEY ("tx_id") REFERENCES "public"."transaction"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiplink" ADD CONSTRAINT "tiplink_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiplink_claim" ADD CONSTRAINT "tiplink_claim_tiplink_id_tiplink_id_fk" FOREIGN KEY ("tiplink_id") REFERENCES "public"."tiplink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiplink_claim" ADD CONSTRAINT "tiplink_claim_tx_id_transaction_id_fk" FOREIGN KEY ("tx_id") REFERENCES "public"."transaction"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
