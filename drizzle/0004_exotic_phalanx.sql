CREATE TABLE IF NOT EXISTS "c_nft_dispenser" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"media" text,
	"name" varchar(32),
	"symbol" varchar(10),
	"description" varchar(200),
	"external_url" varchar,
	"royalty" numeric DEFAULT '0' NOT NULL,
	"max_depth" numeric DEFAULT '5' NOT NULL,
	"max_buffer_size" numeric DEFAULT '8' NOT NULL,
	"canopy_depth" numeric DEFAULT '2' NOT NULL,
	"merkle_tree_public_key" varchar DEFAULT '' NOT NULL,
	"collection_mint_public_keys" varchar,
	"useCollection" boolean DEFAULT false NOT NULL,
	"creators" jsonb DEFAULT '[]'::jsonb,
	"properties" jsonb DEFAULT '[]'::jsonb,
	"num_of_nft" integer DEFAULT 1 NOT NULL,
	"link" varchar NOT NULL,
	"claimed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c_nft_dispenser" ADD CONSTRAINT "c_nft_dispenser_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
