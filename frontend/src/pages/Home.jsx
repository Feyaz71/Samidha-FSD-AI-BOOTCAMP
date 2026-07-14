import { Link } from 'react-router-dom';
import { UserPlus, LayoutDashboard } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Automatically logout if student navigates to the home page
    localStorage.removeItem('samidhaStudentSession');
    localStorage.removeItem('samidhaStudentId');
    localStorage.removeItem('samidhaStudentMobile');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-samidha-dark mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-samidha-purple to-samidha-blue">Samidha AI Bootcamp</span>
        </h1>
        <p className="text-xl text-gray-600">Your portal for attendance, assignments, and certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link to="/register" className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center text-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-samidha-purple" />
          </div>
          <h2 className="text-xl font-bold mb-2">Student Registration</h2>
          <p className="text-gray-500 text-sm">Register once to get your unique Student ID.</p>
        </Link>


        <Link to="/student" className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <LayoutDashboard className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Student Dashboard</h2>
          <p className="text-gray-500 text-sm">Check your progress and certificates.</p>
        </Link>
      </div>
    </div>
  );
}
