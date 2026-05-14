import { Request, Response } from 'express';
import {
    getAllProductsService,
    getProductByIdService,
    getProductBySlugService,
    createProductService,
    updateProductService,
    deleteProductService,
    ProductFilters,
} from '../services/productService';
import { uploadToCloudinary } from '../utils/cloudinary';

// ─── Admin Controllers ────────────────────────────────────────────────────────

export const getAllProductsAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { products } = await getAllProductsService({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await getProductByIdService(parseInt(req.params.id as string));
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

const uploadProductFiles = async (files: Record<string, Express.Multer.File[]>) => {
    const result: { primary_image?: string; secondary_image?: string; images?: { url: string; altText: string }[] } = {};

    if (files.primary_image?.[0]) {
        const uploaded = await uploadToCloudinary(files.primary_image[0].buffer, 'products');
        result.primary_image = uploaded.secure_url;
    }

    if (files.secondary_image?.[0]) {
        const uploaded = await uploadToCloudinary(files.secondary_image[0].buffer, 'products');
        result.secondary_image = uploaded.secure_url;
    }

    if (files.product_images?.length) {
        const uploaded = await Promise.all(
            files.product_images.map(f => uploadToCloudinary(f.buffer, 'products'))
        );
        result.images = uploaded.map(u => ({ url: u.secure_url, altText: '' }));
    }

    return result;
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = (req.files as Record<string, Express.Multer.File[]>) || {};
        const uploaded = await uploadProductFiles(files);

        const primary_image = uploaded.primary_image || req.body.primary_image;
        if (!primary_image) {
            res.status(400).json({ success: false, message: 'Primary image is required' });
            return;
        }

        const requiredFields: { field: string; label: string }[] = [
            { field: 'name', label: 'Product Name' },
            { field: 'brand', label: 'Brand' },
            { field: 'category', label: 'Category' },
            { field: 'price', label: 'Price' },
            { field: 'description', label: 'Description' },
        ];
        const missing = requiredFields.filter(({ field }) => !req.body[field]?.toString().trim());
        if (missing.length) {
            res.status(400).json({ success: false, message: `Missing required fields: ${missing.map(f => f.label).join(', ')}` });
            return;
        }

        const toStr = (val: any): string | undefined => val?.toString().trim() || undefined;
        const toBool = (val: any): boolean => val === 'true' || val === true;
        const toInt = (val: any, fallback = 0): number => parseInt(val) || fallback;

        const existingImages = req.body.images ? JSON.parse(req.body.images) : [];

        const product = await createProductService({
            name: req.body.name,
            slug: req.body.slug,
            brand: req.body.brand,
            category: req.body.category,
            sub_category: toStr(req.body.sub_category),
            type: toStr(req.body.type),
            price: req.body.price,
            discounted_price: toStr(req.body.discounted_price),
            discount_percentage: toStr(req.body.discount_percentage) ?? '0',
            currency: toStr(req.body.currency) ?? 'INR',
            stock: toInt(req.body.stock),
            low_stock_threshold: toInt(req.body.low_stock_threshold, 5),
            is_in_stock: toBool(req.body.is_in_stock),
            sku: toStr(req.body.sku),
            primary_image,
            secondary_image: uploaded.secondary_image || toStr(req.body.secondary_image),
            images: uploaded.images?.length ? uploaded.images : existingImages,
            description: req.body.description,
            detailed_description: toStr(req.body.detailed_description),
            key_features: req.body.key_features ? JSON.parse(req.body.key_features) : [],
            ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
            nutrition_info: req.body.nutrition_info ? JSON.parse(req.body.nutrition_info) : {},
            shelf_life: toStr(req.body.shelf_life),
            storage_instructions: toStr(req.body.storage_instructions),
            care_instructions: toStr(req.body.care_instructions),
            country_of_origin: toStr(req.body.country_of_origin),
            manufacturer: req.body.manufacturer ? JSON.parse(req.body.manufacturer) : {},
            contact_email: toStr(req.body.contact_email),
            contact_phone: toStr(req.body.contact_phone),
            amazon_link: toStr(req.body.amazon_link),
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            flavors: req.body.flavors ? JSON.parse(req.body.flavors) : [],
            weight: toStr(req.body.weight),
            is_active: toBool(req.body.is_active),
            is_featured: toBool(req.body.is_featured),
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        const isDbError = error instanceof Error && (
            error.message.toLowerCase().includes('null value') ||
            error.message.toLowerCase().includes('violates') ||
            error.message.toLowerCase().includes('failed query') ||
            error.message.toLowerCase().includes('unique constraint')
        );
        if (isDbError) {
            res.status(400).json({ success: false, message: 'Failed to save product. Please check all required fields are filled in correctly.' });
        } else {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
        }
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const files = (req.files as Record<string, Express.Multer.File[]>) || {};
        const uploaded = await uploadProductFiles(files);

        const toStr = (val: any): string | undefined => val?.toString().trim() || undefined;
        const toBool = (val: any): boolean => val === 'true' || val === true;
        const toInt = (val: any, fallback = 0): number => parseInt(val) || fallback;

        const existingImages = req.body.images ? JSON.parse(req.body.images) : [];
        const mergedImages = uploaded.images?.length
            ? [...existingImages, ...uploaded.images]
            : existingImages;

        const updateData = {
            name: req.body.name,
            slug: req.body.slug,
            brand: req.body.brand,
            category: req.body.category,
            sub_category: toStr(req.body.sub_category),
            type: toStr(req.body.type),
            price: req.body.price,
            discounted_price: toStr(req.body.discounted_price),
            discount_percentage: toStr(req.body.discount_percentage) ?? '0',
            currency: toStr(req.body.currency) ?? 'INR',
            stock: toInt(req.body.stock),
            low_stock_threshold: toInt(req.body.low_stock_threshold, 5),
            is_in_stock: toBool(req.body.is_in_stock),
            sku: toStr(req.body.sku),
            ...(uploaded.primary_image && { primary_image: uploaded.primary_image }),
            secondary_image: uploaded.secondary_image || toStr(req.body.secondary_image),
            images: mergedImages,
            description: req.body.description,
            detailed_description: toStr(req.body.detailed_description),
            key_features: req.body.key_features ? JSON.parse(req.body.key_features) : [],
            ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
            nutrition_info: req.body.nutrition_info ? JSON.parse(req.body.nutrition_info) : {},
            shelf_life: toStr(req.body.shelf_life),
            storage_instructions: toStr(req.body.storage_instructions),
            care_instructions: toStr(req.body.care_instructions),
            country_of_origin: toStr(req.body.country_of_origin),
            manufacturer: req.body.manufacturer ? JSON.parse(req.body.manufacturer) : {},
            contact_email: toStr(req.body.contact_email),
            contact_phone: toStr(req.body.contact_phone),
            amazon_link: toStr(req.body.amazon_link),
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            flavors: req.body.flavors ? JSON.parse(req.body.flavors) : [],
            weight: toStr(req.body.weight),
            is_active: toBool(req.body.is_active),
            is_featured: toBool(req.body.is_featured),
        };

        const product = await updateProductService(id, updateData);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        const isDbError = error instanceof Error && (
            error.message.toLowerCase().includes('null value') ||
            error.message.toLowerCase().includes('violates') ||
            error.message.toLowerCase().includes('failed query') ||
            error.message.toLowerCase().includes('unique constraint')
        );
        if (isDbError) {
            res.status(400).json({ success: false, message: 'Failed to update product. Please check all required fields are filled in correctly.' });
        } else {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await deleteProductService(parseInt(req.params.id as string));
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// ─── Public Controllers ───────────────────────────────────────────────────────

export const getPublicProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            category, sub_category, brand, is_featured,
            search, min_price, max_price, tags, flavors,
            sort, limit, offset,
        } = req.query;

        const filters: ProductFilters = {
            is_active: true,
            category: category as string,
            sub_category: sub_category as string,
            brand: brand as string,
            is_featured: is_featured === 'true' ? true : undefined,
            search: search as string,
            min_price: min_price ? parseFloat(min_price as string) : undefined,
            max_price: max_price ? parseFloat(max_price as string) : undefined,
            tags: tags ? (tags as string).split(',') : undefined,
            flavors: flavors ? (flavors as string).split(',') : undefined,
            sort: (sort as ProductFilters['sort']) || 'newest',
            limit: limit ? parseInt(limit as string) : 24,
            offset: offset ? parseInt(offset as string) : 0,
        };

        const { products, total } = await getAllProductsService(filters);
        res.status(200).json({ success: true, data: products, total, limit: filters.limit, offset: filters.offset });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

export const getPublicProductBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await getProductBySlugService(req.params.slug as string);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};
