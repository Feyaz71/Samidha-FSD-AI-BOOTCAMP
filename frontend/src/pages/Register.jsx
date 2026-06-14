import { useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    institution_name: '',
    year_or_class: ''
  });
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mobile) {
      setError('Please provide your Mobile Number.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('https://samidhagbpec.onrender.com/api/students/register', formData);
      setSuccessId(res.data.student_id);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-samidha-purple">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Welcome to the Samidha Bootcamp. Please save your Student ID securely.</p>
          <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold mb-1">Your Unique Student ID</p>
            <p className="text-3xl font-mono font-bold text-samidha-purple">{successId}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-samidha-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-samidha-dark">Student Registration</h2>
          <p className="text-gray-500 mt-2">Join the AI Web Development Bootcamp</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" name="full_name" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-purple outline-none" placeholder="John Doe" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input type="email" name="email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-purple outline-none" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input required type="tel" name="mobile" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-purple outline-none" placeholder="9876543210" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School / College Name</label>
              <input required type="text" name="institution_name" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-purple outline-none" placeholder="GB Pant Engineering College" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year / Class</label>
              <input required type="text" name="year_or_class" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-purple outline-none" placeholder="e.g. 10th Class, or 2nd Year" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-samidha-purple to-samidha-blue text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {loading ? 'Registering...' : 'Register Now'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
