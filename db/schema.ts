import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text("email").notNull(),
    name: text("name"),
    imageUrl: text("image_url"),
    credits: integer("credits").default(2).notNull(),
    freeGenerationsUsed: integer("free_generations_used").default(0).notNull(),
    subscriptionStatus: text("subscription_status").default("free").notNull(),
    dodoCustomerId: text("dodo_customer_id"),
    dodoSubscriptionId: text("dodo_subscription_id"),
    dodoProductId: text("dodo_product_id"),
    subscriptionCurrentPeriodEnd: timestamp(
      "subscription_current_period_end",
      { withTimezone: true },
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_clerk_user_id_idx").on(table.clerkUserId),
    uniqueIndex("users_dodo_customer_id_idx").on(table.dodoCustomerId),
    uniqueIndex("users_dodo_subscription_id_idx").on(
      table.dodoSubscriptionId,
    ),
    index("users_email_idx").on(table.email),
  ],
);

export const billingEvents = pgTable(
  "billing_events",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    dodoSubscriptionId: text("dodo_subscription_id"),
    processedAt: timestamp("processed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("billing_events_subscription_idx").on(table.dodoSubscriptionId),
  ],
);

export const generations = pgTable(
  "generations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: text("mode").notNull(),
    style: text("style").notNull(),
    strength: text("strength").notNull(),
    aspectRatio: text("aspect_ratio").notNull(),
    customPrompt: text("custom_prompt"),
    status: text("status").default("queued").notNull(),
    originalKey: text("original_key").notNull(),
    resultKey: text("result_key"),
    previewKey: text("preview_key"),
    originalName: text("original_name").notNull(),
    originalMimeType: text("original_mime_type").notNull(),
    resultMimeType: text("result_mime_type"),
    outputWidth: integer("output_width"),
    outputHeight: integer("output_height"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("generations_user_created_idx").on(table.userId, table.createdAt),
    index("generations_status_idx").on(table.status),
  ],
);

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    generationId: uuid("generation_id").references(() => generations.id, {
      onDelete: "set null",
    }),
    amount: integer("amount").notNull(),
    kind: text("kind").notNull(),
    externalEventId: text("external_event_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("credit_transactions_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
    uniqueIndex("credit_transactions_kind_generation_idx").on(
      table.kind,
      table.generationId,
    ),
    uniqueIndex("credit_transactions_external_event_idx").on(
      table.externalEventId,
    ),
  ],
);

export type AppUser = typeof users.$inferSelect;
export type NewAppUser = typeof users.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type BillingEvent = typeof billingEvents.$inferSelect;
