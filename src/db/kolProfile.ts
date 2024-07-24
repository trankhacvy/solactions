import { tokenList } from "@/config/tokens";
import { Token } from "@/types";
import {
  timestamp,
  pgTable,
  text,
  varchar,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "./users";
import { relations } from "drizzle-orm";
import { kolTransaction } from "./kol-fan-pay-transactions";

export const kolProfile = pgTable("kol_profile", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).default("Tiplink"),
  message: text("message").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const kolProfileRelations = relations(
  kolProfile,
  ({ many }) => ({
    pay: many(kolTransaction),
  }),
);

export const createKolProfileSchema = createInsertSchema(
  kolProfile,
).omit({ id: true, userId: true });

export const updateKolProfileSchema = createInsertSchema(kolProfile)
  .pick({ id: true })
  .merge(createKolProfileSchema.partial());

export const selectKolProfileSchema = createSelectSchema(kolProfile);
