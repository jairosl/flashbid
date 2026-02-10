CREATE TABLE "bid" (
	"id" uuid PRIMARY KEY NOT NULL,
	"auction_id" uuid NOT NULL,
	"bidder_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_auction_id_auction_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."auction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bid_auction_idx" ON "bid" USING btree ("auction_id");