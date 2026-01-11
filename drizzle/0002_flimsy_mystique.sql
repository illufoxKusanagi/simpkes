CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar DEFAULT 'user' NOT NULL,
	"created_at" date DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
