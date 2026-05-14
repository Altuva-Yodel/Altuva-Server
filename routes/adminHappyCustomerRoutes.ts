import { Router } from 'express';
import { getAllAvatars, createAvatar, deleteAvatar, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/happyCustomerController';
import { adminMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/upload';

const router = Router();
router.use(adminMiddleware);

router.get('/avatars', getAllAvatars);
router.post('/avatars', upload.single('image'), createAvatar);
router.delete('/avatars/:id', deleteAvatar);

router.get('/testimonials', getAllTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

export { router as adminHappyCustomerRoutes };
