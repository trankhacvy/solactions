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
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from ".";

export const tipLinks = pgTable("tipLinks", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
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

export const tiplinkRelations = relations(tipLinks, ({ one, many }) => ({
  user: one(users, {
    fields: [tipLinks.userId],
    references: [users.id],
  }),
  claims: many(tipLinkClaims),
}));

export const createTiplinksSchema = createInsertSchema(tipLinks).omit({
  id: true,
  userId: true,
});

export const ClaimStatus = pgEnum("claim_status", [
  "CLAIMING",
  "CLAIMED",
  "FAILED",
]);

export const tipLinkClaims = pgTable("tipLinkClaims", {
  id: varchar("id").primaryKey(),
  tiplinkId: varchar("tiplink_id")
    .notNull()
    .references(() => tipLinks.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  claimant: varchar("claimant").notNull(),
  note: text("note").default(""),
  status: ClaimStatus("status").default("CLAIMING"),
  reference: varchar("reference").unique().notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  claimAt: timestamp("claim_at", { withTimezone: true }),
});

export const tipLinkClaimRelations = relations(tipLinkClaims, ({ one }) => ({
  tiplinkId: one(tipLinks, {
    fields: [tipLinkClaims.tiplinkId],
    references: [tipLinks.id],
  }),
}));
