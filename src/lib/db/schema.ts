import { date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

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

export type MaintenanceRequest = typeof maintenanceRequest.$inferSelect;
export type NewMaintenanceRequest = typeof maintenanceRequest.$inferInsert;
export type Devices = typeof devices.$inferSelect;
export type NewDevices = typeof devices.$inferInsert;
