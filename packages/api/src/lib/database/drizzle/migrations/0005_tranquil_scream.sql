CREATE TABLE "image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"url_public" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" RENAME COLUMN "image_url" TO "image_id";--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;