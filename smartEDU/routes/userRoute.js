import express from 'express';
import { body } from 'express-validator';

import { User } from '../models/User.js';
import {
  createUser,
  deleteStudent,
  deleteTeacher,
  getDashboardPage,
  loginUser,
  logoutUser,
  updateStudent,
  updateTeacher,
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

//Route

const router = express.Router();

router.route('/signup').post(
  [
    body('name').not().isEmpty().withMessage('Please Enter Your Name ! '),
    body('email')
      .isEmail()
      .withMessage('Please Enter Valid Email ! ')
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject('Email is already exists');
          }
        });
      }),
    body('password').not().isEmpty().withMessage('Please Enter A Password ! '),
  ],
  createUser
);
router.route('/login').post(loginUser);
router.route('/student/:id').put(roleMiddleware(['admin']), updateStudent);
router.route('/student/:id').delete(roleMiddleware(['admin']), deleteStudent);
router.route('/teacher/:id').put(roleMiddleware(['admin']), updateTeacher);
router.route('/teacher/:id').delete(roleMiddleware(['admin']), deleteTeacher);
router.route('/logout').get(logoutUser);
router.route('/dashboard').get(authMiddleware, getDashboardPage);

export default router;
