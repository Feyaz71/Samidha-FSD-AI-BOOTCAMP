import { useState } from 'react';
import { UploadCloud, ArrowRight } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // MOCK SUBMISSION
    setMessage('Assignment Submitted Successfully!');
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
            <input required type="text" name="student_id" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 uppercase outline-none" placeholder="SAM2026-001" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
            <select required name="assignment_title" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Select Assignment</option>
              <option value="Day 1 - Portfolio HTML">Day 1 - Portfolio HTML</option>
              <option value="Day 2 - CSS Styling">Day 2 - CSS Styling</option>
              <option value="Day 3 - Javascript Basics">Day 3 - Javascript Basics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea name="description" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" rows="2" placeholder="Any notes for the mentor..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link (Optional)</label>
              <input type="url" name="github_link" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live Link (Optional)</label>
              <input type="url" name="live_link" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." />
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
