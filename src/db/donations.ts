import { donateOptions, tokenList } from "@/config/tokens";
import { Token } from "@/types";
import {
  timestamp,
  pgTable,
  text,
  varchar,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { usersV2 } from "./users";
import { relations, sql } from "drizzle-orm";
import { donationTransaction } from ".";

export const donationProfile = pgTable("donation_profile", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 256 }).default("Anon"),
  image: text("image"),
  bio: text("I use solactions.fun to connect with people."),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  wallet: varchar("wallet").unique().notNull(),
  acceptToken: jsonb("accepted_token")
    .$type<Token>()
    .notNull()
    .default(tokenList[0]!),
  amountOptions: integer("amount_options")
    .array()
    .notNull()
    .default(sql`'{}'::int[]`),
  thankMessage: text("thanks_message").default(
    "Thank you for your donation; you made my day. <3",
  ),
  userId: text("user_id")
    .references(() => usersV2.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const donationProfileRelations = relations(
  donationProfile,
  ({ many }) => ({
    donations: many(donationTransaction),
  }),
);

export const createDonationProfileSchema = createInsertSchema(
  donationProfile,
).omit({ id: true, userId: true });

export const updateDonationProfileSchema = createInsertSchema(donationProfile)
  .pick({ id: true })
  .merge(createDonationProfileSchema.partial());

export const selectDonationProfileSchema = createSelectSchema(donationProfile);
