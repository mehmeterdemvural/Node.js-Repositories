import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Course } from '../models/Course.js';

const createUser = async (req, res) => {
  const errors = validationResult(req);
  const newUser = req.body;
  try {
    if (!errors.array().length > 0) {
      if (newUser.role === 'student') {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          courses: { learn: req.body.courses },
        });
        const user = await User.findOne({ name: newUser.name });
        await Course.updateMany(
          { _id: newUser.courses },
          {
            $push: { students: user._id },
          }
        );
      } else if (newUser.role === 'teacher') {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          courses: { teach: req.body.courses },
        });
        const user = await User.findOne({ name: newUser.name });
        await Course.updateMany(
          { _id: newUser.courses },
          {
            $push: { teachers: user._id },
          }
        );
      } else {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
        });
      }

      req.flash('success', `"${req.body.name}" has been created succesfully !`);
      res.status(201).redirect('/users/dashboard');
    } else {
      reject();
    }
  } catch (error) {
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};

const updateStudent = async (req, res) => {
  try {
    const updateUser = await User.findOne({ _id: req.params.id });
    await Course.updateMany(
      { students: req.params.id },
      {
        $pull: { students: req.params.id },
      }
    );
    if (req.body.role === 'student') {
      updateUser.name = await req.body.name;
      updateUser.email = await req.body.email;
      updateUser.courses.learn = await req.body.courses;
      updateUser.save();

      await Course.updateMany(
        { _id: req.body.courses },
        {
          $push: { students: req.params.id },
        }
      );
    } else if (req.body.role === 'teacher') {
      updateUser.name = await req.body.name;
      updateUser.email = await req.body.email;
      updateUser.courses.teach = await req.body.courses;
      updateUser.courses.learn = [];
      updateUser.role = await req.body.role;
      await updateUser.save();

      await Course.updateMany(
        { _id: req.body.courses },
        {
          $push: { teachers: req.params.id },
        }
      );
    }
    req.flash('success', `'${req.body.name}' has been updated succesfully !`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Student update was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

const deleteStudent = async (req, res) => {
  try {
    await User.findOneAndRemove({ _id: req.params.id });
    await Course.updateMany(
      { students: req.params.id },
      {
        $pull: { students: req.params.id },
      }
    );
    req.flash('success', `Student has been removed succesfully !`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Student delete was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

const updateTeacher = async (req, res) => {
  try {
    const updateUser = await User.findOne({ _id: req.params.id });
    await Course.updateMany(
      { teachers: updateUser._id },
      {
        $pull: { teachers: updateUser._id },
      }
    );
    if (req.body.role === 'teacher') {
      updateUser.name = await req.body.name;
      updateUser.email = await req.body.email;
      updateUser.courses.teach = await req.body.courses;
      updateUser.save();
      await Course.updateMany(
        { _id: req.body.courses },
        {
          $push: { teachers: updateUser._id },
        }
      );
    } else if (req.body.role === 'student') {
      updateUser.name = await req.body.name;
      updateUser.email = await req.body.email;
      updateUser.courses.learn = await req.body.courses;
      updateUser.courses.teach = [];
      updateUser.role = await req.body.role;
      await updateUser.save();
      await Course.updateMany(
        { _id: req.body.courses },
        {
          $push: { students: updateUser._id },
        }
      );
    }
    req.flash('success', `'${req.body.name}' has been updated succesfully !`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Student update was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

const deleteTeacher = async (req, res) => {
  try {
    await Course.updateMany(
      { teachers: req.params.id },
      {
        $pull: { teachers: req.params.id },
      }
    );
    await User.findOneAndRemove({ _id: req.params.id });

    req.flash('success', `Teacher has been removed succesfully !`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Teacher delete was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = await req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          req.session.userID = user._id;
          res.status(201).redirect('/users/dashboard');
        } else if (password) {
          req.flash('error', `Your password is not correct !`);
          res.status(400).redirect('/login');
        } else {
          req.flash('error', `Please enter a password !`);
          res.status(400).redirect('/login');
        }
      });
    } else if (email) {
      req.flash('error', `Email is not found !`);
      res.status(400).redirect('/login');
    } else {
      req.flash('error', `Please enter a email !`);
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).redirect('/');
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.status(200).redirect('/');
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

const getDashboardPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID).populate({
      path: 'courses',
      populate: { path: 'learn' },
    });
    const allCategories = await Category.find()
      .sort('name')
      .populate(['courses', 'createdBy']);
    const courses = await Course.find({ createdBy: user }).sort({
      createdAt: -1,
    });
    const allCourses = await Course.find({})
      .sort({ name: 1 })
      .populate(['createdBy', 'category', 'students', 'teachers']);
    const students = await User.find({ role: 'student' })
      .sort('name')
      .populate({ path: 'courses', populate: { path: 'learn' } });

    const teachers = await User.find({ role: 'teacher' })
      .sort('name')
      .populate({ path: 'courses', populate: { path: 'teach' } });

    res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user,
      allCategories,
      courses,
      students,
      teachers,
      allCourses,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
export {
  createUser,
  loginUser,
  logoutUser,
  getDashboardPage,
  updateStudent,
  deleteStudent,
  updateTeacher,
  deleteTeacher,
};
