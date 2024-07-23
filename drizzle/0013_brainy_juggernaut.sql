ALTER TABLE "donationTransactions" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "tipLinks" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "donationTransactions" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tipLinkClaims" ADD CONSTRAINT "tipLinkClaims_tiplinkId_tipLinks_id_fk" FOREIGN KEY ("tiplinkId") REFERENCES "public"."tipLinks"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tipLinks" ADD CONSTRAINT "tipLinks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
