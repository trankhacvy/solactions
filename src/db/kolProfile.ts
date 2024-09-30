import { tokenList } from "@/config/tokens";
import { Token } from "@/types";
import {
  timestamp,
  pgTable,
  text,
  varchar,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { donationProfile } from "./donations";
import { relations } from "drizzle-orm";
import { kolTransaction } from "./kol-fan-pay-transactions";

export const TypeBooking = pgEnum("booking", [
  "TELEGRAM",
  "CALENDLY",
]);

export const kolProfile = pgTable("kol_profile", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  type: TypeBooking("type").notNull(),
  description: varchar("desc").notNull(),
  calendyUrl: varchar("calendy_url").notNull(),
  telegram_username: varchar("username").notNull(),
  price: numeric("price").notNull(),
  thankMessage: text("thanks_message").default(
    "You will receive a confirmation email after successful payment <3",
  ),
  userId: text("user_id")
    .references(() => donationProfile.id, { onDelete: "cascade" })
    .notNull(),
  slug: text("slug")
     .references(() => donationProfile.slug, {onDelete: "cascade"})
     .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const kolProfileRelations = relations(
  kolProfile,
  ({ many }) => ({
    booking: many(kolTransaction),
  }),
);

export const createKolProfileSchema = createInsertSchema(
  kolProfile,
).omit({ id: true, userId: true });

export const updateKolProfileSchema = createInsertSchema(kolProfile)
  .pick({ id: true })
  .merge(createKolProfileSchema.partial());

export const selectKolProfileSchema = createSelectSchema(kolProfile);
