import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Home from './pages/Home';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Assignment from './pages/Assignment';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-samidha-light">
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Samidha Logo" className="h-10 w-auto rounded-full shadow-sm border border-gray-100" />
              <h1 className="text-2xl font-bold text-samidha-purple hidden sm:block">
                <span className="text-samidha-blue">Samidha</span> Bootcamp
              </h1>
            </Link>
            
            <Link to="/teacher" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="Admin Panel">
              <Lock className="w-5 h-5" />
            </Link>
          </div>
        </nav>
        <main className="p-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
