import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, GraduationCap, ArrowRight, AlertCircle, Calendar, FileText, LogOut } from 'lucide-react';
import axios from 'axios';

export default function StudentDashboard() {
  const [loginData, setLoginData] = useState({ student_id: '', mobile_or_email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('samidhaStudentSession');
    if (savedSession) {
      const data = JSON.parse(savedSession);
      setLoginData(data);
      fetchProfile(data);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (data) => {
    try {
      const res = await axios.post('https://samidhagbpec.onrender.com/api/students/profile', data);
      setProfile(res.data);
      setIsLoggedIn(true);
      localStorage.setItem('samidhaStudentSession', JSON.stringify(data));
      localStorage.setItem('samidhaStudentId', data.student_id);
      localStorage.setItem('samidhaStudentMobile', data.mobile_or_email);
    } catch (err) {
      localStorage.removeItem('samidhaStudentSession');
      setError(err.response?.data?.error || 'Failed to fetch profile. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    fetchProfile(loginData);
  };

  const handleLogout = () => {
    localStorage.removeItem('samidhaStudentSession');
    localStorage.removeItem('samidhaStudentId');
    localStorage.removeItem('samidhaStudentMobile');
    setIsLoggedIn(false);
    setProfile(null);
    setLoginData({ student_id: '', mobile_or_email: '' });
  };

  if (loading && !profile) {
    return <div className="flex flex-col items-center justify-center py-12"><p className="text-gray-500 font-semibold">Loading session...</p></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <GraduationCap className="w-12 h-12 text-samidha-purple mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-samidha-dark mb-6">Student Login</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="text" placeholder="Student ID (SAM2026-001)" onChange={(e) => setLoginData({...loginData, student_id: e.target.value.toUpperCase()})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-samidha-purple uppercase" />
            <input required type="text" placeholder="Mobile Number or Email" onChange={(e) => setLoginData({...loginData, mobile_or_email: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-samidha-purple" />
            <button type="submit" disabled={loading} className="w-full bg-samidha-purple text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-50">
              {loading ? 'Verifying...' : 'View Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="bg-gradient-to-r from-samidha-purple to-samidha-blue rounded-3xl p-8 text-white shadow-xl mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Welcome, {profile.student.full_name}!</h2>
          <div className="flex items-center gap-4">
            <p className="text-purple-100">{profile.student.student_id}</p>
            <button onClick={handleLogout} className="text-xs bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
          <p className="text-sm text-purple-100 uppercase tracking-wider font-semibold">Eligibility</p>
          <p className="text-xl font-bold flex items-center gap-2">
            {profile.stats.attendancePercentage >= 75 && profile.stats.assignmentsSubmitted >= 3 
              ? <><CheckCircle className="w-5 h-5 text-green-300" /> Eligible for Certificate</>
              : <><AlertCircle className="w-5 h-5 text-yellow-300" /> Not Eligible Yet</>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/attendance" className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group">
          <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Mark Attendance</h3>
          <p className="text-purple-100 text-sm mt-2 text-center">Enter your daily code</p>
        </Link>

        <Link to="/assignment" className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group">
          <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Submit Assignment</h3>
          <p className="text-blue-100 text-sm mt-2 text-center">Upload your daily tasks</p>
        </Link>

        <Link to="/test-assignment" className="bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group">
          <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Submit Test</h3>
          <p className="text-rose-100 text-sm mt-2 text-center">Live tests with OTP Queue</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <CheckCircle className="w-10 h-10 text-samidha-blue" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Attendance</p>
            <h3 className="text-4xl font-bold text-samidha-dark">{profile.stats.attendancePercentage}%</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-6">
          <div className="bg-purple-50 p-4 rounded-full">
            <BookOpen className="w-10 h-10 text-samidha-purple" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Assignments</p>
            <h3 className="text-4xl font-bold text-samidha-dark">{profile.stats.assignmentsSubmitted} <span className="text-lg text-gray-400 font-normal">submitted</span></h3>
          </div>
        </div>
      </div>
    </div>
  );
}
