import { tokenList } from "@/config/tokens";
import { Token } from "@/types";
import {
  timestamp,
  pgTable,
  text,
  varchar,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "./users";
import { relations } from "drizzle-orm";
import { kolTransaction } from "./kol-fan-pay-transactions";

export const kolProfile = pgTable("kol_profile", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 256 }).default("Anon"),
  image: text("image"),
  bio: text("Pay for talk with me"),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  wallet: varchar("wallet").unique().notNull(),
  amountOptions: numeric("amount_options").array().notNull(),
  thankMessage: text("thanks_message").default(
    "You will receive a confirmation email after successful payment <3",
  ),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const kolProfileRelations = relations(
  kolProfile,
  ({ many }) => ({
    pay: many(kolTransaction),
  }),
);

export const createKolProfileSchema = createInsertSchema(
  kolProfile,
).omit({ id: true, userId: true });

export const updateKolProfileSchema = createInsertSchema(kolProfile)
  .pick({ id: true })
  .merge(createKolProfileSchema.partial());

export const selectKolProfileSchema = createSelectSchema(kolProfile);
