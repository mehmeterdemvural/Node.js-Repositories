import mongoose from 'mongoose';

const Schema = mongoose.Schema;

mongoose.set('strictQuery', false);

const PostSchema = new Schema({
  title: String,
  detail: String,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model('Post', PostSchema);

export { Post };
