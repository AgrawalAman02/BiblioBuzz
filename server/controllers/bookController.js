import Book from '../models/Book.js';

/**
 * Get all books with optional filtering
 * @route GET /api/books
 * @access Public
 */
export const getBooks = async (req, res, next) => {
  try {
    const { 
      featured, 
      genre, 
      search, 
      sort = 'title',
      page = 1, 
      limit = 12
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add filters if provided
    if (featured) filter.featured = featured === 'true';
    if (genre) filter.genre = { $in: [genre] };
    
    // Add text search if provided
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    // Build sort object
    let sortCriteria = {};
    switch (sort) {
      case 'title':
        sortCriteria = { title: 1 };
        break;
      case 'author':
        sortCriteria = { author: 1 };
        break;
      case 'rating':
        sortCriteria = { averageRating: -1 };
        break;
      case 'newest':
        sortCriteria = { publicationYear: -1 };
        break;
      default:
        sortCriteria = { title: 1 };
    }

    // Execute query with pagination
    const books = await Book.find(filter)
      .sort(sortCriteria)
      .limit(limitNum)
      .skip(skip);
    
    // Get total count for pagination
    const count = await Book.countDocuments(filter);

    res.status(200).json({
      books,
      pagination: {
        total: count,
        pages: Math.ceil(count / limitNum),
        page: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific book by ID
 * @route GET /api/books/:id
 * @access Public
 */
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      res.status(404);
      return next(new Error('Book not found'));
    }
    
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new book
 * @route POST /api/books
 * @access Private/Admin
 */
export const createBook = async (req, res, next) => {
  try {
    const { 
      title, 
      author, 
      description,
      coverImage,
      genre,
      publicationYear,
      publisher,
      isbn,
      featured
    } = req.body;

    // Validation
    if (!title || !author || !description || !genre || !publicationYear || !publisher || !isbn) {
      res.status(400);
      return next(new Error('Please provide all required fields'));
    }
    
    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      res.status(400);
      return next(new Error('Book with this ISBN already exists'));
    }
    
    // Create new book
    const book = await Book.create({
      title,
      author,
      description,
      coverImage: coverImage || 'default-book-cover.jpg',
      genre: Array.isArray(genre) ? genre : [genre],
      publicationYear,
      publisher,
      isbn,
      featured: featured || false
    });
    
    if (book) {
      res.status(201).json(book);
    } else {
      res.status(400);
      return next(new Error('Invalid book data'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update a book
 * @route PUT /api/books/:id
 * @access Private/Admin
 */
export const updateBook = async (req, res, next) => {
  try {
    const { 
      title, 
      author, 
      description,
      coverImage,
      genre,
      publicationYear,
      publisher,
      isbn,
      featured
    } = req.body;
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      res.status(404);
      return next(new Error('Book not found'));
    }
    
    // Update fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.coverImage = coverImage || book.coverImage;
    book.genre = Array.isArray(genre) ? genre : (genre ? [genre] : book.genre);
    book.publicationYear = publicationYear || book.publicationYear;
    book.publisher = publisher || book.publisher;
    book.isbn = isbn || book.isbn;
    book.featured = featured !== undefined ? featured : book.featured;
    
    const updatedBook = await book.save();
    
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a book
 * @route DELETE /api/books/:id
 * @access Private/Admin
 */
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      res.status(404);
      return next(new Error('Book not found'));
    }
    
    await book.deleteOne();
    res.status(200).json({ message: 'Book removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured books
 * @route GET /api/books/featured
 * @access Public
 */
export const getFeaturedBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ featured: true })
      .sort({ averageRating: -1 })
      .limit(6);
      
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};