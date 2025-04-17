# BiblioBuzz - Book Review Platform

BiblioBuzz is a full-stack web application for book lovers to discover, review, and discuss books. Built with React, Node.js, Express, and MongoDB, it offers a rich feature set for both regular users and administrators.

## 🌐 Live Demo

- Frontend: [https://bibliobuzz.vercel.app](https://bibliobuzz.vercel.app)
- Backend API: [https://bibliobuzz-api.onrender.com](https://bibliobuzz-api.onrender.com)

> Note: The backend is hosted on Render's free tier, which means the server may take 30-60 seconds to wake up on the first request after a period of inactivity.

## 🌟 Features

### User Features
- Browse and search books
- View book details and reviews
- Write, edit, and delete reviews
- Like/unlike reviews
- User authentication and profile management
- View personal review history
- Filter books by genre
- Sort books by different criteria
- Responsive design for all devices

### Admin Features
- Manage books (add, edit, delete)
- Mark books as featured
- Access to all reviews
- Monitor user activity
- Full CRUD operations on books

## 🚀 Deployment Status

### Frontend (Vercel)
- Status: ✅ Deployed
- Platform: Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables Required:
  - `VITE_API_URL`: Backend API URL
  - `VITE_ENV`: Production environment indicator

### Backend (Render)
- Status: ✅ Deployed
- Platform: Render
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables Required:
  - `PORT`: Server port (default: 5000)
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT tokens
  - `NODE_ENV`: Set to 'production'
  - `CLIENT_URL`: Frontend URL for CORS

## 📝 Test Accounts

### Regular User
- Email: test@gmail.com
- Password: Test@1234

### Admin User
- Email: admin@admin.com
- Password: Admin@1234

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bibliobuzz.git
   cd bibliobuzz
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create .env file in server directory
   - Create .env file in client directory
   (See respective README files for required variables)

4. Start the development servers:
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm run dev
   ```

## 📂 Project Structure

```
bibliobuzz/
├── client/          # React frontend
└── server/          # Node.js backend
```

See individual README files in each directory for detailed documentation:
- [Client README](./client/README.md)
- [Server README](./server/README.md)

## 💻 Tech Stack

### Frontend
- React
- Redux Toolkit & RTK Query
- React Router
- Tailwind CSS
- Shadcn UI Components

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- bcrypt

## 🔒 Security Features

- HTTP-only cookies for authentication
- Password hashing with bcrypt
- Protected API routes
- CORS protection
- Input validation and sanitization

## 🌐 Deployment

### Frontend
- Configured for Vercel deployment
- Environment variables needed for production
- Automatic build optimization

### Backend
- Ready for Render deployment
- Environment configuration
- Production security measures

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details