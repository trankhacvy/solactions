CREATE TABLE IF NOT EXISTS "nftCampaigns" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar(256) DEFAULT 'New NFT Campaign',
	"description" text DEFAULT 'New NFT Campaign',
	"status" "status" DEFAULT 'PROCESSING',
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"reference" varchar NOT NULL,
	"currency" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "nftCampaigns_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tipLinks" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"currency" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb,
	"multiple" boolean DEFAULT false,
	"claimPerWallet" integer DEFAULT 1,
	"wallet" varchar,
	"numOfClaims" integer DEFAULT 2,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "donationTransactions" ALTER COLUMN "currency" SET DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "acceptToken" SET DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"So11111111111111111111111111111111111111112","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb;