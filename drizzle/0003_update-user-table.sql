ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "acceptToken" jsonb DEFAULT '{"name":"Solana","symbol":"SOL","isNative":true,"address":"","decimals":9,"icon":"https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "thankMessage" text;