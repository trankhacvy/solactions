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
import { TransactionStatus } from "./reference";
import { kolProfile } from "./kolProfile";

export const kolTransaction = pgTable("kol_transaction", {
  id: varchar("id").primaryKey(),
  profileId: text("profile_id")
    .references(() => kolProfile.id, {
      onDelete: "cascade",
    })
    .notNull(),
  sender: varchar("sender").notNull(),
  receiver: varchar("receiver").notNull(),
  email: varchar("email").notNull(),
  amount: numeric("amount").notNull(),
  currency: jsonb("currency").$type<Token>().default(tokenList[0]!),

  // transaction
  status: TransactionStatus("status").default("PROCESSING"),
  reference: varchar("reference").unique().notNull(),
  signature: varchar("signature").unique(),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const createKolTransactionSchema = createInsertSchema(
  kolTransaction,
).omit({ id: true });

export const updateKolTransactionSchema = createInsertSchema(
  kolTransaction,
)
  .omit({ profileId: true, reference: true })
  .pick({ id: true })
  .merge(createKolTransactionSchema.partial());