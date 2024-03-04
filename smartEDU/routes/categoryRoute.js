import express from 'express';
import { createCategory,updateCategory, deleteCategory } from '../controllers/categoryController.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/').post(roleMiddleware(['admin']), createCategory);
router.route('/:id').put(roleMiddleware(['admin']), updateCategory);
router.route('/:id').delete(roleMiddleware(['admin']), deleteCategory);

export default router;
