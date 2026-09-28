CREATE TABLE "billing_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"user_id" uuid,
	"dodo_subscription_id" text,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"generation_id" uuid,
	"amount" integer NOT NULL,
	"kind" text NOT NULL,
	"external_event_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "credits" SET DEFAULT 2;--> statement-breakpoint
UPDATE "users"
SET "credits" = 2, "updated_at" = now()
WHERE "credits" = 0 AND "free_generations_used" = 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dodo_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dodo_subscription_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dodo_product_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_current_period_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "billing_events_subscription_idx" ON "billing_events" USING btree ("dodo_subscription_id");--> statement-breakpoint
CREATE INDEX "credit_transactions_user_created_idx" ON "credit_transactions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_transactions_kind_generation_idx" ON "credit_transactions" USING btree ("kind","generation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_transactions_external_event_idx" ON "credit_transactions" USING btree ("external_event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_dodo_customer_id_idx" ON "users" USING btree ("dodo_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_dodo_subscription_id_idx" ON "users" USING btree ("dodo_subscription_id");
