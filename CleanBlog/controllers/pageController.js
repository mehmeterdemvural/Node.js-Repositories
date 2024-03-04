import { Post } from '../models/Post.js';

const getAboutPage = (req, res) => {
  res.render('about');
};

const getAddPostPage = (req, res) => {
  res.render('add_post');
};

const getEditPage = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('edit', {
    post,
  });
};

const getNotFoundPage = (req, res) => {
  res.render('notfound');
};

export { getAboutPage, getAddPostPage, getEditPage, getNotFoundPage };
