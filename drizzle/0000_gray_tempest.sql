CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"date_added" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_name" varchar(255) NOT NULL,
	"unit" varchar(100) NOT NULL,
	"device_name" varchar(100) NOT NULL,
	"damage_description" varchar(1000) NOT NULL,
	"photo_url" varchar(500),
	"applicant_date" date NOT NULL
);
