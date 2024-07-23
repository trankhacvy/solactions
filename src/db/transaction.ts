import { pgTable, varchar, timestamp, pgEnum, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { donationProfile } from "./donations";
import { relations } from "drizzle-orm";
import { donationTransaction } from "./donation-transaction";

export const TransactionStatus = pgEnum("status", [
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);

export const transaction = pgTable("transaction", {
  id: varchar("id").primaryKey(),
  status: TransactionStatus("status").default("PROCESSING"),
  reference: varchar("reference").unique().notNull(),
  // signature: varchar("signature").unique(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const transactionRelations = relations(
  donationProfile,
  ({ one, many }) => ({
    donations: one(donationTransaction),
    // tiplinkClaim: many(tipLinkClaim),
  }),
);

const createTransactionSchema = createInsertSchema(transaction).omit({
  id: true,
});

export const updateTransactionSchema = createTransactionSchema
  .pick({ reference: true })
  .merge(createTransactionSchema.omit({ reference: true }).partial());
