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
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { transaction, user } from ".";

export const tipLink = pgTable("tiplink", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).default("Tiplink"),
  message: text("message").default(""),
  amount: numeric("amount").notNull(),
  amountPerLink: numeric("amount_per_link").notNull(),
  token: jsonb("token").notNull().$type<Token>().default(defaultToken),
  multiple: boolean("multiple").default(false),
  claimable: boolean("claimable").default(true),
  // single
  receiver: varchar("wallet"),
  // multiple
  numOfClaims: integer("num_of_claims").default(1),
  claimed: integer("claimed").default(0),

  link: varchar("link").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const tiplinkRelations = relations(tipLink, ({ one, many }) => ({
  user: one(user, {
    fields: [tipLink.userId],
    references: [user.id],
  }),
  claims: many(tipLinkClaim),
}));

export const createTiplinksSchema = createInsertSchema(tipLink).omit({
  id: true,
  userId: true,
});

export const tipLinkClaim = pgTable("tiplink_claim", {
  id: varchar("id").primaryKey(),
  tiplinkId: varchar("tiplink_id")
    .notNull()
    .references(() => tipLink.id, {
      onDelete: "cascade",
    }),
  claimant: varchar("claimant").notNull(),
  note: text("note").default(""),
  
  // txId: text("tx_id")
  //   .references(() => transaction.id, {
  //     onDelete: "cascade",
  //   })
  //   .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  claimAt: timestamp("claim_at", { withTimezone: true }).defaultNow(),
});

export const tiplinkClaimRelations = relations(
  tipLinkClaim,
  ({ one }) => ({
    tiplink: one(tipLink, {
      fields: [tipLinkClaim.tiplinkId],
      references: [tipLink.id],
    }),
    transaction: one(transaction),
  }),
);

export const createTiplinkClaimSchema = createInsertSchema(tipLinkClaim)
  .omit({ id: true, 
    // txId: true 
  })
  .extend({
    reference: z.string(),
  });

export const updateTiplinkClaimSchema = createInsertSchema(tipLinkClaim)
  .pick({ id: true })
  .merge(createTiplinkClaimSchema.partial());
