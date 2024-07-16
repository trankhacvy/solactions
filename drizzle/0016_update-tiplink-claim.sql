ALTER TABLE "tipLinkClaims" ADD COLUMN "link" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "tipLinkClaims" ADD COLUMN "claimed" boolean DEFAULT false;