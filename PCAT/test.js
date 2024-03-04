import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log('Başarılı');
});

const PhotoSchema = new Schema({
  title: String,
  description: String,
});
const Photo = mongoose.model('Photo', PhotoSchema);

// Photo.create({
//   title: 'Photo Title 1',
//   description: 'Lorem Ipsum 1',
// });

// Photo.find({}, (err, photo) => {
//   console.log(photo);
// });

// Photo.findByIdAndUpdate(
//   '63e16258b9f0f74d4acca86a',
//   {
//     title: 'Photo Title 1 Updated',
//     description: 'Lorem Ipsum 1 Updated',
//   },
//   { new: true },
//   (err, data) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(data);
//   }
// );

Photo.findByIdAndDelete('63e16258b9f0f74d4acca86a', (err, data) => {
  if (err) {
    console.log(err);
  }
  console.log("Photo is delete");
});
