DO $$ BEGIN
 ALTER TABLE "donationTransactions" ADD CONSTRAINT "donationTransactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
