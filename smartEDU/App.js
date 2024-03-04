import express from 'express';
import ejs, { render } from 'ejs';
import mongoose from 'mongoose';
import fileupload from 'express-fileupload';
import methodOverride from 'method-override';
import fs from 'fs';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';

import pageRoute from './routes/pageRoute.js';
import courseRoute from './routes/courseRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import userRoute from './routes/userRoute.js';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Course } from './models/Course.js';

const app = express();

const dbURL = process.env.DB_URL || '127.0.0.1';
const port = process.env.PORT || 8000;

//Template State
app.set('view engine', 'ejs');

//Global Variable
global.userIn = null;

//Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//Connect DB
const databaseConnection = async () => {
  try {
    await mongoose.connect(`mongodb://${dbURL}:27017/smartedu`);

    const admin = await User.findOne({ _id: '65d8c42863c037edc8aab837' });
    if (!admin) {
      await User.create({
        _id: '65d8c42863c037edc8aab837',
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin',
        role: 'admin',
      });
    }

    const teacher = await User.findOne({ _id: '65d8c53399da90166f770145' });
    if (!teacher) {
      await User.create({
        _id: '65d8c53399da90166f770145',
        name: 'Teacher User',
        email: 'teacher@gmail.com',
        password: 'teacher',
        role: 'teacher',
      });
    }

    const student = await User.findOne({ _id: '65d8c53399da90166f770148' });
    if (!student) {
      await User.create({
        _id: '65d8c53399da90166f770148',
        name: 'Student User',
        email: 'student@gmail.com',
        password: 'student',
        role: 'student',
      });
    }

    const frontEndCategory = await Category.findOne({
      _id: '65d8c73582e2befc1f9e4e0e',
    });
    if (!frontEndCategory) {
      await Category.create({
        _id: '65d8c73582e2befc1f9e4e0e',
        name: 'Front-End',
        createdBy: '65d8c42863c037edc8aab837',
        courses: ['65d8c8f45dd8e12e3ceffc82', '65d8ca9d5ea9c3e296f668ab'],
      });
    }

    const backEndCategory = await Category.findOne({
      _id: '65d8c73582e2befc1f9e4e11',
    });
    if (!backEndCategory) {
      await Category.create({
        _id: '65d8c73582e2befc1f9e4e11',
        name: 'Back-End',
        createdBy: '65d8c42863c037edc8aab837',
        courses: ['65d8cd47e77a6b933cdc4117', '65d8cdcc7565dedad25a5b44'],
      });
    }

    const fullStackCategory = await Category.findOne({
      _id: '65d8c75b55dc2bb45c68dcdc',
    });
    if (!fullStackCategory) {
      await Category.create({
        _id: '65d8c75b55dc2bb45c68dcdc',
        name: 'Full-Stack',
        createdBy: '65d8c42863c037edc8aab837',
        courses: ['65d8cdcc7565dedad25a5b47'],
      });
    }

    const html = await Course.findOne({ _id: '65d8c8f45dd8e12e3ceffc82' });
    if (!html) {
      await Course.create({
        _id: '65d8c8f45dd8e12e3ceffc82',
        name: 'HTML',
        category: '65d8c73582e2befc1f9e4e0e',
        createdBy: '65d8c42863c037edc8aab837',
        image: '/uploads/html.jpg',
        description:
          'HTML is the standard markup language for documents designed to be displayed in a web browser.',
        teachers: ['65d8c53399da90166f770145'],
      });
      const teacher = await User.findOne({ _id: '65d8c53399da90166f770145' });
      if (!teacher.courses.teach.includes('65d8c8f45dd8e12e3ceffc82')) {
        teacher.courses.teach.push('65d8c8f45dd8e12e3ceffc82');
        await teacher.save();
      }
    }
    const css = await Course.findOne({ _id: '65d8ca9d5ea9c3e296f668ab' });
    if (!css) {
      await Course.create({
        _id: '65d8ca9d5ea9c3e296f668ab',
        name: 'CSS',
        category: '65d8c73582e2befc1f9e4e0e',
        createdBy: '65d8c42863c037edc8aab837',
        image: '/uploads/css.webp',
        description:
          'Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML.',
        teachers: ['65d8c53399da90166f770145'],
      });
      const teacher = await User.findOne({ _id: '65d8c53399da90166f770145' });
      if (!teacher.courses.teach.includes('65d8ca9d5ea9c3e296f668ab')) {
        teacher.courses.teach.push('65d8ca9d5ea9c3e296f668ab');
        await teacher.save();
      }
    }

    const nodejs = await Course.findOne({ _id: '65d8cd47e77a6b933cdc4117' });
    if (!nodejs) {
      await Course.create({
        _id: '65d8cd47e77a6b933cdc4117',
        name: 'Node.js',
        category: '65d8c73582e2befc1f9e4e11',
        createdBy: '65d8c42863c037edc8aab837',
        image: '/uploads/nodejs.png',
        description:
          'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
        teachers: ['65d8c53399da90166f770145'],
      });
      const teacher = await User.findOne({ _id: '65d8c53399da90166f770145' });
      if (!teacher.courses.teach.includes('65d8cd47e77a6b933cdc4117')) {
        teacher.courses.teach.push('65d8cd47e77a6b933cdc4117');
        await teacher.save();
      }
    }

    const python = await Course.findOne({ _id: '65d8cdcc7565dedad25a5b44' });
    if (!python) {
      await Course.create({
        _id: '65d8cdcc7565dedad25a5b44',
        name: 'Python',
        category: '65d8c73582e2befc1f9e4e11',
        createdBy: '65d8c42863c037edc8aab837',
        image: '/uploads/python.png',
        description:
          'Python is an interpreted high-level general-purpose programming language.',
        teachers: ['65d8c53399da90166f770145'],
      });
      const teacher = await User.findOne({ _id: '65d8c53399da90166f770145' });
      if (!teacher.courses.teach.includes('65d8cdcc7565dedad25a5b44')) {
        teacher.courses.teach.push('65d8cdcc7565dedad25a5b44');
        await teacher.save();
      }
    }

    const php = await Course.findOne({ _id: '65d8cdcc7565dedad25a5b47' });
    if (!php) {
      await Course.create({
        _id: '65d8cdcc7565dedad25a5b47',
        name: 'PHP',
        category: '65d8c75b55dc2bb45c68dcdc',
        createdBy: '65d8c42863c037edc8aab837',
        image: '/uploads/php.png',
        description:
          'PHP is a popular general-purpose scripting language that is especially suited to web development.',
        teachers: ['65d8c53399da90166f770145'],
      });
      const teacher = await User.findOne({ _id: '65d8c53399da90166f770145' });
      if (!teacher.courses.teach.includes('65d8cdcc7565dedad25a5b47')) {
        teacher.courses.teach.push('65d8cdcc7565dedad25a5b47');
        await teacher.save();
      }
    }
  } catch (error) {
    console.log('Database Connection Error:', error.message);
  }
};

databaseConnection();

app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb://${dbURL}:27017/smartedu`,
    }),
  })
);

app.use('*', (req, res, next) => {
  userIn = req.session.userID;
  next();
});
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);
// app.use('*', (req, res) => {
//   res.redirect('/');
// });

app.listen(port, () => {
  console.log(`Sunucu port ${port} de çalışmaya başladı ! !`);
});
