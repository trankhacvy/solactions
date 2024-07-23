DO $$ BEGIN
 CREATE TYPE "public"."claim_status" AS ENUM('CLAIMING', 'CLAIMED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tipLinkClaims" (
	"id" varchar PRIMARY KEY NOT NULL,
	"tiplink_id" varchar NOT NULL,
	"claimant" varchar NOT NULL,
	"note" text DEFAULT '',
	"status" "claim_status" DEFAULT 'CLAIMING',
	"reference" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"claim_at" timestamp with time zone,
	CONSTRAINT "tipLinkClaims_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "tipLinks" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tipLinks" ALTER COLUMN "link" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tipLinks" ADD COLUMN "amount_per_link" numeric NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tipLinkClaims" ADD CONSTRAINT "tipLinkClaims_tiplink_id_tipLinks_id_fk" FOREIGN KEY ("tiplink_id") REFERENCES "public"."tipLinks"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tipLinks" DROP COLUMN IF EXISTS "claimant";--> statement-breakpoint
ALTER TABLE "tipLinks" DROP COLUMN IF EXISTS "claim_at";