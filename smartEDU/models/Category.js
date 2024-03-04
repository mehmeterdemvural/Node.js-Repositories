import mongoose from 'mongoose';
import slugify from 'slugify';

const Schema = mongoose.Schema;

mongoose.set('strictQuery', false);

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  slug: {
    type: String,
    unique: true,
  },
});

CategorySchema.pre('validate', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

const Category = mongoose.model('Category', CategorySchema);

export { Category };
