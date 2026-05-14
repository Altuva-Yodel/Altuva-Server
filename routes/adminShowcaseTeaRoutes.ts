import { Router } from 'express';
import { getAllTags, createTag, updateTag, deleteTag, getAllShowcaseProducts, createShowcaseProduct, updateShowcaseProduct, deleteShowcaseProduct } from '../controllers/showcaseTeaController';
import { adminMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/upload';

const router = Router();
router.use(adminMiddleware);

// Tags
router.get('/tags', getAllTags);
router.post('/tags', createTag);
router.put('/tags/:id', updateTag);
router.delete('/tags/:id', deleteTag);

// Products
router.get('/products', getAllShowcaseProducts);
router.post('/products', upload.single('image'), createShowcaseProduct);
router.put('/products/:id', upload.single('image'), updateShowcaseProduct);
router.delete('/products/:id', deleteShowcaseProduct);

export { router as adminShowcaseTeaRoutes };
