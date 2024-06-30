DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('PROCESSING', 'SUCCESS', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donationTransactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"status" "status" DEFAULT 'PROCESSING',
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"reference" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "donationTransactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "slug" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DEFAULT 'Anon';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "bio" SET DEFAULT 'I use solactions.fun to connect with people.';