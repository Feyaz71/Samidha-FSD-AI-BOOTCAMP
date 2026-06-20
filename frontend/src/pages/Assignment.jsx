import { useState, useEffect } from 'react';
import { UploadCloud, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Assignment() {
  const [formData, setFormData] = useState({
    student_id: '',
    assignment_title: '',
    description: '',
    github_link: '',
    live_link: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [activeAssignments, setActiveAssignments] = useState([]);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await axios.get('https://samidhagbpec.onrender.com/api/assignments/active');
        setActiveAssignments(res.data);
      } catch (err) {
        console.error('Failed to fetch assignments');
      }
    };
    fetchActive();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://samidhagbpec.onrender.com/api/assignments/submit', formData);
      setMessage(res.data.message || 'Assignment Submitted Successfully!');
      setFormData({
        student_id: '',
        assignment_title: '',
        description: '',
        github_link: '',
        live_link: ''
      });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-samidha-dark">Submit Assignment</h2>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-semibold mb-6 border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input required type="text" name="student_id" value={formData.student_id} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 uppercase outline-none" placeholder="SAM2026-001" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
            <select required name="assignment_title" value={formData.assignment_title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Select Assignment</option>
              {activeAssignments.map((a, i) => (
                <option key={i} value={a.title}>{a.title} (Due: {new Date(a.deadline).toLocaleDateString()})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" rows="2" placeholder="Any notes for the mentor..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link (Optional)</label>
              <input type="url" name="github_link" value={formData.github_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live Link (Optional)</label>
              <input type="url" name="live_link" value={formData.live_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (Optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors mt-4"
          >
            Submit Work
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
