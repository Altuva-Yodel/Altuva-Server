import { pgTable, serial, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { customerUsers } from './customers';

export const addresses = pgTable('addresses', {
    id: serial('id').primaryKey(),
    customer_id: integer('customer_id').notNull().references(() => customerUsers.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    address_line_1: varchar('address_line_1', { length: 500 }).notNull(),
    address_line_2: varchar('address_line_2', { length: 500 }),
    landmark: varchar('landmark', { length: 255 }),
    pin: varchar('pin', { length: 20 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }).notNull(),
    country: varchar('country', { length: 100 }).notNull().default('India'),
    is_default: boolean('is_default').notNull().default(false),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
