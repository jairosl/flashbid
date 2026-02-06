CREATE TYPE "public"."auction_status" AS ENUM('PENDING', 'ACTIVE', 'CLOSED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "auction" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"start_price" numeric(10, 2) NOT NULL,
	"min_step" numeric(10, 2) DEFAULT '1.00',
	"buy_now_price" numeric(10, 2),
	"status" "auction_status" DEFAULT 'PENDING' NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auction" ADD CONSTRAINT "auction_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auction_status_idx" ON "auction" USING btree ("status");--> statement-breakpoint
CREATE INDEX "auction_ends_at_idx" ON "auction" USING btree ("ends_at");