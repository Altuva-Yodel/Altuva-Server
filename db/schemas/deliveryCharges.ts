import { pgTable, serial, varchar, boolean, timestamp, numeric } from 'drizzle-orm/pg-core';

export const deliveryCharges = pgTable('delivery_charges', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    min_order_amount: numeric('min_order_amount', { precision: 10, scale: 2 }).notNull().default('0'),
    max_order_amount: numeric('max_order_amount', { precision: 10, scale: 2 }),
    charge: numeric('charge', { precision: 10, scale: 2 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type DeliveryCharge = typeof deliveryCharges.$inferSelect;
export type NewDeliveryCharge = typeof deliveryCharges.$inferInsert;
