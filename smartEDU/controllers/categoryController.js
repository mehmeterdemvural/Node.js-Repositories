import slugify from 'slugify';
import { Category } from '../models/Category.js';
import { Course } from '../models/Course.js';

const createCategory = async (req, res) => {
  try {
    const category = await {
      ...req.body,
      createdBy: req.session.userID,
    };
    await Category.create(category);
    req.flash('success', `'${req.body.name}' has been created succesfully !`);
    res.status(201).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Category added was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

const updateCategory = async (req, res) => {
  try {
    await Category.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        slug: slugify(req.body.name, {
          lower: true,
          strict: true,
        }),
        createdBy: req.session.userID,
      }
    );
    req.flash('success', `'${req.body.name}' has been updated succesfully !`);
    res.status(201).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `'${req.body.name}' delete was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Course.updateMany(
      { category: req.params.id },
      {
        $pull: { category: req.params.id },
      }
    );
    await Category.findOneAndRemove({ _id: req.params.id });

    req.flash('success', `Category has been removed succesfully !`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    req.flash('error', `Category delete was failed ! !`);
    res.status(400).redirect('/users/dashboard');
  }
};

export { createCategory, updateCategory, deleteCategory };
