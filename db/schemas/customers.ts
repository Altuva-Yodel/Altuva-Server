import { pgTable, serial, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const customerUsers = pgTable('customer_users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    password: varchar('password', { length: 255 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type CustomerUser = typeof customerUsers.$inferSelect;
export type NewCustomerUser = typeof customerUsers.$inferInsert;
