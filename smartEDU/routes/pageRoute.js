import express from 'express';
import {
  getAboutPage,
  getContactPage,
  getIndexPage,
  getLoginPage,
  getRegisterPage,
  sendEmail,
} from '../controllers/pageController.js';
import redirectMiddleware from '../middlewares/redirectMiddleware.js';

const router = express.Router();

router.route('/').get(getIndexPage);
router.route('/about').get(getAboutPage);
router.route('/register').get(redirectMiddleware, getRegisterPage);
router.route('/login').get(redirectMiddleware, getLoginPage);
router.route('/contact').get(getContactPage);
router.route('/contact').post(sendEmail);

export default router;
