import mongoose from 'mongoose';

/**
 * Book model schema - defines structure for book data storage
 */
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  genre: {
    type: [String],
    required: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create text indexes for searching
BookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model('Book', BookSchema);
export default Book;