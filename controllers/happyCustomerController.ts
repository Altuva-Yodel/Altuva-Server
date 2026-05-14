import { Request, Response } from 'express';
import { db, schema } from '../db';
import { eq, asc } from 'drizzle-orm';
import { uploadToCloudinary } from '../utils/cloudinary';

const { happyCustomerAvatars, happyCustomerTestimonials } = schema;

// ─── Public ───────────────────────────────────────────────────────────────────

export const getPublicTestimonials = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await db
            .select({
                id: happyCustomerTestimonials.id,
                quote: happyCustomerTestimonials.quote,
                person_name: happyCustomerTestimonials.person_name,
                designation: happyCustomerTestimonials.designation,
                sort_order: happyCustomerTestimonials.sort_order,
                avatar_url: happyCustomerAvatars.image_url,
            })
            .from(happyCustomerTestimonials)
            .leftJoin(happyCustomerAvatars, eq(happyCustomerTestimonials.avatar_id, happyCustomerAvatars.id))
            .where(eq(happyCustomerTestimonials.is_active, true))
            .orderBy(asc(happyCustomerTestimonials.sort_order), asc(happyCustomerTestimonials.created_at));
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

// ─── Admin: Avatars ───────────────────────────────────────────────────────────

export const getAllAvatars = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await db.select().from(happyCustomerAvatars).orderBy(asc(happyCustomerAvatars.created_at));
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const createAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) { res.status(400).json({ success: false, message: 'image is required' }); return; }
        const uploaded = await uploadToCloudinary(req.file.buffer, 'happy-customer-avatars');
        const [row] = await db.insert(happyCustomerAvatars).values({ image_url: uploaded.secure_url }).returning();
        res.status(201).json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const deleteAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const [row] = await db.delete(happyCustomerAvatars).where(eq(happyCustomerAvatars.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

// ─── Admin: Testimonials ──────────────────────────────────────────────────────

export const getAllTestimonials = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await db
            .select({
                id: happyCustomerTestimonials.id,
                quote: happyCustomerTestimonials.quote,
                person_name: happyCustomerTestimonials.person_name,
                designation: happyCustomerTestimonials.designation,
                sort_order: happyCustomerTestimonials.sort_order,
                is_active: happyCustomerTestimonials.is_active,
                avatar_id: happyCustomerTestimonials.avatar_id,
                avatar_url: happyCustomerAvatars.image_url,
            })
            .from(happyCustomerTestimonials)
            .leftJoin(happyCustomerAvatars, eq(happyCustomerTestimonials.avatar_id, happyCustomerAvatars.id))
            .orderBy(asc(happyCustomerTestimonials.sort_order), asc(happyCustomerTestimonials.created_at));
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { avatar_id, quote, person_name, designation, sort_order, is_active } = req.body;
        if (!avatar_id || !quote || !person_name) {
            res.status(400).json({ success: false, message: 'avatar_id, quote and person_name are required' });
            return;
        }
        const [row] = await db.insert(happyCustomerTestimonials).values({
            avatar_id: parseInt(avatar_id),
            quote,
            person_name,
            designation: designation || null,
            sort_order: sort_order ? parseInt(sort_order) : 0,
            is_active: is_active !== undefined ? is_active === 'true' || is_active === true : true,
        }).returning();
        res.status(201).json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const updates: Record<string, any> = { updated_at: new Date() };
        if (req.body.avatar_id !== undefined) updates.avatar_id = parseInt(req.body.avatar_id);
        if (req.body.quote !== undefined) updates.quote = req.body.quote;
        if (req.body.person_name !== undefined) updates.person_name = req.body.person_name;
        if (req.body.designation !== undefined) updates.designation = req.body.designation || null;
        if (req.body.sort_order !== undefined) updates.sort_order = parseInt(req.body.sort_order);
        if (req.body.is_active !== undefined) updates.is_active = req.body.is_active === 'true' || req.body.is_active === true;
        const [row] = await db.update(happyCustomerTestimonials).set(updates).where(eq(happyCustomerTestimonials.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: row });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(String(req.params.id));
        const [row] = await db.delete(happyCustomerTestimonials).where(eq(happyCustomerTestimonials.id, id)).returning();
        if (!row) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ success: false, message: e instanceof Error ? e.message : 'Server error' });
    }
};
