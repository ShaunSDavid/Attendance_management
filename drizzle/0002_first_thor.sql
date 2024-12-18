CREATE TABLE IF NOT EXISTS "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "name" SET DATA TYPE varchar(50);