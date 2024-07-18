ALTER TABLE "donation_profile" ALTER COLUMN "accepted_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "donation_profile" ADD COLUMN "amount_options" integer[] DEFAULT '{}'::int[] NOT NULL;