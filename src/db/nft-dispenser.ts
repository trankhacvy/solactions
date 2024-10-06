import { z } from "zod";
import { Creator, Property } from "@/types";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  numeric,
  jsonb,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { user } from ".";

export const nftDispenser = pgTable("nft_dispenser", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  media: text("media"),
  name: varchar("name", { length: 32 }),
  isCollection: boolean("is_collection").notNull().default(false),
  symbol: varchar("symbol", { length: 10 }),
  description: varchar("description", { length: 200 }),
  externalUrl: varchar("external_url"),
  royalty: numeric("royalty").notNull().default("0"),
  creators: jsonb("creators").$type<Omit<Creator, "verified">[]>().default([]),
  properties: jsonb("properties").$type<Property[]>().default([]),
  numOfNFT: integer("num_of_nft").notNull().default(1),
  link: varchar("link").notNull(),
  claimed: integer("claimed").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const nftDispenserRelations = relations(nftDispenser, ({ one }) => ({
  user: one(user, {
    fields: [nftDispenser.userId],
    references: [user.id],
  }),
}));

export const createNFTDispenserSchema = createInsertSchema(nftDispenser, {
  creators: z.array(
    z.object({
      address: z.string().trim().min(1),
      share: z.coerce.number().min(0).max(100),
    }),
  ),
  properties: z.array(
    z.object({
      name: z.string().trim().min(1),
      value: z.string().trim().min(1),
    }),
  ),
  royalty: z.coerce.number(),
}).omit({
  id: true,
  userId: true,
});

export const updateNFTDispenerSchema = createNFTDispenserSchema.partial().merge(
  z.object({
    id: z.string().min(1),
  }),
);
