import { pgTable, serial, varchar, timestamp, text, numeric, integer, jsonb } from 'drizzle-orm/pg-core';
import { customerUsers } from './customers';
import { products } from './products';

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    order_number: varchar('order_number', { length: 50 }).notNull().unique(),
    customer_id: integer('customer_id').notNull().references(() => customerUsers.id, { onDelete: 'restrict' }),
    delivery_address: jsonb('delivery_address').notNull(),
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
    discount_amount: numeric('discount_amount', { precision: 10, scale: 2 }).notNull().default('0'),
    discount_code: varchar('discount_code', { length: 100 }),
    tax_amount: numeric('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
    tax_breakdown: jsonb('tax_breakdown').notNull().default([]),
    delivery_charge: numeric('delivery_charge', { precision: 10, scale: 2 }).notNull().default('0'),
    grand_total: numeric('grand_total', { precision: 10, scale: 2 }).notNull(),
    // 'payment_pending' | 'placed' | 'confirmed' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'canceled' | 'refunded'
    status: varchar('status', { length: 50 }).notNull().default('payment_pending'),
    payment_method: varchar('payment_method', { length: 30 }).notNull().default('online'),
    razorpay_order_id: varchar('razorpay_order_id', { length: 100 }),
    razorpay_payment_id: varchar('razorpay_payment_id', { length: 100 }),
    razorpay_signature: varchar('razorpay_signature', { length: 500 }),
    payment_status: varchar('payment_status', { length: 30 }).notNull().default('pending'), // 'pending' | 'paid' | 'failed'
    notes: text('notes'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    product_id: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
    product_name: varchar('product_name', { length: 255 }).notNull(),
    product_sku: varchar('product_sku', { length: 100 }),
    product_image: varchar('product_image', { length: 500 }),
    quantity: integer('quantity').notNull(),
    unit_price: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    unit_mrp: numeric('unit_mrp', { precision: 10, scale: 2 }).notNull(),
    line_total: numeric('line_total', { precision: 10, scale: 2 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
