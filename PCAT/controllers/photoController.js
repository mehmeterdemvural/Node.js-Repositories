import { Photo } from '../models/Photo.js';
import fs from 'fs';

const getAllPhotos = async (req, res) => {
  const photosPerPage = 3;
  const photo = (await req.query.page) || 1;
  const photos = await Photo.find({})
    .sort({ dateCreated: -1 })
    .skip((photo - 1) * photosPerPage)
    .limit(photosPerPage);
  const totalPhotos = await Photo.find().count();
  const totalPage = Math.ceil(totalPhotos / photosPerPage);
  console.log(totalPage);
  res.render('index', {
    photos,
    totalPhotos,
    photo,
    totalPage,
  });
};

const getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

const addPhoto = async (req, res) => {
  let uploadedImage = req.files.image;
  let uploadPath = './public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

const updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photo/${req.params.id}`);
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    let deleteImageUrl = './public' + photo.image;
    fs.unlinkSync(deleteImageUrl);

    await Photo.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

export { getAllPhotos, getPhoto, addPhoto, updatePhoto, deletePhoto };
