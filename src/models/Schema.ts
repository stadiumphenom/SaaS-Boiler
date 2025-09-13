import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * ===============================
 * ORGANIZATION TABLE
 * ===============================
 */
export const organizationSchema = pgTable(
  "organization",
  {
    id: text("id").primaryKey(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeSubscriptionPriceId: text("stripe_subscription_price_id"),
    stripeSubscriptionStatus: text("stripe_subscription_status"),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      "stripe_subscription_current_period_end",
      { mode: "number" }
    ),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex("stripe_customer_id_idx").on(
        table.stripeCustomerId
      ),
    };
  }
);

/**
 * ===============================
 * TODO TABLE
 * ===============================
 */
export const todoSchema = pgTable("todo", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

/**
 * ===============================
 * LISTINGS TABLE (New)
 * ===============================
 */
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  address: text("address"),
  price: integer("price"),
  beds: integer("beds"),
  baths: integer("baths"),
  sqft: integer("sqft"),
  daysOnMarket: integer("days_on_market"),
  status: varchar("status", { length: 32 }), // e.g., FSBO, ACTIVE, SOLD, REDUCED
  sourceUrl: text("source_url"),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});
