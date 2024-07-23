import { z } from "zod";
import { defaultToken } from "@/config/tokens";
import { Token } from "@/types";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  numeric,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { user } from ".";
import { TransactionStatus } from "./transaction";

export const tipLink = pgTable("tiplink", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).default("Tiplink"),
  message: text("message").default(""),
  amount: numeric("amount").notNull(),
  token: jsonb("token").notNull().$type<Token>().default(defaultToken),
  link: varchar("link").notNull(), // tip link
  claimant: varchar("claimant"),
  claimed: boolean("claimed").notNull().default(false),
  image: text("image"),

  // tx
  status: TransactionStatus("status").default("PROCESSING"),
  reference: varchar("reference").unique(),
  signature: varchar("signature").unique(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
});

export const tiplinkRelations = relations(tipLink, ({ one }) => ({
  user: one(user, {
    fields: [tipLink.userId],
    references: [user.id],
  }),
}));

export const createTiplinksSchema = createInsertSchema(tipLink).omit({
  id: true,
  userId: true,
  claimant: true,
  reference: true,
});

export const updateTiplinksSchema = createInsertSchema(tipLink)
  .omit({
    id: true,
    userId: true,
  })
  .partial()
  .merge(
    z.object({
      id: z.string().min(1),
    }),
  );
