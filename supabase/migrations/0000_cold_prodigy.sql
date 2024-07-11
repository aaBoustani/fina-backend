CREATE TABLE IF NOT EXISTS "analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"dish_name" text NOT NULL,
	"macros" json NOT NULL,
	"weight" text NOT NULL,
	"energy" json NOT NULL,
	"nutritional_values" json[],
	"ingredients" json[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upload" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"analysis_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upload" ADD CONSTRAINT "upload_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
