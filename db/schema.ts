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
    credits: integer("credits").default(0).notNull(),
    freeGenerationsUsed: integer("free_generations_used").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_clerk_user_id_idx").on(table.clerkUserId),
    index("users_email_idx").on(table.email),
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

export type AppUser = typeof users.$inferSelect;
export type NewAppUser = typeof users.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
