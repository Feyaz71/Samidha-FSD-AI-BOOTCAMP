import { useState, useEffect } from 'react';
import { Users, CheckCircle, BookOpen, Key, Download, Code } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState({ totalStudents: 0, totalAttendance: 0, totalAssignments: 0 });
  const [generatedCode, setGeneratedCode] = useState(null);
  const [viewingData, setViewingData] = useState(null); // 'students', 'attendance', 'assignments'
  const [tableData, setTableData] = useState([]);
  const [dayNumber, setDayNumber] = useState(1);
  const [newAssignment, setNewAssignment] = useState({ title: '', deadline: '' });
  const [newTestAssignment, setNewTestAssignment] = useState({ title: '', duration_hours: '', start_time: '' });

  const fetchAnalytics = async (key) => {
    try {
      const res = await axios.get('https://samidhagbpec.onrender.com/api/admin/analytics', {
        headers: { 'x-admin-key': key }
      });
      setAnalytics(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('adminKey', key);
    } catch (err) {
      alert('Invalid Admin Key or Server Error');
      setIsAuthenticated(false);
      localStorage.removeItem('adminKey');
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchAnalytics(adminKey);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchAnalytics(adminKey);
  };

  const handleGenerateCode = async () => {
    if (!dayNumber || isNaN(dayNumber)) {
      alert('Please enter a valid day number');
      return;
    }
    try {
      const res = await axios.post('https://samidhagbpec.onrender.com/api/admin/attendance-code', {
        day_number: parseInt(dayNumber),
        expires_in_minutes: 15
      }, {
        headers: { 'x-admin-key': adminKey }
      });
      setGeneratedCode(res.data.code);
      alert(`New Attendance Code: ${res.data.code} (Valid for 15 mins)`);
    } catch (err) {
      alert('Failed to generate code.');
    }
  };

  const handleExport = async (type) => {
    try {
      const res = await axios.get(`https://samidhagbpec.onrender.com/api/admin/export/${type}`, {
        headers: { 'x-admin-key': adminKey },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Export failed or no data available.');
    }
  };

  const fetchTableData = async (type) => {
    try {
      setViewingData(type);
      const res = await axios.get(`https://samidhagbpec.onrender.com/api/admin/${type}`, {
        headers: { 'x-admin-key': adminKey }
      });
      setTableData(res.data);
    } catch (err) {
      alert('Failed to fetch data');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await axios.post('https://samidhagbpec.onrender.com/api/admin/assignment-config', newAssignment, {
        headers: { 'x-admin-key': adminKey }
      });
      alert('Assignment created successfully!');
      setNewAssignment({ title: '', deadline: '' });
    } catch (err) {
      alert('Failed to create assignment');
    }
  };

  const handleCreateTestAssignment = async () => {
    try {
      await axios.post('https://samidhagbpec.onrender.com/api/admin/test-assignment', newTestAssignment, {
        headers: { 'x-admin-key': adminKey }
      });
      alert('Test Assignment created successfully!');
      setNewTestAssignment({ title: '', duration_hours: '', start_time: '' });
    } catch (err) {
      alert('Failed to create test assignment');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-samidha-dark mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="password" placeholder="Enter Secret Key" onChange={(e) => setAdminKey(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" />
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-samidha-dark">Admin Dashboard</h1>
        <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-200" onClick={() => { setIsAuthenticated(false); localStorage.removeItem('adminKey'); }}>Lock</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div onClick={() => fetchTableData('students')} className={`bg-white rounded-2xl p-6 shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition ${viewingData === 'students' ? 'ring-2 ring-samidha-purple' : ''}`}>
          <div className="bg-purple-100 p-3 rounded-full"><Users className="w-8 h-8 text-samidha-purple" /></div>
          <div><p className="text-gray-500">Total Students</p><h3 className="text-2xl font-bold">{analytics.totalStudents}</h3></div>
        </div>
        <div onClick={() => fetchTableData('attendance')} className={`bg-white rounded-2xl p-6 shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition ${viewingData === 'attendance' ? 'ring-2 ring-samidha-blue' : ''}`}>
          <div className="bg-blue-100 p-3 rounded-full"><CheckCircle className="w-8 h-8 text-samidha-blue" /></div>
          <div><p className="text-gray-500">Attendance Entries</p><h3 className="text-2xl font-bold">{analytics.totalAttendance}</h3></div>
        </div>
        <div onClick={() => fetchTableData('assignments')} className={`bg-white rounded-2xl p-6 shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition ${viewingData === 'assignments' ? 'ring-2 ring-green-500' : ''}`}>
          <div className="bg-green-100 p-3 rounded-full"><BookOpen className="w-8 h-8 text-green-600" /></div>
          <div><p className="text-gray-500">Assignments</p><h3 className="text-2xl font-bold">{analytics.totalAssignments}</h3></div>
        </div>
      </div>

      {viewingData && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold capitalize">{viewingData} List</h2>
            <button onClick={() => setViewingData(null)} className="text-gray-500 hover:text-red-500">Close</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b">ID</th>
                {viewingData === 'students' && (
                  <>
                    <th className="p-3 border-b">Name</th>
                    <th className="p-3 border-b">Mobile</th>
                    <th className="p-3 border-b">College</th>
                  </>
                )}
                {viewingData === 'attendance' && (
                  <>
                    <th className="p-3 border-b">Day</th>
                    <th className="p-3 border-b">Marked At</th>
                  </>
                )}
                {viewingData === 'assignments' && (
                  <>
                    <th className="p-3 border-b">Name</th>
                    <th className="p-3 border-b">Assignment</th>
                    <th className="p-3 border-b">Status</th>
                    <th className="p-3 border-b">Links</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr><td colSpan="4" className="p-3 text-center text-gray-500">No data found</td></tr>
              ) : (
                tableData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b">
                    <td className="p-3 font-medium">{item.student_id}</td>
                    {viewingData === 'students' && (
                      <>
                        <td className="p-3">{item.full_name}</td>
                        <td className="p-3">{item.mobile}</td>
                        <td className="p-3">{item.institution_name}</td>
                      </>
                    )}
                    {viewingData === 'attendance' && (
                      <>
                        <td className="p-3">Day {item.day_number}</td>
                        <td className="p-3">{new Date(item.marked_at || item.createdAt).toLocaleString()}</td>
                      </>
                    )}
                    {viewingData === 'assignments' && (
                      <>
                        <td className="p-3">{item.student_name}</td>
                        <td className="p-3">{item.assignment_title} (v{item.version})</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {item.github_link && <a href={item.github_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mr-2">GitHub</a>}
                          {item.live_link && <a href={item.live_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Live</a>}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-4">Quick Actions</h2>
        
        {generatedCode && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-xl font-bold flex items-center gap-2 border border-yellow-200">
            <Code className="w-5 h-5" />
            Live Code: <span className="text-2xl tracking-widest bg-white px-3 py-1 rounded">{generatedCode}</span> (Expires in 15m)
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Day Number</label>
            <input 
              type="number" 
              min="1" 
              value={dayNumber} 
              onChange={(e) => setDayNumber(e.target.value === '' ? '' : parseInt(e.target.value))} 
              className="w-24 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-samidha-blue"
            />
          </div>
          <button onClick={handleGenerateCode} className="bg-samidha-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition h-[50px]">Generate Code</button>
          <button onClick={() => handleExport('attendance')} className="bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition flex items-center gap-2 h-[50px]"><Download className="w-4 h-4"/> Export Attendance CSV</button>
          <button onClick={() => handleExport('students')} className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-200 transition flex items-center gap-2"><Download className="w-4 h-4"/> Export Students CSV</button>
          <button className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-200 transition flex items-center gap-2"><Download className="w-4 h-4"/> Generate Certificates</button>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Create New Assignment</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-sm font-semibold text-gray-700">Assignment Title</label>
              <input 
                type="text" 
                value={newAssignment.title} 
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} 
                className="w-full md:w-64 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-samidha-blue"
                placeholder="Day 4 - React Basics"
              />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-sm font-semibold text-gray-700">Deadline</label>
              <input 
                type="datetime-local" 
                value={newAssignment.deadline} 
                onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})} 
                className="w-full md:w-48 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-samidha-blue"
              />
            </div>
            <button onClick={handleCreateAssignment} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition h-[50px] w-full md:w-auto">Create Assignment</button>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-purple-700">Create New TEST Assignment (With Queue)</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-sm font-semibold text-gray-700">Test Title</label>
              <input 
                type="text" 
                value={newTestAssignment.title} 
                onChange={(e) => setNewTestAssignment({...newTestAssignment, title: e.target.value})} 
                className="w-full md:w-64 p-3 border border-purple-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Mega Test - React"
              />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-sm font-semibold text-gray-700">Start Time</label>
              <input 
                type="datetime-local" 
                value={newTestAssignment.start_time} 
                onChange={(e) => setNewTestAssignment({...newTestAssignment, start_time: e.target.value})} 
                className="w-full md:w-48 p-3 border border-purple-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-sm font-semibold text-gray-700">Duration (Hrs)</label>
              <input 
                type="number" 
                value={newTestAssignment.duration_hours} 
                onChange={(e) => setNewTestAssignment({...newTestAssignment, duration_hours: e.target.value})} 
                className="w-full md:w-24 p-3 border border-purple-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="2"
              />
            </div>
            <button onClick={handleCreateTestAssignment} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition h-[50px] w-full md:w-auto">Create Test</button>
          </div>
        </div>

      </div>
    </div>
  );
}
