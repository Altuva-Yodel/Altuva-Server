import { pgTable, serial, varchar, boolean, timestamp, numeric } from 'drizzle-orm/pg-core';

export const taxes = pgTable('taxes', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    type: varchar('type', { length: 20 }).notNull().default('percentage'), // 'percentage' | 'flat'
    value: numeric('value', { precision: 8, scale: 4 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Tax = typeof taxes.$inferSelect;
export type NewTax = typeof taxes.$inferInsert;
