// 3. Parti Import
import express from 'express';
import mongoose from 'mongoose';
import fileupload from 'express-fileupload';
import methodOverride from 'method-override';
import ejs from 'ejs';
import fs from 'fs';

// Yerel Import
import {
  addPhoto,
  deletePhoto,
  getAllPhotos,
  getPhoto,
  updatePhoto,
} from './controllers/photoController.js';
import {
  getAboutPage,
  getAddPage,
  getEditPage,
} from './controllers/pageController.js';

const dbURL = process.env.DB_URL || '127.0.0.1';
const port = process.env.PORT || 8020;

// Midilware
const app = express();
mongoose.set('strictQuery', false);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routers
app.get('/', getAllPhotos);
app.get('/photo/:id', getPhoto);
app.post('/photos', addPhoto);
app.put('/photos/:id', updatePhoto);
app.delete('/photos/:id', deletePhoto);
app.get('/about', getAboutPage);
app.get('/add', getAddPage);
app.get('/photos/edit/:id', getEditPage);

mongoose
  .connect(`mongodb://${dbURL}:27017/pcat`)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı !');
    app.listen(port, () => {
      console.log(`Sunucu port ${port} de çalışmaya başladı ! !`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
