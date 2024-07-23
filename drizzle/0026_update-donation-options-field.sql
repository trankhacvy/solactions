ALTER TABLE "donation_profile" ALTER COLUMN "amount_options" SET DATA TYPE numeric[];--> statement-breakpoint
ALTER TABLE "donation_profile" ALTER COLUMN "amount_options" DROP DEFAULT;