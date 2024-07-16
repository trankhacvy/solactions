ALTER TABLE "donationTransactions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "tipLinkClaims" RENAME COLUMN "tiplinkId" TO "tiplink_id";--> statement-breakpoint
ALTER TABLE "tipLinkClaims" RENAME COLUMN "thankMessage" TO "thank_message";--> statement-breakpoint
ALTER TABLE "tipLinks" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "tipLinks" RENAME COLUMN "numOfClaims" TO "num_of_claims";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "acceptToken" TO "accept_token";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "thankMessage" TO "thank_message";--> statement-breakpoint
ALTER TABLE "donationTransactions" DROP CONSTRAINT "donationTransactions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tipLinkClaims" DROP CONSTRAINT "tipLinkClaims_tiplinkId_tipLinks_id_fk";
--> statement-breakpoint
ALTER TABLE "tipLinks" DROP CONSTRAINT "tipLinks_userId_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "donationTransactions" ADD CONSTRAINT "donationTransactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tipLinkClaims" ADD CONSTRAINT "tipLinkClaims_tiplink_id_tipLinks_id_fk" FOREIGN KEY ("tiplink_id") REFERENCES "public"."tipLinks"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tipLinks" ADD CONSTRAINT "tipLinks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
