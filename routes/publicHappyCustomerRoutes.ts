import { Router } from 'express';
import { getPublicTestimonials } from '../controllers/happyCustomerController';

const router = Router();
router.get('/', getPublicTestimonials);

export { router as publicHappyCustomerRoutes };
