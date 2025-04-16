import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

// Placeholder components - will be replaced with actual components later
const BookList = () => <div className="p-4 text-2xl">Book Listing Page</div>
const BookDetail = () => <div className="p-4 text-2xl">Book Detail Page</div>
const Profile = () => <div className="p-4 text-2xl">User Profile Page</div>
const ReviewForm = () => <div className="p-4 text-2xl">Review Submission Form</div>

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <header className="bg-white shadow-md p-4">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            Book Review Platform
          </h1>
        </header>
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/review/new" element={<ReviewForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
