CREATE TABLE IF NOT EXISTS "tipLinkClaims" (
	"id" varchar PRIMARY KEY NOT NULL,
	"tiplinkId" varchar NOT NULL,
	"claimant" varchar,
	"thankMessage" text DEFAULT 'Thank you for your donation; you made my day. <3',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tipLinks" ADD COLUMN "claimable" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "tipLinks" DROP COLUMN IF EXISTS "claimPerWallet";