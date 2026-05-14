CREATE TABLE "happy_customer_avatars" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "happy_customer_testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"avatar_id" integer NOT NULL,
	"quote" text NOT NULL,
	"person_name" varchar(255) NOT NULL,
	"designation" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
