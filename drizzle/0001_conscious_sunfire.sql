ALTER TABLE "devices" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "maintenance_request" ADD COLUMN "status" varchar(20) DEFAULT 'pending' NOT NULL;