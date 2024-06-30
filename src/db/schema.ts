import { tokenList } from "@/config/tokens";
import { Token } from "@/types";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  numeric,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  wallet: varchar("wallet").unique().notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  email: text("email").unique(),
  name: varchar("name", { length: 256 }).default("Anon"),
  avatar: text("avatar"),
  bio: text("bio").default("I use solactions.fun to connect with people."),

  // donation
  acceptToken: jsonb("acceptToken").$type<Token>().default(tokenList[0]!),
  thankMessage: text("thankMessage").default(
    "Thank you for your donation; you made my day. <3",
  ),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const createUserSchema = createInsertSchema(users).omit({ id: true });

export const updateUserSchema = createUserSchema.partial();

export const selectUserSchema = createSelectSchema(users);

export const TransactionStatus = pgEnum("status", [
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);

export const donationTransactions = pgTable("donationTransactions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  status: TransactionStatus("status").default("PROCESSING"),
  sender: varchar("sender").notNull(),
  receiver: varchar("receiver").notNull(),
  amount: numeric("amount").notNull(),
  reference: varchar("reference").unique().notNull(),
  currency: jsonb("currency").$type<Token>().default(tokenList[0]!),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  donations: many(donationTransactions),
}));

export const createDonationTransactionSchema = createInsertSchema(
  donationTransactions,
).omit({ id: true });

export const updateDonationTransactionSchema =
  createDonationTransactionSchema.partial();
