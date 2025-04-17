# BiblioBuzz Frontend

The frontend application for BiblioBuzz, built with React, Redux Toolkit, and Tailwind CSS.

## 🌐 Live Demo

Visit the live application at [https://bibliobuzz.vercel.app](https://bibliobuzz.vercel.app)

## 🚀 Deployment Status

- Platform: Vercel
- Status: ✅ Live
- Auto-deployment: Enabled from main branch
- Build Settings:
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
  - Node.js Version: 18.x

## 🛠 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 📚 Features

### Public Features
- View featured books on homepage
- Browse all books with pagination
- Search books by title or author
- Filter books by genre
- Sort books by title, author, rating, or publication year
- View book details and reviews
- User registration and login

### Authenticated User Features
- Write reviews for books
- Edit and delete own reviews
- Like/unlike other users' reviews
- View personal review history
- Update profile information
- Change password
- View review statistics

### Admin Features
- Add new books
- Edit existing books
- Delete books
- Mark books as featured/unfeatured
- View all user reviews
- Manage book catalog

## 🚀 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── admin/         # Admin-specific components
│   ├── review/        # Review-related components
│   ├── ui/           # UI components (buttons, cards, etc.)
│   └── user/         # User-related components
├── features/          # Redux features
│   ├── api/          # API slices using RTK Query
│   └── auth/         # Authentication slice
├── lib/              # Utility functions
├── pages/            # Page components
└── store/            # Redux store configuration
```

## 🔌 API Integration

### Authentication Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- PUT /api/auth/profile

### Book Endpoints
- GET /api/books
- GET /api/books/:id
- GET /api/books/featured
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

### Review Endpoints
- GET /api/reviews
- GET /api/reviews/user
- POST /api/reviews
- PUT /api/reviews/:id
- DELETE /api/reviews/:id
- PUT /api/reviews/:id/like
- PUT /api/reviews/:id/unlike

## 🎨 UI Components

Using Shadcn UI components with Tailwind CSS:
- Button
- Card
- Input
- Select
- Custom components for reviews and books

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 🔒 Authentication

- JWT stored in HTTP-only cookies
- Protected routes using ProtectedRoute component
- Admin routes using AdminRoute component
- Automatic token refresh
- Secure logout

## 🚀 Deployment (Vercel)

1. Connect repository to Vercel
2. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-url.render.com
   ```
3. Deploy!

## 🔧 Environment Variables

| Variable | Description | Default | Production Value |
|----------|-------------|---------|------------------|
| VITE_API_URL | Backend API URL | http://localhost:5000 | https://bibliobuzz-api.onrender.com |
| VITE_ENV | Environment indicator | development | production |

## 📝 Development Notes

- Uses RTK Query for API calls and caching
- Implements optimistic updates for likes
- Form validation using built-in HTML5 validation
- Error boundaries for component error handling
- Lazy loading for better performance
- Debounced search implementation

## 🐛 Common Issues

1. CORS errors:
   - Ensure VITE_API_URL is correct
   - Check CORS configuration in backend

2. Authentication issues:
   - Clear cookies and local storage
   - Check if backend is accessible
   - Verify credentials

3. Build issues:
   - Run `npm clean-install`
   - Delete node_modules and reinstall
   - Check for Node.js version compatibility
