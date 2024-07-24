import { pgTable, varchar, timestamp, pgEnum, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const ReferenceType = pgEnum("reference_type", ["DONATION", "TIPLINK", "TALKWITHME"]);

export const TransactionStatus = pgEnum("status", [
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);

export const reference = pgTable("reference", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  reference: varchar("reference").unique().notNull(),
  type: ReferenceType("reference_type").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const createReferenceSchema = createInsertSchema(reference).omit({
  id: true,
});
