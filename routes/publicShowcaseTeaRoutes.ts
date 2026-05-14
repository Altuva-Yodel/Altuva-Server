import { Router } from 'express';
import { getPublicShowcaseTea } from '../controllers/showcaseTeaController';

const router = Router();

router.get('/', getPublicShowcaseTea);

export { router as publicShowcaseTeaRoutes };
