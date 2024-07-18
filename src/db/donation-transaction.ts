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
import { z } from "zod";
import { transaction } from "./transaction";

export const donationTransaction = pgTable("donation_transaction", {
  id: varchar("id").primaryKey(),
  profileId: text("profile_id")
    .references(() => donationProfile.id, {
      onDelete: "cascade",
    })
    .notNull(),
  txId: text("tx_id")
    .references(() => transaction.id, {
      onDelete: "cascade",
    })
    .notNull(),
  sender: varchar("sender").notNull(),
  receiver: varchar("receiver").notNull(),
  amount: numeric("amount").notNull(),
  currency: jsonb("currency").$type<Token>().default(tokenList[0]!),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const createDonationTransactionSchema = createInsertSchema(
  donationTransaction,
)
  .omit({ id: true, txId: true })
  .extend({
    reference: z.string(),
  });

export const updateDonationTransactionSchema = createInsertSchema(
  donationTransaction,
)
  .pick({ id: true })
  .merge(createDonationTransactionSchema.partial());
