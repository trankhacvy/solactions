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
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { user } from ".";

export const cnftDispenser = pgTable("c_nft_dispenser", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  media: text("media"),
  name: varchar("name", { length: 32 }),
  symbol: varchar("symbol", { length: 10 }),
  description: varchar("description", { length: 200 }),
  externalUrl: varchar("external_url"),
  royalty: numeric("royalty").notNull().default("0"),
  max_depth: numeric("max_depth").notNull().default("5"),
  max_buffer_size: numeric("max_buffer_size").notNull().default("8"),
  canopy_depth: numeric("canopy_depth").notNull().default("2"),
  merkleTreePublicKey: varchar("merkle_tree_public_key"),
  collectionMintPublicKeys: varchar("collection_mint_public_keys"),
  useCollection: boolean("useCollection").notNull().default(false),
  creators: jsonb("creators").$type<Omit<Creator, "verified">[]>().default([]),
  properties: jsonb("properties").$type<Property[]>().default([]),
  numOfNFT: integer("num_of_nft").notNull().default(1),
  link: varchar("link").notNull(),
  claimed: integer("claimed").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const cnftDispenserRelations = relations(cnftDispenser, ({ one }) => ({
  user: one(user, {
    fields: [cnftDispenser.userId],
    references: [user.id],
  }),
}));

export const createCNFTDispenserSchema = createInsertSchema(cnftDispenser, {
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
  max_depth: z.coerce.number(),
  max_buffer_size: z.coerce.number(),
  canopy_depth: z.coerce.number(),
}).omit({
  id: true,
  userId: true,
});

export const updateCNFTDispenserSchema = createCNFTDispenserSchema.partial().merge(
  z.object({
    id: z.string().min(1),
  }),
);
