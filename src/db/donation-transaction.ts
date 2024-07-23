import { tokenList } from "@/config/tokens";
import { Token } from "@/types";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { donationProfile } from "./donations";
import { TransactionStatus } from "./reference";

export const donationTransaction = pgTable("donation_transaction", {
  id: varchar("id").primaryKey(),
  profileId: text("profile_id")
    .references(() => donationProfile.id, {
      onDelete: "cascade",
    })
    .notNull(),
  sender: varchar("sender").notNull(),
  receiver: varchar("receiver").notNull(),
  amount: numeric("amount").notNull(),
  currency: jsonb("currency").$type<Token>().default(tokenList[0]!),

  // transaction
  status: TransactionStatus("status").default("PROCESSING"),
  reference: varchar("reference").unique().notNull(),
  signature: varchar("signature").unique(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const createDonationTransactionSchema = createInsertSchema(
  donationTransaction,
).omit({ id: true });

export const updateDonationTransactionSchema = createInsertSchema(
  donationTransaction,
)
  .omit({ profileId: true, reference: true })
  .pick({ id: true })
  .merge(createDonationTransactionSchema.partial());
