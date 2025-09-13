import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  address: text("address"),
  price: integer("price"),
  beds: integer("beds"),
  baths: integer("baths"),
  sqft: integer("sqft"),
  daysOnMarket: integer("days_on_market"),
  status: varchar("status", { length: 32 }),
  sourceUrl: text("source_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

