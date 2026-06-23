import { useState, useEffect } from 'react';
import { UploadCloud, ArrowRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TestAssignment() {
  const [formData, setFormData] = useState({
    student_id: '',
    assignment_title: '',
    description: '',
    github_link: '',
    live_link: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTestAssignments, setActiveTestAssignments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [inlineOtp, setInlineOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sid = localStorage.getItem('samidhaStudentId');
    if (!sid) {
      navigate('/student');
      return;
    }
    setFormData(prev => ({ ...prev, student_id: sid }));

    const fetchActive = async () => {
      try {
        const res = await axios.get('https://samidhagbpec.onrender.com/api/test-assignments/active');
        setActiveTestAssignments(res.data);
      } catch (err) {
        console.error('Failed to fetch test assignments');
      }
    };
    fetchActive();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setOtpData(null);
    try {
      const res = await axios.post('https://samidhagbpec.onrender.com/api/test-assignments/submit', formData);
      if (res.data.has_otp) {
        setOtpData({
          otp: res.data.otp,
          expires_at: res.data.expires_at
        });
        setMessage('Success! Your assignment was submitted on time.');
      } else {
        setMessage(res.data.message || 'Assignment Submitted Successfully!');
      }
      setFormData({ student_id: formData.student_id, assignment_title: '', description: '', github_link: '', live_link: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInlineOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpSubmitting(true);
    setOtpMessage('');
    try {
      const mobile = localStorage.getItem('samidhaStudentMobile');
      const res = await axios.post('https://samidhagbpec.onrender.com/api/attendance/mark', {
        student_id: formData.student_id,
        mobile: mobile,
        otp_code: inlineOtp
      });
      setOtpMessage('✅ ' + res.data.message);
    } catch (err) {
      setOtpMessage('❌ ' + (err.response?.data?.error || 'Attendance failed'));
    } finally {
      setOtpSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-samidha-dark">Test Assignment</h2>
          <p className="text-gray-500 mt-2 text-sm">Submit on time to receive your attendance OTP. Queue times may apply.</p>
        </div>

        {message && !otpData && (
          <div className="bg-purple-50 text-purple-700 p-4 rounded-xl text-center font-semibold mb-6 border border-purple-200">
            {message}
          </div>
        )}

        {otpData && (
          <div className="bg-green-50 p-6 rounded-xl text-center mb-6 border-2 border-green-500 shadow-sm">
            <h3 className="text-green-800 font-bold mb-2">Assignment Submitted on Time!</h3>
            <p className="text-sm text-gray-600 mb-4">Your Attendance OTP is ready. It will expire in exactly 2 minutes!</p>
            <div className="text-5xl font-black text-green-600 tracking-widest mb-4">{otpData.otp}</div>
            
            <div className="bg-white p-4 rounded-xl border border-green-200">
              <p className="text-sm font-bold text-gray-700 mb-2">Mark Attendance Now</p>
              <form onSubmit={handleInlineOtpSubmit} className="flex gap-2">
                 <input type="text" value={inlineOtp} onChange={(e) => setInlineOtp(e.target.value)} placeholder="Enter OTP" className="flex-1 p-2 border border-gray-300 rounded-lg text-center font-bold tracking-widest focus:ring-2 focus:ring-green-500 outline-none" required />
                 <button type="submit" disabled={otpSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                   {otpSubmitting ? 'Verifying...' : 'Submit OTP'}
                 </button>
              </form>
              {otpMessage && <p className="mt-3 text-sm font-semibold">{otpMessage}</p>}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
            <span className="text-sm font-medium text-gray-500">Submitting as:</span>
            <span className="ml-2 font-bold text-purple-900 uppercase">{formData.student_id}</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Assignment</label>
            <select required name="assignment_title" value={formData.assignment_title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" disabled={isSubmitting}>
              <option value="">Select Test Assignment</option>
              {activeTestAssignments.map((a, i) => (
                <option key={i} value={a.title}>{a.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" rows="2" placeholder="Any notes..." disabled={isSubmitting}></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link (Optional)</label>
              <input type="url" name="github_link" value={formData.github_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://github.com/..." disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live Link (Optional)</label>
              <input type="url" name="live_link" value={formData.live_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://..." disabled={isSubmitting} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (Optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" disabled={isSubmitting} />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors mt-4 disabled:bg-purple-400"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Waiting in Queue...
              </>
            ) : (
              <>
                Submit Work
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
