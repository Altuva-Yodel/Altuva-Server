import { pgTable, serial, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { customerUsers } from './customers';
import { discountCodes } from './discountCodes';
import { products } from './products';

export const carts = pgTable('carts', {
    id: serial('id').primaryKey(),
    customer_id: integer('customer_id').notNull().unique().references(() => customerUsers.id, { onDelete: 'cascade' }),
    discount_code_id: integer('discount_code_id').references(() => discountCodes.id, { onDelete: 'set null' }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
    id: serial('id').primaryKey(),
    cart_id: integer('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
    product_id: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(1),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
