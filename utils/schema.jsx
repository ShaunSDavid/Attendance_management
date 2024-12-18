import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  uniqueKey,
  UniqueConstraint,
  check,
} from "drizzle-orm/pg-core";

export const Users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 50 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull(),
  },
  (table) => {
    return {
      roleCheck: check("role-check", `${table.role} IN ('student', 'teacher')`),
    };
  }
);

export const Years = pgTable("years", {
  id: integer("id").primaryKey(),
  yearNo: varchar("yearNo", { length: 20 }).notNull(),
});

export const Teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

export const Students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  regno: varchar("regno", { length: 15 }).notNull(),
  rollno: varchar("rollno", { length: 15 }).notNull(),
});

export const Attendance = pgTable(
  "attendance",
  {
    id: serial("id", { length: 10 }).primaryKey(),
    Rollno: varchar("Rollno", { length: 10 }).notNull(),
    absent1: boolean("absent1").default(false),
    absent2: boolean("absent2").default(false),
    absent3: boolean("absent3").default(false),
    day: integer("day", { length: 11 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(),
  },
  (table) => {
    return {
      UniqueConstraint: {
        unique: ["Rollno", "day", "date"],
      },
    };
  }
);
