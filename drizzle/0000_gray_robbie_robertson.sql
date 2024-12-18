CREATE TABLE IF NOT EXISTS "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"Rollno" varchar(10) NOT NULL,
	"absent1" boolean DEFAULT false,
	"absent2" boolean DEFAULT false,
	"absent3" boolean DEFAULT false,
	"day" integer NOT NULL,
	"date" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"year" varchar(10) NOT NULL,
	"regno" varchar(15) NOT NULL,
	"rollno" varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "years" (
	"id" integer PRIMARY KEY NOT NULL,
	"yearNo" varchar(10) NOT NULL
);
