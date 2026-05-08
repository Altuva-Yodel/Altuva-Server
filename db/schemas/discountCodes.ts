import { pgTable, serial, varchar, boolean, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const discountCodes = pgTable('discount_codes', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 100 }).notNull().unique(),
    type: varchar('type', { length: 20 }).notNull().default('flat'), // 'flat' | 'percentage'
    value: numeric('value', { precision: 10, scale: 2 }).notNull(),
    min_order_amount: numeric('min_order_amount', { precision: 10, scale: 2 }).default('0'),
    max_uses: integer('max_uses'),
    used_count: integer('used_count').notNull().default(0),
    is_active: boolean('is_active').notNull().default(true),
    expires_at: timestamp('expires_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type NewDiscountCode = typeof discountCodes.$inferInsert;
