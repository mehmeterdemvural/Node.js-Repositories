import express from 'express';
import {
  createCourse,
  deleteCourse,
  enrollCourse,
  getAllCourses,
  getCourse,
  releaseCourse,
  updateCourse,
} from '../controllers/courseController.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.route('/').get(getAllCourses);
router.route('/').post(roleMiddleware(['teacher', 'admin']), createCourse);
router.route('/course/:slug').get(getCourse);
router.route('/course/:slug').delete(deleteCourse);
router.route('/course/:id').put(updateCourse);

router.route('/enroll').post(enrollCourse);
router.route('/release').post(releaseCourse);

export default router;
