import { pgTable, serial, varchar, boolean, timestamp, text, integer } from 'drizzle-orm/pg-core';

// ─── Hero Banners ─────────────────────────────────────────────────────────────
export const heroBanners = pgTable('hero_banners', {
    id: serial('id').primaryKey(),
    image_url: varchar('image_url', { length: 500 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    subtitle: varchar('subtitle', { length: 255 }),
    headtext: text('headtext'),
    text_color: varchar('text_color', { length: 50 }).default('#000000'),
    cta_button_color: varchar('cta_button_color', { length: 50 }).default('#000000'),
    cta_button_text_color: varchar('cta_button_text_color', { length: 50 }).default('#FFFFFF'),
    cta_button_text: varchar('cta_button_text', { length: 100 }),
    cta_button_url: varchar('cta_button_url', { length: 500 }).default('/products'),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Spotlights ───────────────────────────────────────────────────────────────
export const spotlights = pgTable('spotlights', {
    id: serial('id').primaryKey(),
    image_url: varchar('image_url', { length: 500 }).notNull(),
    quote: text('quote').notNull(),
    person_name: varchar('person_name', { length: 255 }).notNull(),
    bg_color: varchar('bg_color', { length: 50 }).notNull().default('#3B0E0E'),
    is_active: boolean('is_active').notNull().default(true),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Popular Sections (People's Choice) ──────────────────────────────────────
export const popularSections = pgTable('popular_sections', {
    id: serial('id').primaryKey(),
    category: varchar('category', { length: 100 }).notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    cta_text: varchar('cta_text', { length: 100 }).notNull().default('Shop All Products'),
    cta_url: varchar('cta_url', { length: 500 }).notNull().default('/products'),
    product_1_slug: varchar('product_1_slug', { length: 255 }),
    product_2_slug: varchar('product_2_slug', { length: 255 }),
    is_active: boolean('is_active').notNull().default(true),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Showcase Tea Tags ────────────────────────────────────────────────────────
export const showcaseTeaTags = pgTable('showcase_tea_tags', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Showcase Tea Products ────────────────────────────────────────────────────
export const showcaseTeaProducts = pgTable('showcase_tea_products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    image_url: varchar('image_url', { length: 500 }).notNull(),
    tag_id: integer('tag_id').notNull(),
    product_id: integer('product_id').notNull(),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type HeroBanner = typeof heroBanners.$inferSelect;
export type NewHeroBanner = typeof heroBanners.$inferInsert;
export type Spotlight = typeof spotlights.$inferSelect;
export type NewSpotlight = typeof spotlights.$inferInsert;
export type PopularSection = typeof popularSections.$inferSelect;
export type NewPopularSection = typeof popularSections.$inferInsert;
export type ShowcaseTeaTag = typeof showcaseTeaTags.$inferSelect;
export type NewShowcaseTeaTag = typeof showcaseTeaTags.$inferInsert;
export type ShowcaseTeaProduct = typeof showcaseTeaProducts.$inferSelect;
export type NewShowcaseTeaProduct = typeof showcaseTeaProducts.$inferInsert;
