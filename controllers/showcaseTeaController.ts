import { Request, Response } from 'express';
import { db, schema } from '../db';
import { eq, asc } from 'drizzle-orm';
import { uploadToCloudinary } from '../utils/cloudinary';

const { showcaseTeaTags, showcaseTeaProducts, products: productsTable } = schema;

// ─── Public ───────────────────────────────────────────────────────────────────

export const getPublicShowcaseTea = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tags = await db.select().from(showcaseTeaTags).orderBy(asc(showcaseTeaTags.sort_order), asc(showcaseTeaTags.created_at));
        const rows = await db
            .select({
                id: showcaseTeaProducts.id,
                name: showcaseTeaProducts.name,
                image_url: showcaseTeaProducts.image_url,
                tag_id: showcaseTeaProducts.tag_id,
                product_id: showcaseTeaProducts.product_id,
                sort_order: showcaseTeaProducts.sort_order,
                slug: productsTable.slug,
            })
            .from(showcaseTeaProducts)
            .leftJoin(productsTable, eq(showcaseTeaProducts.product_id, productsTable.id))
            .orderBy(asc(showcaseTeaProducts.sort_order), asc(showcaseTeaProducts.created_at));
        res.json({ success: true, data: { tags, products: rows } });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

// ─── Admin: Tags ──────────────────────────────────────────────────────────────

export const getAllTags = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await db.select().from(showcaseTeaTags).orderBy(asc(showcaseTeaTags.sort_order), asc(showcaseTeaTags.created_at));
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const createTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, sort_order } = req.body;
        if (!name) { res.status(400).json({ success: false, message: 'name is required' }); return; }
        const [row] = await db.insert(showcaseTeaTags).values({
            name: name.trim(),
            sort_order: sort_order ? parseInt(sort_order) : 0,
        }).returning();
        res.status(201).json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const updateTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const updates: Record<string, any> = { updated_at: new Date() };
        if (req.body.name !== undefined) updates.name = req.body.name.trim();
        if (req.body.sort_order !== undefined) updates.sort_order = parseInt(req.body.sort_order);
        const [row] = await db.update(showcaseTeaTags).set(updates).where(eq(showcaseTeaTags.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const [row] = await db.delete(showcaseTeaTags).where(eq(showcaseTeaTags.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

// ─── Admin: Products ──────────────────────────────────────────────────────────

export const getAllShowcaseProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await db.select().from(showcaseTeaProducts).orderBy(asc(showcaseTeaProducts.sort_order), asc(showcaseTeaProducts.created_at));
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const createShowcaseProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, tag_id, product_id, sort_order } = req.body;
        if (!name || !tag_id || !product_id) {
            res.status(400).json({ success: false, message: 'name, tag_id and product_id are required' });
            return;
        }

        let image_url = req.body.image_url || '';
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer, 'showcase-tea');
            image_url = uploaded.secure_url;
        }
        if (!image_url) { res.status(400).json({ success: false, message: 'image is required' }); return; }

        const [row] = await db.insert(showcaseTeaProducts).values({
            name,
            image_url,
            tag_id: parseInt(tag_id),
            product_id: parseInt(product_id),
            sort_order: sort_order ? parseInt(sort_order) : 0,
        }).returning();
        res.status(201).json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const updateShowcaseProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const updates: Record<string, any> = { updated_at: new Date() };

        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer, 'showcase-tea');
            updates.image_url = uploaded.secure_url;
        }
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.tag_id !== undefined) updates.tag_id = parseInt(req.body.tag_id);
        if (req.body.product_id !== undefined) updates.product_id = parseInt(req.body.product_id);
        if (req.body.sort_order !== undefined) updates.sort_order = parseInt(req.body.sort_order);

        const [row] = await db.update(showcaseTeaProducts).set(updates).where(eq(showcaseTeaProducts.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const deleteShowcaseProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const [row] = await db.delete(showcaseTeaProducts).where(eq(showcaseTeaProducts.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};
