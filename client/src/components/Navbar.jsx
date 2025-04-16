import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">BookReviews</Link>
        
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
          <li><Link to="/books" className="hover:text-blue-300">Books</Link></li>
          <li><Link to="/profile" className="hover:text-blue-300">Profile</Link></li>
        </ul>
        
        <div className="flex space-x-4">
          <Button variant="secondary" className="bg-blue-600 hover:bg-blue-800 text-white">Login</Button>
          <Button variant="secondary" className="bg-green-600 hover:bg-green-800 text-white">Register</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;