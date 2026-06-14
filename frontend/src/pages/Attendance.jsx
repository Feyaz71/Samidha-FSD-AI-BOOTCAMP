import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Attendance() {
  const [formData, setFormData] = useState({
    student_id: '',
    mobile: '',
    code: ''
  });
  const [status, setStatus] = useState('CLOSED'); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance/status');
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/mark', formData);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-samidha-blue" />
          </div>
          <h2 className="text-3xl font-bold text-samidha-dark">Mark Attendance</h2>
          
          <div className={`mt-4 inline-block px-4 py-2 rounded-full font-bold text-sm ${status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Today's Status: {status}
          </div>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-semibold mb-6 border border-green-200">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-semibold mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input required type="text" name="student_id" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-blue focus:border-transparent outline-none uppercase" placeholder="SAM2026-001" disabled={status !== 'OPEN'} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Last 4 Digits or Full)</label>
            <input required type="text" name="mobile" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-blue focus:border-transparent outline-none" placeholder="1234" disabled={status !== 'OPEN'} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">5-Digit Attendance OTP</label>
            <input required type="text" name="code" maxLength="5" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-samidha-blue focus:border-transparent outline-none text-2xl tracking-widest text-center font-mono" placeholder="83721" disabled={status !== 'OPEN'} />
          </div>

          <button 
            type="submit" 
            disabled={status !== 'OPEN' || loading}
            className="w-full flex items-center justify-center gap-2 bg-samidha-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Submitting...' : 'Submit Attendance'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
