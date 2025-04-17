# BiblioBuzz Backend

Node.js/Express backend for BiblioBuzz with MongoDB database.

## 🛠 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Logout User
```
POST /api/auth/logout
```

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer token
```

#### Update User Profile
```
PUT /api/auth/profile
Authorization: Bearer token
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string" (optional)
}
```

### Book Endpoints

#### Get All Books
```
GET /api/books
Query Parameters:
- page (default: 1)
- limit (default: 9)
- search (optional)
- genre (optional)
- sort (optional: title, author, rating, newest)
```

#### Get Featured Books
```
GET /api/books/featured
Query Parameters:
- page (default: 1)
- limit (default: 6)
```

#### Get Book by ID
```
GET /api/books/:id
```

#### Create Book (Admin only)
```
POST /api/books
Authorization: Bearer token
Content-Type: application/json

{
  "title": "string",
  "author": "string",
  "description": "string",
  "coverImage": "string",
  "genre": ["string"],
  "publicationYear": number,
  "publisher": "string",
  "isbn": "string",
  "featured": boolean
}
```

#### Update Book (Admin only)
```
PUT /api/books/:id
Authorization: Bearer token
Content-Type: application/json

{
  // Same fields as POST, all optional
}
```

#### Delete Book (Admin only)
```
DELETE /api/books/:id
Authorization: Bearer token
```

### Review Endpoints

#### Get Reviews
```
GET /api/reviews
Query Parameters:
- book (optional, book ID to filter by)
```

#### Get User Reviews
```
GET /api/reviews/user
Authorization: Bearer token
```

#### Create Review
```
POST /api/reviews
Authorization: Bearer token
Content-Type: application/json

{
  "book": "bookId",
  "rating": number (1-5),
  "title": "string",
  "content": "string"
}
```

#### Update Review
```
PUT /api/reviews/:id
Authorization: Bearer token
Content-Type: application/json

{
  "rating": number (1-5),
  "title": "string",
  "content": "string"
}
```

#### Delete Review
```
DELETE /api/reviews/:id
Authorization: Bearer token
```

#### Like Review
```
PUT /api/reviews/:id/like
Authorization: Bearer token
```

#### Unlike Review
```
PUT /api/reviews/:id/unlike
Authorization: Bearer token
```

## 🔐 Authentication

- Uses JWT tokens stored in HTTP-only cookies
- Tokens expire after 30 days
- Protected routes using auth middleware
- Admin-only routes using admin middleware

## 📁 Project Structure

```
server/
├── config/           # Database configuration
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
└── scripts/         # Utility scripts
```

## 🗄️ Database Models

### User Model
- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- isAdmin (Boolean, default: false)
- likedReviews (Array of Review IDs)
- timestamps

### Book Model
- title (String, required)
- author (String, required)
- description (String, required)
- coverImage (String)
- genre (Array of Strings, required)
- publicationYear (Number, required)
- publisher (String, required)
- isbn (String, required, unique)
- featured (Boolean, default: false)
- averageRating (Number, default: 0)
- reviewCount (Number, default: 0)
- timestamps

### Review Model
- user (Reference to User)
- book (Reference to Book)
- rating (Number, required, 1-5)
- title (String, required)
- content (String, required)
- likes (Number, default: 0)
- likedBy (Array of User IDs)
- timestamps

## 🚀 Deployment (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
4. Deploy!

## 📝 Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `node scripts/makeAdmin.js <email>`: Make a user an admin

## 🔧 Error Handling

- Global error handler middleware
- Custom error messages
- Proper status codes
- Stack traces in development

## 🔒 Security Features

- Password hashing with bcrypt
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation
- XSS protection
- Request validation

## 📊 Performance

- Database indexing
- Lean queries
- Proper error handling
- Connection pooling
- Query optimization