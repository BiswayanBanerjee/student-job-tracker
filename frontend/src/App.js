// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const API = 'https://student-job-tracker-ncv3.onrender.com/api/jobs';

// const statusColors = {
//   Applied: '#007bff',
//   Interview: '#ffc107',
//   Offer: '#28a745',
//   Rejected: '#dc3545'
// };

// function App() {
//   const [jobs, setJobs] = useState([]);
//   const [form, setForm] = useState({
//     company: '', role: '', status: 'Applied', appliedDate: '', link: ''
//   });

//   const fetchJobs = async () => {
//     const res = await axios.get(API);
//     setJobs(res.data);
//   };

//   useEffect(() => { fetchJobs(); }, []);

//   const addJob = async () => {
//     await axios.post(API, form);
//     fetchJobs();
//     setForm({ company: '', role: '', status: 'Applied', appliedDate: '', link: '' });
//   };

//   const deleteJob = async (id) => {
//     await axios.delete(`${API}/${id}`);
//     fetchJobs();
//   };

//   const updateStatus = async (id, status) => {
//     await axios.patch(`${API}/${id}`, { status });
//     fetchJobs();
//   };

//   return (
//     <div style={{
//       padding: 40, maxWidth: 800, margin: 'auto', fontFamily: 'Segoe UI, sans-serif',
//       background: '#f8f9fa', borderRadius: 10
//     }}>
//       <h2 style={{ textAlign: 'center', marginBottom: 30 }}>🎯 Student Job Tracker</h2>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15 }}>
//         <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
//         <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
//         <input type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
//         <input placeholder="Link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
//         <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
//           <option>Applied</option>
//           <option>Interview</option>
//           <option>Offer</option>
//           <option>Rejected</option>
//         </select>
//       </div>

//       <div style={{ textAlign: 'center', marginTop: 20 }}>
//         <button onClick={addJob} style={{
//           padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none',
//           borderRadius: 5, cursor: 'pointer'
//         }}>➕ Add Job</button>
//       </div>

//       <div style={{ marginTop: 40 }}>
//         {jobs.map(job => (
//           <div key={job._id} style={{
//             border: '1px solid #ddd',
//             borderLeft: `5px solid ${statusColors[job.status]}`,
//             borderRadius: 8,
//             marginBottom: 20,
//             padding: 20,
//             backgroundColor: '#fff',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//           }}>
//             <h3 style={{ margin: 0 }}>{job.company} <span style={{ fontWeight: 400 }}> - {job.role}</span></h3>
//             <p>Status: <span style={{ color: statusColors[job.status], fontWeight: 'bold' }}>{job.status}</span></p>
//             <p>Date Applied: {job.appliedDate || 'N/A'}</p>
//             <p>
//               <a href={job.link} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
//                 🔗 View Job
//               </a>
//             </p>

//             <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
//               <select value={job.status} onChange={e => updateStatus(job._id, e.target.value)}>
//                 <option>Applied</option>
//                 <option>Interview</option>
//                 <option>Offer</option>
//                 <option>Rejected</option>
//               </select>

//               <button onClick={() => deleteJob(job._id)} style={{
//                 background: '#dc3545',
//                 color: 'white',
//                 border: 'none',
//                 padding: '6px 12px',
//                 borderRadius: 4,
//                 cursor: 'pointer'
//               }}>
//                 🗑️ Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://student-job-tracker-ncv3.onrender.com/api/jobs';

const statusColors = {
  Applied: '#007bff',
  Interview: '#ffc107',
  Offer: '#28a745',
  Rejected: '#dc3545'
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: '', role: '', status: 'Applied', appliedDate: '', link: ''
  });
  const [loading, setLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API);
      setJobs(res.data);
      setBackendReady(true);
    } catch (err) {
      console.log("Waiting for backend to start...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Optional: Keep retrying every 2 seconds until backend wakes up
    const interval = setInterval(() => {
      if (!backendReady) {
        fetchJobs();
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addJob = async () => {
    await axios.post(API, form);
    fetchJobs();
    setForm({ company: '', role: '', status: 'Applied', appliedDate: '', link: '' });
  };

  const deleteJob = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchJobs();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/${id}`, { status });
    fetchJobs();
  };

  if (loading || !backendReady) {
    return (
      <div style={{
        padding: 40, textAlign: 'center', fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2>🚀 Waking up backend...</h2>
        <p>Please wait while the backend starts. This may take a few seconds.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: 40, maxWidth: 800, margin: 'auto', fontFamily: 'Segoe UI, sans-serif',
      background: '#f8f9fa', borderRadius: 10
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>🎯 Student Job Tracker</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15 }}>
        <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
        <input type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
        <input placeholder="Link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={addJob} style={{
          padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none',
          borderRadius: 5, cursor: 'pointer'
        }}>➕ Add Job</button>
      </div>

      <div style={{ marginTop: 40 }}>
        {jobs.map(job => (
          <div key={job._id} style={{
            border: '1px solid #ddd',
            borderLeft: `5px solid ${statusColors[job.status]}`,
            borderRadius: 8,
            marginBottom: 20,
            padding: 20,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ margin: 0 }}>{job.company} <span style={{ fontWeight: 400 }}> - {job.role}</span></h3>
            <p>Status: <span style={{ color: statusColors[job.status], fontWeight: 'bold' }}>{job.status}</span></p>
            <p>Date Applied: {job.appliedDate || 'N/A'}</p>
            <p>
              <a href={job.link} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                🔗 View Job
              </a>
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <select value={job.status} onChange={e => updateStatus(job._id, e.target.value)}>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

              <button onClick={() => deleteJob(job._id)} style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer'
              }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
