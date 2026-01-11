import { date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role").default("user").notNull(),
  createdAt: date("created_at").defaultNow(),
});

export const maintenanceRequest = pgTable("maintenance_request", {
  id: uuid().primaryKey().defaultRandom(),
  applicant_name: varchar({ length: 255 }).notNull(),
  unit: varchar({ length: 100 }).notNull(),
  device_name: varchar({ length: 100 }).notNull(),
  damage_description: varchar({ length: 1000 }).notNull(),
  photo_url: varchar({ length: 500 }),
  applicant_date: date().notNull(),
  status: varchar({ length: 20 }).default("pending").notNull(),
});

export const devices = pgTable("devices", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull(),
  date_added: date().defaultNow(),
});

export const units = pgTable("units", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  dateAdded: date("date_added").defaultNow(),
});

export type MaintenanceRequest = typeof maintenanceRequest.$inferSelect;
export type NewMaintenanceRequest = typeof maintenanceRequest.$inferInsert;
export type Devices = typeof devices.$inferSelect;
export type NewDevices = typeof devices.$inferInsert;
export type NewUsers = typeof users.$inferInsert;
export type Users = typeof users.$inferSelect;
export type Units = typeof units.$inferSelect;
export type NewUnits = typeof units.$inferInsert;
