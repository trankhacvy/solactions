DO $$ BEGIN
 CREATE TYPE "public"."reference_type" AS ENUM('DONATION', 'TIPLINK', 'TALKWITHME');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('PROCESSING', 'SUCCESS', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."booking" AS ENUM('TELEGRAM', 'CALENDLY');
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
	"email" text,
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
CREATE TABLE IF NOT EXISTS "donation_profile" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256) DEFAULT 'Anon',
	"image" text,
	"I use solactions.fun to connect with people." text,
	"slug" varchar(256) NOT NULL,
	"wallet" varchar NOT NULL,
	"accepted_token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb NOT NULL,
	"amount_options" numeric[] NOT NULL,
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
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"currency" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"status" "status" DEFAULT 'PROCESSING',
	"reference" varchar NOT NULL,
	"signature" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "donation_transaction_reference_unique" UNIQUE("reference"),
	CONSTRAINT "donation_transaction_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reference" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" varchar NOT NULL,
	"reference_type" "reference_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "reference_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
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
	"image" text,
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
CREATE TABLE IF NOT EXISTS "kol_profile" (
	"image" text,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"type" "booking" NOT NULL,
	"desc" varchar NOT NULL,
	"calendy_url" varchar NOT NULL,
	"telegram_username" varchar NOT NULL,
	"price" numeric NOT NULL,
	"thanks_message" text DEFAULT 'You will receive a confirmation email after successful payment <3',
	"duration" numeric NOT NULL,
	"accepted_token" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb NOT NULL,
	"user_id" text NOT NULL,
	"slug" text NOT NULL,
	"wallet" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kol_transaction" (
	"id" varchar PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"email" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"currency" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"status" "status" DEFAULT 'PROCESSING',
	"reference" varchar NOT NULL,
	"signature" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "kol_transaction_reference_unique" UNIQUE("reference"),
	CONSTRAINT "kol_transaction_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nft_dispenser" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"media" text,
	"name" varchar(32),
	"is_collection" boolean DEFAULT false NOT NULL,
	"symbol" varchar(10),
	"description" varchar(200),
	"external_url" varchar,
	"royalty" numeric DEFAULT '0' NOT NULL,
	"creators" jsonb DEFAULT '[]'::jsonb,
	"properties" jsonb DEFAULT '[]'::jsonb,
	"num_of_nft" integer DEFAULT 1 NOT NULL,
	"link" varchar NOT NULL,
	"claimed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "c_nft_dispenser" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"media" text,
	"name" varchar(32),
	"symbol" varchar(10),
	"description" varchar(200),
	"external_url" varchar,
	"royalty" numeric DEFAULT '0' NOT NULL,
	"max_depth" numeric DEFAULT '5' NOT NULL,
	"max_buffer_size" numeric DEFAULT '8' NOT NULL,
	"canopy_depth" numeric DEFAULT '2' NOT NULL,
	"merkle_tree_public_key" varchar,
	"collection_mint_public_keys" varchar,
	"useCollection" boolean DEFAULT false NOT NULL,
	"creators" jsonb DEFAULT '[]'::jsonb,
	"properties" jsonb DEFAULT '[]'::jsonb,
	"num_of_nft" integer DEFAULT 1 NOT NULL,
	"link" varchar NOT NULL,
	"claimed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
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
 ALTER TABLE "tiplink" ADD CONSTRAINT "tiplink_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kol_profile" ADD CONSTRAINT "kol_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kol_profile" ADD CONSTRAINT "kol_profile_slug_donation_profile_slug_fk" FOREIGN KEY ("slug") REFERENCES "public"."donation_profile"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kol_profile" ADD CONSTRAINT "kol_profile_wallet_donation_profile_wallet_fk" FOREIGN KEY ("wallet") REFERENCES "public"."donation_profile"("wallet") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kol_transaction" ADD CONSTRAINT "kol_transaction_profile_id_kol_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."kol_profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nft_dispenser" ADD CONSTRAINT "nft_dispenser_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c_nft_dispenser" ADD CONSTRAINT "c_nft_dispenser_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
