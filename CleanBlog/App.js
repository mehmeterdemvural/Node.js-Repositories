import express from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import methodOverride from 'method-override';

import {
  addPost,
  getAllPosts,
  getPost,
  editPost,
  deletePost,
} from './controllers/postControllers.js';
import {
  getAboutPage,
  getAddPostPage,
  getEditPage,
  getNotFoundPage,
} from './controllers/pageController.js';

const dbURL = process.env.DB_URL || '127.0.0.1';
const port = process.env.PORT || 8010;

const app = express();
mongoose.set('strictQuery', false);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.get('/', getAllPosts);
app.get('/post/:id', getPost);
app.post('/post', addPost);
app.put('/post/:id', editPost);
app.delete('/post/:id', deletePost);
app.get('/about', getAboutPage);
app.get('/add_post', getAddPostPage);
app.get('/edit/post/:id', getEditPage);
app.get('*', getNotFoundPage);

mongoose
  .connect(`mongodb://${dbURL}:27017/cleanblog`)
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı !');
    app.listen(port, () => {
      console.log(`Sunucu port ${port} de çalışmaya başladı ! !`);
    });
  })
  .catch((err) => {
    console.log('Veritabanı bağlantısı başarısız !');
    console.log(err);
  });
