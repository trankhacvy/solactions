ALTER TABLE "tipLinks" RENAME COLUMN "description" TO "message";--> statement-breakpoint
ALTER TABLE "tipLinks" ADD COLUMN "claimed" integer DEFAULT 0;