import { pgTable, serial, varchar, boolean, timestamp, text, numeric, integer, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),

    // Basic Info
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    brand: varchar('brand', { length: 255 }).notNull(),

    // Category
    category: varchar('category', { length: 100 }).notNull(),
    sub_category: varchar('sub_category', { length: 100 }),
    type: varchar('type', { length: 100 }).default('Edible'),

    // Pricing
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    discounted_price: numeric('discounted_price', { precision: 10, scale: 2 }),
    discount_percentage: numeric('discount_percentage', { precision: 5, scale: 2 }).default('0'),
    currency: varchar('currency', { length: 10 }).default('INR'),

    // Inventory
    stock: integer('stock').notNull().default(0),
    low_stock_threshold: integer('low_stock_threshold').default(5),
    is_in_stock: boolean('is_in_stock').default(true),
    sku: varchar('sku', { length: 100 }).unique(),

    // Images
    primary_image: varchar('primary_image', { length: 500 }).notNull(),
    secondary_image: varchar('secondary_image', { length: 500 }),
    images: jsonb('images').default([]),

    // Description
    description: text('description').notNull(),
    detailed_description: text('detailed_description'),
    key_features: jsonb('key_features').default([]),

    // Food-specific
    ingredients: jsonb('ingredients').default([]),
    nutrition_info: jsonb('nutrition_info').default({}),
    shelf_life: varchar('shelf_life', { length: 100 }),
    storage_instructions: text('storage_instructions'),
    care_instructions: text('care_instructions'),

    // Origin & Manufacturer
    country_of_origin: varchar('country_of_origin', { length: 100 }),
    manufacturer: jsonb('manufacturer').default({}),

    // Contact / Compliance
    contact_email: varchar('contact_email', { length: 255 }),
    contact_phone: varchar('contact_phone', { length: 20 }),

    // External Links
    amazon_link: varchar('amazon_link', { length: 500 }),

    // Tags & Filters
    tags: jsonb('tags').default([]),
    flavors: jsonb('flavors').default([]),
    weight: varchar('weight', { length: 50 }),

    // Ratings
    ratings_average: numeric('ratings_average', { precision: 3, scale: 2 }).default('0'),
    ratings_count: integer('ratings_count').default(0),

    // Status
    is_active: boolean('is_active').default(true),
    is_featured: boolean('is_featured').default(false),

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
