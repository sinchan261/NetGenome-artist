
// import React, { useState, useEffect } from 'react';
// import { FiUsers, FiDatabase, FiUpload, FiMail, FiClock, FiTrash2, FiEye, FiEdit, FiLoader, FiMoreVertical } from 'react-icons/fi';

// const AdminDashboard = () => {
//   // State for all data
//   const [artistStores, setArtistStores] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [requestHistory, setRequestHistory] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [selectedArtist, setSelectedArtist] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDropdown, setShowDropdown] = useState(null);
  
//   // Loading states
//   const [loading, setLoading] = useState({
//     artists: false,
//     requests: false,
//     history: false,
//     actions: false,
//     upload: false
//   });

//   // Error states
//   const [error, setError] = useState({
//     artists: null,
//     requests: null,
//     history: null
//   });

//   // Fetch all initial data
//   useEffect(() => {
//     fetchArtists();
//     fetchRequests();
//     fetchRequestHistory();
//   }, []);

//   // Fetch artist stores from API
//   const fetchArtists = async () => {
//     setLoading(prev => ({ ...prev, artists: true }));
//     setError(prev => ({ ...prev, artists: null }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/artist/artists');
//       if (!res.ok) throw new Error(`Failed to fetch artists: ${res.status}`);
      
//       const data = await res.json();
      
//       // Transform the data to extract needed fields
//       const formattedArtists = data.artists.map(artist => ({
//         id: artist._id,
//         artistID: artist.artistID,
//         name: artist.displayName,
//         realName: artist.identity?.realName || 'Not specified',
//         location: artist.identity?.location || 'Not specified',
//         genres: artist.artistic_background?.genres?.join(', ') || 'Not specified',
//         imageUrl: artist.imageUrl,
//         joined: new Date(artist._creationTime).toISOString(),
//         status: 'active'
//       }));
      
//       setArtistStores(formattedArtists);
    
//     } catch (err) {
//       console.error("Fetch artists error:", err);
//       setError(prev => ({ ...prev, artists: err.message }));
//       setArtistStores([]);
//     } finally {
//       setLoading(prev => ({ ...prev, artists: false }));
//     }
//   };

//   // Fetch pending requests
//   const fetchRequests = async () => {
//     setLoading(prev => ({ ...prev, requests: true }));
//     setError(prev => ({ ...prev, requests: null }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/artist-requests');
//       if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
      
//       const data = await res.json();
//       setRequests(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Fetch requests error:", err);
//       setError(prev => ({ ...prev, requests: err.message }));
//       setRequests([]);
//     } finally {
//       setLoading(prev => ({ ...prev, requests: false }));
//     }
//   };

//   // Fetch request history
//   const fetchRequestHistory = async () => {
//     setLoading(prev => ({ ...prev, history: true }));
//     setError(prev => ({ ...prev, history: null }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/requests/history');
//       if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
      
//       const data = await res.json();
//       setRequestHistory(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Fetch history error:", err);
//       setError(prev => ({ ...prev, history: err.message }));
//       setRequestHistory([]);
//     } finally {
//       setLoading(prev => ({ ...prev, history: false }));
//     }
//   };

//   // Handle approve request
//   const handleApprove = async (_id) => {
//     setLoading(prev => ({ ...prev, actions: true }));
  
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/request/approve', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ requestId: _id }),
//       });
      
//       if (!res.ok) throw new Error('Approval failed');
      
//       // Refresh data
//       await Promise.all([fetchArtists(), fetchRequests(), fetchRequestHistory()]);
      
//       alert("Request approved successfully!");
//     } catch (err) {
//       console.error("Approve error:", err);
//       alert(`Failed to approve: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, actions: false }));
//     }
//   };

//   // Handle reject request
//   const handleReject = async (_id) => {
//     setLoading(prev => ({ ...prev, actions: true }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/request/reject', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ requestId: _id }),
//       });

//       if (!res.ok) throw new Error('Rejection failed');
      
//       // Refresh data
//       await Promise.all([fetchRequests(), fetchRequestHistory()]);
      
//       alert("Request rejected successfully!");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert(`Failed to reject: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, actions: false }));
//     }
//   };

//   // Handle file upload for database update
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;
    
//     setLoading(prev => ({ ...prev, upload: true }));
    
//     try {
//       const formData = new FormData();
//       formData.append('file', selectedFile);
      
//       const res = await fetch('https://netgenome-1.onrender.com/api/upload-magazine', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) throw new Error('Upload failed');
      
//       // Refresh artists after update
//       await fetchArtists();
//       setSelectedFile(null);
      
//       alert("Database updated successfully!");
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert(`Failed to upload: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, upload: false }));
//     }
//   };

//   // Delete artist store
//   const deleteArtistStore = async (id) => {
//     console.log("hello")
//     console.log(id)

//     if (!window.confirm('Are you sure you want to delete this artist store?')) return;
    
//     setLoading(prev => ({ ...prev, actions: true }));
    
//     try {
//       const res = await fetch(`https://netgenome-1.onrender.com/api/artists/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) throw new Error('Deletion failed');
      
//       // Refresh artists
//       await fetchArtists();
      
//       alert("Artist store deleted successfully!");
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert(`Failed to delete: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, actions: false }));
//     }
//   };

//   // View artist profile
//   const viewArtistProfile = (artist) => {
//     setSelectedArtist(artist);
//     setActiveTab('artistProfile');
//   };

//   // Toggle dropdown menu for artist actions
//   const toggleDropdown = (artistId, e) => {
//     e.stopPropagation();
//     setShowDropdown(showDropdown === artistId ? null : artistId);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => {
//       setShowDropdown(null);
//     };
    
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   // Loading spinner component
//   const LoadingSpinner = () => (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
//       <FiLoader className="spin" style={{ animation: 'spin 1s linear infinite', fontSize: '24px' }} />
//     </div>
//   );

//   // Error display component
//   const ErrorDisplay = ({ message }) => (
//     <div style={{ 
//       backgroundColor: '#ffe6e6',
//       color: '#d32f2f',
//       padding: '15px',
//       borderRadius: '4px',
//       margin: '20px 0',
//       border: '1px solid #ffcccc'
//     }}>
//       <strong>Error:</strong> {message}
//       <button 
//         onClick={() => window.location.reload()}
//         style={{
//           marginLeft: '10px',
//           padding: '5px 10px',
//           backgroundColor: '#d32f2f',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Retry
//       </button>
//     </div>
//   );

//   // Dashboard Tab
//   const DashboardTab = () => (
//     <div>
//       <h1 style={{ color: '#1a1a1a', marginBottom: '30px' }}>Admin Dashboard</h1>
      
//       <div className="stats-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
//         <div className="card" style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #d4a373'
//         }}>
//           <h3 style={{ color: '#666', marginTop: 0 }}>Total Artist Stores</h3>
//           {loading.artists ? (
//             <LoadingSpinner />
//           ) : error.artists ? (
//             <p style={{ color: '#d32f2f' }}>Error loading count</p>
//           ) : (
//             <>
//               <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>{artistStores.length}</p>
//               <p style={{ color: '#666', margin: 0 }}>Registered artists</p>
//             </>
//           )}
//         </div>
        
//         <div className="card" style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #a5a58d'
//         }}>
//           <h3 style={{ color: '#666', marginTop: 0 }}>Pending Requests</h3>
//           {loading.requests ? (
//             <LoadingSpinner />
//           ) : error.requests ? (
//             <p style={{ color: '#d32f2f' }}>Error loading requests</p>
//           ) : (
//             <>
//               <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>
//                 {Array.isArray(requests) ? requests.length : 0}
//               </p>
//               <p style={{ color: '#666', margin: 0 }}>Requiring your attention</p>
//             </>
//           )}
//         </div>
        
//         <div className="card" style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #6b705c'
//         }}>
//           <h3 style={{ color: '#666', marginTop: 0 }}>Recent Activity</h3>
//           {loading.history ? (
//             <LoadingSpinner />
//           ) : error.history ? (
//             <p style={{ color: '#d32f2f' }}>Error loading count</p>
//           ) : (
//             <>
//               <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>{requestHistory.length}</p>
//               <p style={{ color: '#666', margin: 0 }}>Processed requests</p>
//             </>
//           )}
//         </div>
//       </div>
      
//       <div className="recent-artists" style={{
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//       }}>
//         <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>Recent Artist Stores</h2>
        
//         {loading.artists ? (
//           <LoadingSpinner />
//         ) : error.artists ? (
//           <ErrorDisplay message={error.artists} />
//         ) : artistStores.length === 0 ? (
//           <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No artist stores found</p>
//         ) : (
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
//               <thead>
//                 <tr style={{ borderBottom: '1px solid #eee' }}>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Artist ID</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Display Name</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Real Name</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Joined</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {artistStores.slice(0, 10).map(artist => (
//                   <tr key={artist.id} style={{ borderBottom: '1px solid #eee' }}>
//                     <td style={{ padding: '12px' }}>{artist.artistID}</td>
//                     <td style={{ padding: '12px' }}>{artist.name}</td>
//                     <td style={{ padding: '12px' }}>{artist.realName}</td>
//                     <td style={{ padding: '12px' }}>{new Date(artist.joined).toLocaleDateString()}</td>
//                     <td style={{ padding: '12px', position: 'relative' }}>
//                       <button 
//                         onClick={(e) => toggleDropdown(artist.id, e)}
//                         style={{
//                           backgroundColor: 'transparent',
//                           border: 'none',
//                           color: '#666',
//                           cursor: 'pointer',
//                           padding: '5px'
//                         }}
//                       >
//                         <FiMoreVertical />
//                       </button>
                      
//                       {showDropdown === artist.id && (
//                         <div style={{
//                           position: 'absolute',
//                           right: '10px',
//                           top: '40px',
//                           backgroundColor: 'white',
//                           borderRadius: '4px',
//                           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                           zIndex: 100,
//                           minWidth: '150px'
//                         }}>
//                           <button 
//                             onClick={() => {
//                               viewArtistProfile(artist);
//                               setShowDropdown(null);
//                             }}
//                             style={{
//                               width: '100%',
//                               textAlign: 'left',
//                               padding: '8px 12px',
//                               backgroundColor: 'transparent',
//                               border: 'none',
//                               cursor: 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px',
//                               color: '#1a1a1a'
//                             }}
//                           >
//                             <FiEye /> View Details
//                           </button>
//                           <button 
//                             onClick={() => {
//                               console.log(artist.id)
//                               deleteArtistStore(artist.id);
//                               setShowDropdown(null);
//                             }}
//                             disabled={loading.actions}
//                             style={{
//                               width: '100%',
//                               textAlign: 'left',
//                               padding: '8px 12px',
//                               backgroundColor: 'transparent',
//                               border: 'none',
//                               cursor: loading.actions ? 'not-allowed' : 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px',
//                               color: loading.actions ? '#ccc' : '#d32f2f'
//                             }}
//                           >
//                             <FiTrash2 /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Artist Stores Tab
//   const ArtistsTab = () => (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h1 style={{ color: '#1a1a1a', margin: 0 }}>Artist Stores ({artistStores.length})</h1>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <input 
//             type="text" 
//             placeholder="Search artists..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               padding: '10px',
//               borderRadius: '4px',
//               border: '1px solid #ddd',
//               minWidth: '250px'
//             }}
//           />
//           <button style={{
//             padding: '10px 15px',
//             backgroundColor: '#d4a373',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}>
//             Add New
//           </button>
//         </div>
//       </div>
      
//       {loading.artists ? (
//         <LoadingSpinner />
//       ) : error.artists ? (
//         <ErrorDisplay message={error.artists} />
//       ) : (
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         }}>
//           {artistStores.length === 0 ? (
//             <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
//               {searchTerm ? 'No matching artists found' : 'No artist stores available'}
//             </p>
//           ) : (
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
//                 <thead>
//                   <tr style={{ borderBottom: '1px solid #eee' }}>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Artist ID</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Display Name</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Real Name</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Location</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Genres</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Joined</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {artistStores
//                     .filter(artist => 
//                       artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       artist.artistID.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                       artist.realName.toLowerCase().includes(searchTerm.toLowerCase())
//                     )
//                     .map(artist => (
//                       <tr key={artist.id} style={{ borderBottom: '1px solid #eee' }}>
//                         <td style={{ padding: '12px' }}>{artist.artistID}</td>
//                         <td style={{ padding: '12px' }}>{artist.name}</td>
//                         <td style={{ padding: '12px' }}>{artist.realName}</td>
//                         <td style={{ padding: '12px' }}>{artist.location}</td>
//                         <td style={{ padding: '12px' }}>{artist.genres}</td>
//                         <td style={{ padding: '12px' }}>{new Date(artist.joined).toLocaleDateString()}</td>
//                         <td style={{ padding: '12px', position: 'relative' }}>
//                           <button 
//                             onClick={(e) => toggleDropdown(artist.id, e)}
//                             style={{
//                               backgroundColor: 'transparent',
//                               border: 'none',
//                               color: '#666',
//                               cursor: 'pointer',
//                               padding: '5px'
//                             }}
//                           >
//                             <FiMoreVertical />
//                           </button>
                          
//                           {showDropdown === artist.id && (
//                             <div style={{
//                               position: 'absolute',
//                               right: '10px',
//                               top: '40px',
//                               backgroundColor: 'white',
//                               borderRadius: '4px',
//                               boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                               zIndex: 100,
//                               minWidth: '150px'
//                             }}>
//                               <button 
//                                 onClick={() => {
//                                   viewArtistProfile(artist);
//                                   setShowDropdown(null);
//                                 }}
//                                 style={{
//                                   width: '100%',
//                                   textAlign: 'left',
//                                   padding: '8px 12px',
//                                   backgroundColor: 'transparent',
//                                   border: 'none',
//                                   cursor: 'pointer',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   gap: '8px',
//                                   color: '#1a1a1a'
//                                 }}
//                               >
//                                 <FiEye /> View Details
//                               </button>
//                               <button 
//                                 onClick={() => {
//                                   deleteArtistStore(artist.id);
//                                   setShowDropdown(null);
//                                 }}
//                                 disabled={loading.actions}
//                                 style={{
//                                   width: '100%',
//                                   textAlign: 'left',
//                                   padding: '8px 12px',
//                                   backgroundColor: 'transparent',
//                                   border: 'none',
//                                   cursor: loading.actions ? 'not-allowed' : 'pointer',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   gap: '8px',
//                                   color: loading.actions ? '#ccc' : '#d32f2f'
//                                 }}
//                               >
//                                 <FiTrash2 /> Delete
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   // Requests Tab
//   const RequestsTab = () => (
//     <div>
//       <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Pending Requests</h1>
      
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//       }}>
//         {loading.requests ? (
//           <LoadingSpinner />
//         ) : error.requests ? (
//           <ErrorDisplay message={error.requests} />
//         ) : requests.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//             <FiMail style={{ fontSize: '48px', marginBottom: '15px', color: '#d4a373' }} />
//             <h3>No pending requests</h3>
//             <p>All requests have been processed</p>
//           </div>
//         ) : (
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid #eee' }}>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Status</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map(request => (
//                 <tr key={request._id} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px' }}>{request.email}</td>
//                   <td style={{ padding: '12px' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       backgroundColor: request.status === 'approved' ? '#e6f4ea' : 
//                                       request.status === 'rejected' ? '#ffe6e6' : '#fff8e6',
//                       color: request.status === 'approved' ? '#2e7d32' : 
//                             request.status === 'rejected' ? '#d32f2f' : '#ff9800'
//                     }}>
//                       {request.status || 'Pending'}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     {request.status === 'approved' ? (
//                       <button 
//                         onClick={() => handleReject(request._id)}
//                         disabled={loading.actions}
//                         style={{
//                           padding: '6px 12px',
//                           backgroundColor: loading.actions ? '#f5f5f5' : '#f5f5f5',
//                           color: loading.actions ? '#999' : '#d32f2f',
//                           border: '1px solid #ddd',
//                           borderRadius: '4px',
//                           cursor: loading.actions ? 'not-allowed' : 'pointer'
//                         }}
//                       >
//                         Reject
//                       </button>
//                     ) : request.status === 'rejected' ? (
//                       <button 
//                         onClick={() => handleApprove(request._id)}
//                         disabled={loading.actions}
//                         style={{
//                           padding: '6px 12px',
//                           backgroundColor: loading.actions ? '#ccc' : '#d4a373',
//                           color: 'white',
//                           border: 'none',
//                           borderRadius: '4px',
//                           cursor: loading.actions ? 'not-allowed' : 'pointer',
//                           marginRight: '10px'
//                         }}
//                       >
//                         Approve
//                       </button>
//                     ) : (
//                       <>
//                         <button 
//                           onClick={() => handleApprove(request._id)}
//                           disabled={loading.actions}
//                           style={{
//                             padding: '6px 12px',
//                             backgroundColor: loading.actions ? '#ccc' : '#d4a373',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: loading.actions ? 'not-allowed' : 'pointer',
//                             marginRight: '10px'
//                           }}
//                         >
//                           Approve
//                         </button>
//                         <button 
//                           onClick={() => handleReject(request._id)}
//                           disabled={loading.actions}
//                           style={{
//                             padding: '6px 12px',
//                             backgroundColor: loading.actions ? '#f5f5f5' : '#f5f5f5',
//                             color: loading.actions ? '#999' : '#d32f2f',
//                             border: '1px solid #ddd',
//                             borderRadius: '4px',
//                             cursor: loading.actions ? 'not-allowed' : 'pointer'
//                           }}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );

//   // Request History Tab
// const HistoryTab = () => (
//   <div>
//     <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Request History</h1>
    
//     <div style={{
//       backgroundColor: 'white',
//       borderRadius: '8px',
//       padding: '20px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//     }}>
//       {loading.history ? (
//         <LoadingSpinner />
//       ) : error.history ? (
//         <ErrorDisplay message={error.history} />
//       ) : requestHistory.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//           <FiClock style={{ fontSize: '48px', marginBottom: '15px', color: '#d4a373' }} />
//           <h3>No request history</h3>
//           <p>Processed requests will appear here</p>
//         </div>
//       ) : (
//         <>
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid #eee' }}>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requestHistory.map(request => (
//                 <tr key={request._id} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px' }}>{request.email}</td>
//                   <td style={{ padding: '12px' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       backgroundColor: request.status === 'approved' ? '#e6f4ea' : '#ffe6e6',
//                       color: request.status === 'approved' ? '#2e7d32' : '#d32f2f'
//                     }}>
//                       {request.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           <div style={{
//             backgroundColor: '#f8f9fa',
//             padding: '15px',
//             borderRadius: '4px',
//             borderLeft: '4px solid #d4a373',
//             marginTop: '20px'
//           }}>
//             <p style={{ color: '#666', margin: 0 }}>
//               <strong>Implementation Note:</strong> This section displays all processed requests with their current status.
//               Approved requests are shown in green, while rejected ones appear in red.
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   </div>
// );
//   // Update Database Tab
// const UpdateDBTab = () => {
//   const [fileError, setFileError] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check if file is PDF
//       if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
//         setSelectedFile(file);
//         setFileError(null);
//       } else {
//         setSelectedFile(null);
//         setFileError('Please upload a PDF file only');
//       }
//     }
//   };

//   return (
//     <div>
//       <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Update Database</h1>
      
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '30px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//         maxWidth: '600px',
//         margin: '0 auto',
//         textAlign: 'center'
//       }}>
//         <div style={{
//           border: '2px dashed #d4a373',
//           borderRadius: '8px',
//           padding: '40px 20px',
//           marginBottom: '20px',
//           backgroundColor: '#fffaf5'
//         }}>
//           <FiUpload style={{ fontSize: '48px', color: '#d4a373', marginBottom: '15px' }} />
//           <h3 style={{ color: '#1a1a1a', marginTop: 0 }}>Upload Magazine File</h3>
//           <p style={{ color: '#666', marginBottom: '20px' }}>Select a PDF file to update the artist database</p>
          
//           <label style={{
//             display: 'inline-block',
//             padding: '10px 20px',
//             backgroundColor: '#d4a373',
//             color: 'white',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             marginBottom: '10px'
//           }}>
//             Choose PDF File
//             <input 
//               type="file" 
//               onChange={handleFileChange}
//               accept=".pdf,application/pdf"
//               style={{ display: 'none' }}
//               disabled={loading.upload}
//             />
//           </label>
          
//           {selectedFile && (
//             <p style={{ color: '#1a1a1a', margin: '10px 0' }}>
//               Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
//             </p>
//           )}
          
//           {fileError && (
//             <p style={{ 
//               color: '#d32f2f', 
//               margin: '10px 0',
//               backgroundColor: '#ffe6e6',
//               padding: '8px',
//               borderRadius: '4px'
//             }}>
//               {fileError}
//             </p>
//           )}
//         </div>
        
//         <button 
//           onClick={handleUpload}
//           disabled={!selectedFile || loading.upload || fileError}
//           style={{
//             padding: '12px 24px',
//             backgroundColor: !selectedFile || fileError ? '#ccc' : loading.upload ? '#a5a58d' : '#6b705c',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: (!selectedFile || fileError) ? 'not-allowed' : 'pointer',
//             fontSize: '16px',
//             width: '100%',
//             maxWidth: '300px'
//           }}
//         >
//           {loading.upload ? 'Uploading...' : 'Update Database'}
//         </button>
        
//         <div style={{ marginTop: '30px', textAlign: 'left', color: '#666' }}>
//           <h4 style={{ color: '#1a1a1a' }}>Instructions:</h4>
//           <ul style={{ paddingLeft: '20px' }}>
//             <li>Upload a PDF file containing artist information</li>
//             <li>The file should include store name, owner, email, and other relevant details</li>
//             <li>Existing records will be updated, new records will be added</li>
//             <li>This process may take a few minutes depending on file size</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

//   // Artist Profile Tab
//   const ArtistProfileTab = () => {
//     if (!selectedArtist) return null;
    
//     return (
//       <div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h1 style={{ color: '#1a1a1a', margin: 0 }}>Artist Profile</h1>
//           <button 
//             onClick={() => setActiveTab('artists')}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#f5f5f5',
//               color: '#1a1a1a',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}
//           >
//             Back to Artists
//           </button>
//         </div>
        
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '30px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         }}>
//           <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
//             <div style={{
//               width: '120px',
//               height: '120px',
//               borderRadius: '60px',
//               backgroundColor: '#f0f0f0',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#999',
//               fontSize: '40px',
//               fontWeight: 'bold'
//             }}>
//               {selectedArtist.name.charAt(0)}
//             </div>
            
//             <div style={{ flex: 1 }}>
//               <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>{selectedArtist.name}</h2>
//               <p style={{ color: '#666', marginBottom: '15px' }}>Artist ID: {selectedArtist.artistID}</p>
              
//               <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
//                 <span style={{
//                   padding: '4px 12px',
//                   borderRadius: '20px',
//                   backgroundColor: '#e6f4ea',
//                   color: '#2e7d32',
//                   fontSize: '14px'
//                 }}>
//                   Active
//                 </span>
//                 <span style={{
//                   padding: '4px 12px',
//                   borderRadius: '20px',
//                   backgroundColor: '#f0f0f0',
//                   color: '#666',
//                   fontSize: '14px'
//                 }}>
//                   Member since {new Date(selectedArtist.joined).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//             <div style={{
//               backgroundColor: '#fafafa',
//               borderRadius: '8px',
//               padding: '20px'
//             }}>
//               <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '15px' }}>Basic Information</h3>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Real Name</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.realName}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Location</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.location}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Genres</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.genres}</p>
//               </div>
//             </div>
            
//             <div style={{
//               backgroundColor: '#fafafa',
//               borderRadius: '8px',
//               padding: '20px'
//             }}>
//               <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '15px' }}>System Information</h3>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Artist ID</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.artistID}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Database ID</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.id}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Registration Date</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>
//                   {new Date(selectedArtist.joined).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div style={{ marginTop: '30px' }}>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//               <button style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#f5f5f5',
//                 color: '#1a1a1a',
//                 border: '1px solid #ddd',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}>
//                 <FiEdit /> Edit Profile
//               </button>
//               <button style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#d4a373',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}>
//                 View Public Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Sidebar Component
//   const Sidebar = () => (
//     <div style={{
//       width: '250px',
//       backgroundColor: '#1a1a1a',
//       color: '#e6e6e6',
//       height: '100vh',
//       position: 'fixed',
//       padding: '20px 0',
//       left: 0,
//       top: 0,
//       overflowY: 'auto'
//     }}>
//       <div style={{
//         padding: '0 20px 20px',
//         borderBottom: '1px solid #333',
//         marginBottom: '20px'
//       }}>
//         <h2 style={{ color: '#d4a373', margin: 0 }}>Artisan Admin</h2>
//       </div>
      
//       <nav>
//         <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('dashboard')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'dashboard' ? '#333' : 'transparent',
//                 color: activeTab === 'dashboard' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiDatabase /> Dashboard
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('artists')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'artists' ? '#333' : 'transparent',
//                 color: activeTab === 'artists' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiUsers /> Artist Stores
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('requests')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'requests' ? '#333' : 'transparent',
//                 color: activeTab === 'requests' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiMail /> Requests
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('history')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'history' ? '#333' : 'transparent',
//                 color: activeTab === 'history' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiClock /> History
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('updateDB')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'updateDB' ? '#333' : 'transparent',
//                 color: activeTab === 'updateDB' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiUpload /> Update DB
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );

//   return (
//     <div style={{ 
//       backgroundColor: '#f5f5f5', 
//       minHeight: '100vh',
//       marginLeft: '250px' // Make space for fixed sidebar
//     }}>
//       <Sidebar />
      
//       <div style={{ padding: '30px' }}>
//         {activeTab === 'dashboard' && <DashboardTab />}
//         {activeTab === 'artists' && <ArtistsTab />}
//         {activeTab === 'updateDB' && <UpdateDBTab />}
//         {activeTab === 'requests' && <RequestsTab />}
//         {activeTab === 'history' && <HistoryTab />}
//         {activeTab === 'artistProfile' && selectedArtist && <ArtistProfileTab />}
//       </div>
      
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         body {
//           margin: 0;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { FiUsers, FiDatabase, FiUpload, FiMail, FiTrash2, FiEye, FiLoader, FiMoreVertical } from 'react-icons/fi';

// const AdminDashboard = () => {
//   // State for all data
//   const [artistStores, setArtistStores] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [requestHistory, setRequestHistory] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [selectedArtist, setSelectedArtist] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDropdown, setShowDropdown] = useState(null);
  
//   // Loading states
//   const [loading, setLoading] = useState({
//     artists: false,
//     requests: false,
//     history: false,
//     actions: false,
//     upload: false
//   });

//   // Error states
//   const [error, setError] = useState({
//     artists: null,
//     requests: null,
//     history: null
//   });

//   // Fetch all initial data
//   useEffect(() => {
//     fetchArtists();
//     fetchRequests();
//     // fetchRequestHistory();
//   }, []);

//   // Fetch artist stores from API
//   const fetchArtists = async () => {
//     setLoading(prev => ({ ...prev, artists: true }));
//     setError(prev => ({ ...prev, artists: null }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/artist/artists');
//       if (!res.ok) throw new Error(`Failed to fetch artists: ${res.status}`);
      
//       const data = await res.json();
      
//       // Transform the data to extract needed fields
//       const formattedArtists = data.artists.map(artist => ({
//         id: artist._id,
//         artistID: artist.artistID,
//         name: artist.displayName,
//         realName: artist.identity?.realName || 'Not specified',
//         location: artist.identity?.location || 'Not specified',
//         genres: artist.artistic_background?.genres?.join(', ') || 'Not specified',
//         imageUrl: artist.imageUrl,
//         joined: new Date(artist._creationTime).toISOString(),
//         status: 'active'
//       }));
      
//       setArtistStores(formattedArtists);
    
//     } catch (err) {
//       console.error("Fetch artists error:", err);
//       setError(prev => ({ ...prev, artists: err.message }));
//       setArtistStores([]);
//     } finally {
//       setLoading(prev => ({ ...prev, artists: false }));
//     }
//   };

//   // Fetch pending requests
//   const fetchRequests = async () => {
//     setLoading(prev => ({ ...prev, requests: true }));
//     setError(prev => ({ ...prev, requests: null }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/artist-requests');
//       if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
      
//       const data = await res.json();
//       setRequests(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Fetch requests error:", err);
//       setError(prev => ({ ...prev, requests: err.message }));
//       setRequests([]);
//     } finally {
//       setLoading(prev => ({ ...prev, requests: false }));
//     }
//   };

//   // Fetch request history
//   // const fetchRequestHistory = async () => {
//   //   setLoading(prev => ({ ...prev, history: true }));
//   //   setError(prev => ({ ...prev, history: null }));
    
//   //   try {
//   //     const res = await fetch('https://netgenome-1.onrender.com/api/requests/history');
//   //     if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
      
//   //     const data = await res.json();
//   //     setRequestHistory(Array.isArray(data) ? data : []);
//   //   } catch (err) {
//   //     console.error("Fetch history error:", err);
//   //     setError(prev => ({ ...prev, history: err.message }));
//   //     setRequestHistory([]);
//   //   } finally {
//   //     setLoading(prev => ({ ...prev, history: false }));
//   //   }
//   // };

//   // Handle approve request
//   const handleApprove = async (_id) => {
//     setLoading(prev => ({ ...prev, actions: true }));
  
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/request/approve', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ requestId: _id }),
//       });
      
//       if (!res.ok) throw new Error('Approval failed');
      
//       // Refresh data
//       await Promise.all([fetchArtists(), fetchRequests()]);//, fetchRequestHistory()
      
//       alert("Request approved successfully!");
//     } catch (err) {
//       console.error("Approve error:", err);
//       alert(`Failed to approve: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, actions: false }));
//     }
//   };

//   // Handle reject request
//   const handleReject = async (_id) => {
//     setLoading(prev => ({ ...prev, actions: true }));
    
//     try {
//       const res = await fetch('https://netgenome-1.onrender.com/api/request/reject', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ requestId: _id }),
//       });

//       if (!res.ok) throw new Error('Rejection failed');
      
//       // Refresh data
//       await Promise.all([fetchRequests(), fetchRequestHistory()]);
      
//       alert("Request rejected successfully!");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert(`Failed to reject: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, actions: false }));
//     }
//   };

//   // Handle file upload for database update
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;
    
//     setLoading(prev => ({ ...prev, upload: true }));
    
//     try {
//       const formData = new FormData();
//       formData.append('file', selectedFile);
      
//       const res = await fetch('https://netgenome-1.onrender.com/api/upload-magazine', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) throw new Error('Upload failed');
      
//       // Refresh artists after update
//       await fetchArtists();
//       setSelectedFile(null);
      
//       alert("Database updated successfully!");
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert(`Failed to upload: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, upload: false }));
//     }
//   };

//   // Delete artist store
//   const deleteArtistStore = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this artist store?')) return;
    
//     setLoading(prev => ({ ...prev, actions: true }));
    
//     try {
//       const res = await fetch(`https://netgenome-1.onrender.com/api/artists/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) throw new Error('Deletion failed');
      
//       // Refresh artists
//       await fetchArtists();
      
//       alert("Artist store deleted successfully!");
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert(`Failed to delete: ${err.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, actions: false }));
//     }
//   };

//   // View artist profile
//   const viewArtistProfile = (artist) => {
//     setSelectedArtist(artist);
//     setActiveTab('artistProfile');
//   };

//   // Toggle dropdown menu for artist actions
//   const toggleDropdown = (artistId, e) => {
//     e.stopPropagation();
//     setShowDropdown(showDropdown === artistId ? null : artistId);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => {
//       setShowDropdown(null);
//     };
    
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   // Loading spinner component
//   const LoadingSpinner = () => (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
//       <FiLoader className="spin" style={{ animation: 'spin 1s linear infinite', fontSize: '24px' }} />
//     </div>
//   );

//   // Error display component
//   const ErrorDisplay = ({ message }) => (
//     <div style={{ 
//       backgroundColor: '#ffe6e6',
//       color: '#d32f2f',
//       padding: '15px',
//       borderRadius: '4px',
//       margin: '20px 0',
//       border: '1px solid #ffcccc'
//     }}>
//       <strong>Error:</strong> {message}
//       <button 
//         onClick={() => window.location.reload()}
//         style={{
//           marginLeft: '10px',
//           padding: '5px 10px',
//           backgroundColor: '#d32f2f',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Retry
//       </button>
//     </div>
//   );

//   // Dashboard Tab
//   const DashboardTab = () => (
//     <div>
//       <h1 style={{ color: '#1a1a1a', marginBottom: '30px' }}>Admin Dashboard</h1>
      
//       <div className="stats-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
//         <div className="card" style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #d4a373'
//         }}>
//           <h3 style={{ color: '#666', marginTop: 0 }}>Total Artist Stores</h3>
//           {loading.artists ? (
//             <LoadingSpinner />
//           ) : error.artists ? (
//             <p style={{ color: '#d32f2f' }}>Error loading count</p>
//           ) : (
//             <>
//               <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>{artistStores.length}</p>
//               <p style={{ color: '#666', margin: 0 }}>Registered artists</p>
//             </>
//           )}
//         </div>
        
//         <div className="card" style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//           borderLeft: '4px solid #a5a58d'
//         }}>
//           <h3 style={{ color: '#666', marginTop: 0 }}>Pending Requests</h3>
//           {loading.requests ? (
//             <LoadingSpinner />
//           ) : error.requests ? (
//             <p style={{ color: '#d32f2f' }}>Error loading requests</p>
//           ) : (
//             <>
//               <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>
//                 {Array.isArray(requests) ? requests.length : 0}
//               </p>
//               <p style={{ color: '#666', margin: 0 }}>Requiring your attention</p>
//             </>
//           )}
//         </div>
//       </div>
      
//       <div className="recent-artists" style={{
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//       }}>
//         <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>Recent Artist Stores</h2>
        
//         {loading.artists ? (
//           <LoadingSpinner />
//         ) : error.artists ? (
//           <ErrorDisplay message={error.artists} />
//         ) : artistStores.length === 0 ? (
//           <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No artist stores found</p>
//         ) : (
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
//               <thead>
//                 <tr style={{ borderBottom: '1px solid #eee' }}>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Artist ID</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Display Name</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Real Name</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Joined</th>
//                   <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {artistStores.slice(0, 10).map(artist => (
//                   <tr key={artist.id} style={{ borderBottom: '1px solid #eee' }}>
//                     <td style={{ padding: '12px' }}>{artist.artistID}</td>
//                     <td style={{ padding: '12px' }}>{artist.name}</td>
//                     <td style={{ padding: '12px' }}>{artist.realName}</td>
//                     <td style={{ padding: '12px' }}>{new Date(artist.joined).toLocaleDateString()}</td>
//                     <td style={{ padding: '12px', position: 'relative' }}>
//                       <button 
//                         onClick={(e) => toggleDropdown(artist.id, e)}
//                         style={{
//                           backgroundColor: 'transparent',
//                           border: 'none',
//                           color: '#666',
//                           cursor: 'pointer',
//                           padding: '5px'
//                         }}
//                       >
//                         <FiMoreVertical />
//                       </button>
                      
//                       {showDropdown === artist.id && (
//                         <div style={{
//                           position: 'absolute',
//                           right: '10px',
//                           top: '40px',
//                           backgroundColor: 'white',
//                           borderRadius: '4px',
//                           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                           zIndex: 100,
//                           minWidth: '150px'
//                         }}>
//                           <button 
//                             onClick={() => {
//                               viewArtistProfile(artist);
//                               setShowDropdown(null);
//                             }}
//                             style={{
//                               width: '100%',
//                               textAlign: 'left',
//                               padding: '8px 12px',
//                               backgroundColor: 'transparent',
//                               border: 'none',
//                               cursor: 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px',
//                               color: '#1a1a1a'
//                             }}
//                           >
//                             <FiEye /> View Details
//                           </button>
//                           <button 
//                             onClick={() => {
//                               deleteArtistStore(artist.id);
//                               setShowDropdown(null);
//                             }}
//                             disabled={loading.actions}
//                             style={{
//                               width: '100%',
//                               textAlign: 'left',
//                               padding: '8px 12px',
//                               backgroundColor: 'transparent',
//                               border: 'none',
//                               cursor: loading.actions ? 'not-allowed' : 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px',
//                               color: loading.actions ? '#ccc' : '#d32f2f'
//                             }}
//                           >
//                             <FiTrash2 /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Artist Stores Tab
// // Artist Stores Tab
// const ArtistsTab = () => {
//   // We'll move the searchTerm state handling here to better manage focus
//   const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

//   // Update the main searchTerm when local search changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(localSearchTerm);
//     }, 300); // Add a small delay to prevent too many re-renders

//     return () => clearTimeout(timer);
//   }, [localSearchTerm]);

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h1 style={{ color: '#1a1a1a', margin: 0 }}>Artist Stores ({artistStores.length})</h1>
//         <div>
//           <input 
//             type="text" 
//             placeholder="Search artists by name or ID..." 
//             value={localSearchTerm}
//             onChange={(e) => setLocalSearchTerm(e.target.value)}
//             style={{
//               padding: '10px',
//               borderRadius: '4px',
//               border: '1px solid #ddd',
//               width: '300px'
//             }}
//           />
//         </div>
//       </div>
      
//       {loading.artists ? (
//         <LoadingSpinner />
//       ) : error.artists ? (
//         <ErrorDisplay message={error.artists} />
//       ) : (
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         }}>
//           {artistStores.length === 0 ? (
//             <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
//               {localSearchTerm ? 'No matching artists found' : 'No artist stores available'}
//             </p>
//           ) : (
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
//                 <thead>
//                   <tr style={{ borderBottom: '1px solid #eee' }}>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Artist ID</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Display Name</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Real Name</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Location</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Genres</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Joined</th>
//                     <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {artistStores
//                     .filter(artist => 
//                       artist.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
//                       artist.artistID.toLowerCase().includes(localSearchTerm.toLowerCase())
//                     )
//                     .map(artist => (
//                       <tr key={artist.id} style={{ borderBottom: '1px solid #eee' }}>
//                         <td style={{ padding: '12px' }}>{artist.artistID}</td>
//                         <td style={{ padding: '12px' }}>{artist.name}</td>
//                         <td style={{ padding: '12px' }}>{artist.realName}</td>
//                         <td style={{ padding: '12px' }}>{artist.location}</td>
//                         <td style={{ padding: '12px' }}>{artist.genres}</td>
//                         <td style={{ padding: '12px' }}>{new Date(artist.joined).toLocaleDateString()}</td>
//                         <td style={{ padding: '12px', position: 'relative' }}>
//                           <button 
//                             onClick={(e) => toggleDropdown(artist.id, e)}
//                             style={{
//                               backgroundColor: 'transparent',
//                               border: 'none',
//                               color: '#666',
//                               cursor: 'pointer',
//                               padding: '5px'
//                             }}
//                           >
//                             <FiMoreVertical />
//                           </button>
                          
//                           {showDropdown === artist.id && (
//                             <div style={{
//                               position: 'absolute',
//                               right: '10px',
//                               top: '40px',
//                               backgroundColor: 'white',
//                               borderRadius: '4px',
//                               boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                               zIndex: 100,
//                               minWidth: '150px'
//                             }}>
//                               <button 
//                                 onClick={() => {
//                                   viewArtistProfile(artist);
//                                   setShowDropdown(null);
//                                 }}
//                                 style={{
//                                   width: '100%',
//                                   textAlign: 'left',
//                                   padding: '8px 12px',
//                                   backgroundColor: 'transparent',
//                                   border: 'none',
//                                   cursor: 'pointer',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   gap: '8px',
//                                   color: '#1a1a1a'
//                                 }}
//                               >
//                                 <FiEye /> View Details
//                               </button>
//                               <button 
//                                 onClick={() => {
//                                   deleteArtistStore(artist.id);
//                                   setShowDropdown(null);
//                                 }}
//                                 disabled={loading.actions}
//                                 style={{
//                                   width: '100%',
//                                   textAlign: 'left',
//                                   padding: '8px 12px',
//                                   backgroundColor: 'transparent',
//                                   border: 'none',
//                                   cursor: loading.actions ? 'not-allowed' : 'pointer',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   gap: '8px',
//                                   color: loading.actions ? '#ccc' : '#d32f2f'
//                                 }}
//                               >
//                                 <FiTrash2 /> Delete
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

//   // Requests Tab
//   const RequestsTab = () => (
//     <div>
//       <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Pending Requests</h1>
      
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//       }}>
//         {loading.requests ? (
//           <LoadingSpinner />
//         ) : error.requests ? (
//           <ErrorDisplay message={error.requests} />
//         ) : requests.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//             <FiMail style={{ fontSize: '48px', marginBottom: '15px', color: '#d4a373' }} />
//             <h3>No pending requests</h3>
//             <p>All requests have been processed</p>
//           </div>
//         ) : (
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid #eee' }}>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Status</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map(request => (
//                 <tr key={request._id} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px' }}>{request.email}</td>
//                   <td style={{ padding: '12px' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       backgroundColor: request.status === 'approved' ? '#e6f4ea' : 
//                                       request.status === 'rejected' ? '#ffe6e6' : '#fff8e6',
//                       color: request.status === 'approved' ? '#2e7d32' : 
//                             request.status === 'rejected' ? '#d32f2f' : '#ff9800'
//                     }}>
//                       {request.status || 'Pending'}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     {request.status === 'pending' && (
//                       <>
//                         <button 
//                           onClick={() => handleApprove(request._id)}
//                           disabled={loading.actions}
//                           style={{
//                             padding: '6px 12px',
//                             backgroundColor: loading.actions ? '#ccc' : '#d4a373',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: loading.actions ? 'not-allowed' : 'pointer',
//                             marginRight: '10px'
//                           }}
//                         >
//                           Approve
//                         </button>
//                         <button 
//                           onClick={() => handleReject(request._id)}
//                           disabled={loading.actions}
//                           style={{
//                             padding: '6px 12px',
//                             backgroundColor: loading.actions ? '#f5f5f5' : '#f5f5f5',
//                             color: loading.actions ? '#999' : '#d32f2f',
//                             border: '1px solid #ddd',
//                             borderRadius: '4px',
//                             cursor: loading.actions ? 'not-allowed' : 'pointer'
//                           }}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );

//   // Request History Tab
//   const HistoryTab = () => (
//     <div>
//       <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Request History</h1>
      
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         padding: '20px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//       }}>
//         {loading.history ? (
//           <LoadingSpinner />
//         ) : error.history ? (
//           <ErrorDisplay message={error.history} />
//         ) : requestHistory.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//             <FiMail style={{ fontSize: '48px', marginBottom: '15px', color: '#d4a373' }} />
//             <h3>No request history</h3>
//             <p>Processed requests will appear here</p>
//           </div>
//         ) : (
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
//             <thead>
//               <tr style={{ borderBottom: '1px solid #eee' }}>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
//                 <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requestHistory.map(request => (
//                 <tr key={request._id} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px' }}>{request.email}</td>
//                   <td style={{ padding: '12px' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       backgroundColor: request.status === 'approved' ? '#e6f4ea' : '#ffe6e6',
//                       color: request.status === 'approved' ? '#2e7d32' : '#d32f2f'
//                     }}>
//                       {request.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );

//   // Update Database Tab
//   const UpdateDBTab = () => {
//     const [fileError, setFileError] = useState(null);

//     const handleFileChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         // Check if file is PDF
//         if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
//           setSelectedFile(file);
//           setFileError(null);
//         } else {
//           setSelectedFile(null);
//           setFileError('Please upload a PDF file only');
//         }
//       }
//     };

//     return (
//       <div>
//         <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Update Database</h1>
        
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '30px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//           maxWidth: '600px',
//           margin: '0 auto',
//           textAlign: 'center'
//         }}>
//           <div style={{
//             border: '2px dashed #d4a373',
//             borderRadius: '8px',
//             padding: '40px 20px',
//             marginBottom: '20px',
//             backgroundColor: '#fffaf5'
//           }}>
//             <FiUpload style={{ fontSize: '48px', color: '#d4a373', marginBottom: '15px' }} />
//             <h3 style={{ color: '#1a1a1a', marginTop: 0 }}>Upload Magazine File</h3>
//             <p style={{ color: '#666', marginBottom: '20px' }}>Select a PDF file to update the artist database</p>
            
//             <label style={{
//               display: 'inline-block',
//               padding: '10px 20px',
//               backgroundColor: '#d4a373',
//               color: 'white',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               marginBottom: '10px'
//             }}>
//               Choose PDF File
//               <input 
//                 type="file" 
//                 onChange={handleFileChange}
//                 accept=".pdf,application/pdf"
//                 style={{ display: 'none' }}
//                 disabled={loading.upload}
//               />
//             </label>
            
//             {selectedFile && (
//               <p style={{ color: '#1a1a1a', margin: '10px 0' }}>
//                 Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
//               </p>
//             )}
            
//             {fileError && (
//               <p style={{ 
//                 color: '#d32f2f', 
//                 margin: '10px 0',
//                 backgroundColor: '#ffe6e6',
//                 padding: '8px',
//                 borderRadius: '4px'
//               }}>
//                 {fileError}
//               </p>
//             )}
//           </div>
          
//           <button 
//             onClick={handleUpload}
//             disabled={!selectedFile || loading.upload || fileError}
//             style={{
//               padding: '12px 24px',
//               backgroundColor: !selectedFile || fileError ? '#ccc' : loading.upload ? '#a5a58d' : '#6b705c',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: (!selectedFile || fileError) ? 'not-allowed' : 'pointer',
//               fontSize: '16px',
//               width: '100%',
//               maxWidth: '300px'
//             }}
//           >
//             {loading.upload ? 'Uploading...' : 'Update Database'}
//           </button>
          
//           <div style={{ marginTop: '30px', textAlign: 'left', color: '#666' }}>
//             <h4 style={{ color: '#1a1a1a' }}>Instructions:</h4>
//             <ul style={{ paddingLeft: '20px' }}>
//               <li>Upload a PDF file containing artist information</li>
//               <li>The file should include store name, owner, email, and other relevant details</li>
//               <li>Existing records will be updated, new records will be added</li>
//               <li>This process may take a few minutes depending on file size</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Artist Profile Tab
//   const ArtistProfileTab = () => {
//     if (!selectedArtist) return null;
    
//     return (
//       <div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h1 style={{ color: '#1a1a1a', margin: 0 }}>Artist Profile</h1>
//           <button 
//             onClick={() => setActiveTab('artists')}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#f5f5f5',
//               color: '#1a1a1a',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}
//           >
//             Back to Artists
//           </button>
//         </div>
        
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           padding: '30px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         }}>
//           <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
//             <div style={{
//               width: '120px',
//               height: '120px',
//               borderRadius: '60px',
//               backgroundColor: '#f0f0f0',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#999',
//               fontSize: '40px',
//               fontWeight: 'bold'
//             }}>
//               {selectedArtist.name.charAt(0)}
//             </div>
            
//             <div style={{ flex: 1 }}>
//               <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>{selectedArtist.name}</h2>
//               <p style={{ color: '#666', marginBottom: '15px' }}>Artist ID: {selectedArtist.artistID}</p>
              
//               <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
//                 <span style={{
//                   padding: '4px 12px',
//                   borderRadius: '20px',
//                   backgroundColor: '#e6f4ea',
//                   color: '#2e7d32',
//                   fontSize: '14px'
//                 }}>
//                   Active
//                 </span>
//                 <span style={{
//                   padding: '4px 12px',
//                   borderRadius: '20px',
//                   backgroundColor: '#f0f0f0',
//                   color: '#666',
//                   fontSize: '14px'
//                 }}>
//                   Member since {new Date(selectedArtist.joined).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//             <div style={{
//               backgroundColor: '#fafafa',
//               borderRadius: '8px',
//               padding: '20px'
//             }}>
//               <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '15px' }}>Basic Information</h3>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Real Name</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.realName}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Location</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.location}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Genres</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.genres}</p>
//               </div>
//             </div>
            
//             <div style={{
//               backgroundColor: '#fafafa',
//               borderRadius: '8px',
//               padding: '20px'
//             }}>
//               <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '15px' }}>System Information</h3>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Artist ID</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.artistID}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Database ID</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.id}</p>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Registration Date</p>
//                 <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>
//                   {new Date(selectedArtist.joined).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Sidebar Component
//   const Sidebar = () => (
//     <div style={{
//       width: '250px',
//       backgroundColor: '#1a1a1a',
//       color: '#e6e6e6',
//       height: '100vh',
//       position: 'fixed',
//       padding: '20px 0',
//       left: 0,
//       top: 0,
//       overflowY: 'auto'
//     }}>
//       <div style={{
//         padding: '0 20px 20px',
//         borderBottom: '1px solid #333',
//         marginBottom: '20px'
//       }}>
//         <h2 style={{ color: '#d4a373', margin: 0 }}>Artisan Admin</h2>
//       </div>
      
//       <nav>
//         <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('dashboard')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'dashboard' ? '#333' : 'transparent',
//                 color: activeTab === 'dashboard' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiDatabase /> Dashboard
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('artists')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'artists' ? '#333' : 'transparent',
//                 color: activeTab === 'artists' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiUsers /> Artist Stores
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('requests')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'requests' ? '#333' : 'transparent',
//                 color: activeTab === 'requests' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiMail /> Requests
//             </button>
//           </li>
//           <li style={{ marginBottom: '5px' }}>
//             <button 
//               onClick={() => setActiveTab('updateDB')}
//               style={{
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 backgroundColor: activeTab === 'updateDB' ? '#333' : 'transparent',
//                 color: activeTab === 'updateDB' ? '#d4a373' : '#e6e6e6',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 fontSize: '16px'
//               }}
//             >
//               <FiUpload /> Update DB
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );

//   return (
//     <div style={{ 
//       backgroundColor: '#f5f5f5', 
//       minHeight: '100vh',
//       marginLeft: '250px' // Make space for fixed sidebar
//     }}>
//       <Sidebar />
      
//       <div style={{ padding: '30px' }}>
//         {activeTab === 'dashboard' && <DashboardTab />}
//         {activeTab === 'artists' && <ArtistsTab />}
//         {activeTab === 'updateDB' && <UpdateDBTab />}
//         {activeTab === 'requests' && <RequestsTab />}
//         {activeTab === 'history' && <HistoryTab />}
//         {activeTab === 'artistProfile' && selectedArtist && <ArtistProfileTab />}
//       </div>
      
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         .spin {
//           animation: spin 1s linear infinite;
//         }
//         body {
//           margin: 0;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';

import { FiUsers, FiDatabase, FiUpload, FiMail, FiTrash2, FiEye, FiLoader, FiMoreVertical, FiDownload } from 'react-icons/fi';
const AdminDashboard = () => {
  // State for all data
  const [artistStores, setArtistStores] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    artists: false,
    requests: false,
    history: false,
    actions: false,
    upload: false
  });

  // Error states
  const [error, setError] = useState({
    artists: null,
    requests: null,
    history: null
  });

  // Fetch all initial data
  useEffect(() => {
    fetchArtists();
    fetchRequests();
    // fetchRequestHistory();
  }, []);

  // Fetch artist stores from API
  const fetchArtists = async () => {
    setLoading(prev => ({ ...prev, artists: true }));
    setError(prev => ({ ...prev, artists: null }));
    
    try {
      const res = await fetch('https://netgenome-1.onrender.com/api/artist/artists');
      if (!res.ok) throw new Error(`Failed to fetch artists: ${res.status}`);
      
      const data = await res.json();
      
      // Transform the data to extract needed fields
      const formattedArtists = data.artists.map(artist => ({
        id: artist._id,
        artistID: artist.artistID,
        name: artist.displayName,
        realName: artist.identity?.realName || 'Not specified',
        location: artist.identity?.location || 'Not specified',
        genres: artist.artistic_background?.genres?.join(', ') || 'Not specified',
        imageUrl: artist.imageUrl,
        joined: new Date(artist._creationTime).toISOString(),
        status: 'active'
      }));
      
      setArtistStores(formattedArtists);
    
    } catch (err) {
      console.error("Fetch artists error:", err);
      setError(prev => ({ ...prev, artists: err.message }));
      setArtistStores([]);
    } finally {
      setLoading(prev => ({ ...prev, artists: false }));
    }
  };

  // Fetch pending requests
  const fetchRequests = async () => {
    setLoading(prev => ({ ...prev, requests: true }));
    setError(prev => ({ ...prev, requests: null }));
    
    try {
      const res = await fetch('https://netgenome-1.onrender.com/api/artist-requests');
      if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
      
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch requests error:", err);
      setError(prev => ({ ...prev, requests: err.message }));
      setRequests([]);
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  // Handle approve request
  const handleApprove = async (_id) => {
    setLoading(prev => ({ ...prev, actions: true }));
  
    try {
      const res = await fetch('https://netgenome-1.onrender.com/api/request/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: _id }),
      });
      
      if (!res.ok) throw new Error('Approval failed');
      
      // Refresh data
      await Promise.all([fetchArtists(), fetchRequests()]);
      
      alert("Request approved successfully!");
    } catch (err) {
      console.error("Approve error:", err);
      alert(`Failed to approve: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle reject request
  const handleReject = async (_id) => {
    setLoading(prev => ({ ...prev, actions: true }));
    
    try {
      const res = await fetch('https://netgenome-1.onrender.com/api/request/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: _id }),
      });

      if (!res.ok) throw new Error('Rejection failed');
      
      // Refresh data
      await Promise.all([fetchRequests(), fetchRequestHistory()]);
      
      alert("Request rejected successfully!");
    } catch (err) {
      console.error("Reject error:", err);
      alert(`Failed to reject: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle file upload for database update
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(prev => ({ ...prev, upload: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const res = await fetch('https://netgenome-1.onrender.com/api/upload-magazine', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      // Refresh artists after update
      await fetchArtists();
      setSelectedFile(null);
      
      alert("Database updated successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  // Delete artist store
  const deleteArtistStore = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artist store?')) return;
    
    setLoading(prev => ({ ...prev, actions: true }));
    
    try {
      const res = await fetch(`https://netgenome-1.onrender.com/api/artists/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Deletion failed');
      
      // Refresh artists
      await fetchArtists();
      
      alert("Artist store deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // View artist profile
  const viewArtistProfile = (artist) => {
    setSelectedArtist(artist);
    setActiveTab('artistProfile');
  };

  // Toggle dropdown menu for artist actions
  const toggleDropdown = (artistId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === artistId ? null : artistId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <FiLoader className="spin" style={{ animation: 'spin 1s linear infinite', fontSize: '24px' }} />
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ message }) => (
    <div style={{ 
      backgroundColor: '#ffe6e6',
      color: '#d32f2f',
      padding: '15px',
      borderRadius: '4px',
      margin: '20px 0',
      border: '1px solid #ffcccc'
    }}>
      <strong>Error:</strong> {message}
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginLeft: '10px',
          padding: '5px 10px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );

  // Dashboard Tab
  const DashboardTab = () => (
    <div>
      <h1 style={{ color: '#1a1a1a', marginBottom: '30px' }}>Admin Dashboard</h1>
      
      <div className="stats-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #d4a373'
        }}>
          <h3 style={{ color: '#666', marginTop: 0 }}>Total Artist Stores</h3>
          {loading.artists ? (
            <LoadingSpinner />
          ) : error.artists ? (
            <p style={{ color: '#d32f2f' }}>Error loading count</p>
          ) : (
            <>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>{artistStores.length}</p>
              <p style={{ color: '#666', margin: 0 }}>Registered artists</p>
            </>
          )}
        </div>
        
        <div className="card" style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #a5a58d'
        }}>
          <h3 style={{ color: '#666', marginTop: 0 }}> Requests</h3>
          {loading.requests ? (
            <LoadingSpinner />
          ) : error.requests ? (
            <p style={{ color: '#d32f2f' }}>Error loading requests</p>
          ) : (
            <>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '10px 0' }}>
                {Array.isArray(requests) ? requests.length : 0}
              </p>
              <p style={{ color: '#666', margin: 0 }}>Requiring your attention</p>
            </>
          )}
        </div>
      </div>
      
      <div className="recent-artists" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>Recent Artist Stores</h2>
        
        {loading.artists ? (
          <LoadingSpinner />
        ) : error.artists ? (
          <ErrorDisplay message={error.artists} />
        ) : artistStores.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No artist stores found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Artist ID</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Display Name</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Real Name</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Joined</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artistStores.slice(0, 10).map(artist => (
                  <tr key={artist.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{artist.artistID}</td>
                    <td style={{ padding: '12px' }}>{artist.name}</td>
                    <td style={{ padding: '12px' }}>{artist.realName}</td>
                    <td style={{ padding: '12px' }}>{new Date(artist.joined).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', position: 'relative' }}>
                      <button 
                        onClick={(e) => toggleDropdown(artist.id, e)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#666',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                      >
                        <FiMoreVertical />
                      </button>
                      
                      {showDropdown === artist.id && (
                        <div style={{
                          position: 'absolute',
                          right: '10px',
                          top: '40px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          zIndex: 100,
                          minWidth: '150px'
                        }}>
                          <button 
                            onClick={() => {
                              viewArtistProfile(artist);
                              setShowDropdown(null);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#1a1a1a'
                            }}
                          >
                            <FiEye /> View Details
                          </button>
                          {/* <button 
                            onClick={() => {
                              deleteArtistStore(artist.id);
                              setShowDropdown(null);
                            }}
                            disabled={loading.actions}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: loading.actions ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: loading.actions ? '#ccc' : '#d32f2f'
                            }}
                          >
                            <FiTrash2 /> Delete
                          </button> */}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Artist Stores Tab
  const ArtistsTab = () => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    useEffect(() => {
      const timer = setTimeout(() => {
        setSearchTerm(localSearchTerm);
      }, 300);

      return () => clearTimeout(timer);
    }, [localSearchTerm]);

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#1a1a1a', margin: 0 }}>Artist Stores ({artistStores.length})</h1>
          <div>
            <input 
              type="text" 
              placeholder="Search artists by name or ID..." 
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '300px'
              }}
            />
          </div>
        </div>
        
        {loading.artists ? (
          <LoadingSpinner />
        ) : error.artists ? (
          <ErrorDisplay message={error.artists} />
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {artistStores.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                {localSearchTerm ? 'No matching artists found' : 'No artist stores available'}
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Artist ID</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Display Name</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Real Name</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Location</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Genres</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Joined</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artistStores
                      .filter(artist => 
                        artist.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
                        artist.artistID.toLowerCase().includes(localSearchTerm.toLowerCase())
                      )
                      .map(artist => (
                        <tr key={artist.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{artist.artistID}</td>
                          <td style={{ padding: '12px' }}>{artist.name}</td>
                          <td style={{ padding: '12px' }}>{artist.realName}</td>
                          <td style={{ padding: '12px' }}>{artist.location}</td>
                          <td style={{ padding: '12px' }}>{artist.genres}</td>
                          <td style={{ padding: '12px' }}>{new Date(artist.joined).toLocaleDateString()}</td>
                          <td style={{ padding: '12px', position: 'relative' }}>
                            <button 
                              onClick={(e) => toggleDropdown(artist.id, e)}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                padding: '5px'
                              }}
                            >
                              <FiMoreVertical />
                            </button>
                            
                            {showDropdown === artist.id && (
                              <div style={{
                                position: 'absolute',
                                right: '10px',
                                top: '40px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                minWidth: '150px'
                              }}>
                                <button 
                                  onClick={() => {
                                    viewArtistProfile(artist);
                                    setShowDropdown(null);
                                  }}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#1a1a1a'
                                  }}
                                >
                                  <FiEye /> View Details
                                </button>
                                {/* <button 
                                  onClick={() => {
                                    deleteArtistStore(artist.id);
                                    setShowDropdown(null);
                                  }}
                                  disabled={loading.actions}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: loading.actions ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: loading.actions ? '#ccc' : '#d32f2f'
                                  }}
                                >
                                  <FiTrash2 /> Delete
                                </button> */}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Requests Tab
  const RequestsTab = () => (
    <div>
      <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Pending Requests</h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {loading.requests ? (
          <LoadingSpinner />
        ) : error.requests ? (
          <ErrorDisplay message={error.requests} />
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <FiMail style={{ fontSize: '48px', marginBottom: '15px', color: '#d4a373' }} />
            <h3>No pending requests</h3>
            <p>All requests have been processed</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{request.email}</td>
                  <td style={{ padding: '12px' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: request.status === 'approved' ? '#e6f4ea' : 
                                      request.status === 'rejected' ? '#ffe6e6' : '#fff8e6',
                      color: request.status === 'approved' ? '#2e7d32' : 
                            request.status === 'rejected' ? '#d32f2f' : '#ff9800'
                    }}>
                      {request.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(request._id)}
                          disabled={loading.actions}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: loading.actions ? '#ccc' : '#d4a373',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading.actions ? 'not-allowed' : 'pointer',
                            marginRight: '10px'
                          }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(request._id)}
                          disabled={loading.actions}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: loading.actions ? '#f5f5f5' : '#f5f5f5',
                            color: loading.actions ? '#999' : '#d32f2f',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: loading.actions ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Request History Tab
  const HistoryTab = () => (
    <div>
      <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Request History</h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {loading.history ? (
          <LoadingSpinner />
        ) : error.history ? (
          <ErrorDisplay message={error.history} />
        ) : requestHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <FiMail style={{ fontSize: '48px', marginBottom: '15px', color: '#d4a373' }} />
            <h3>No request history</h3>
            <p>Processed requests will appear here</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requestHistory.map(request => (
                <tr key={request._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{request.email}</td>
                  <td style={{ padding: '12px' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: request.status === 'approved' ? '#e6f4ea' : '#ffe6e6',
                      color: request.status === 'approved' ? '#2e7d32' : '#d32f2f'
                    }}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Update Database Tab
// Update Database Tab
const UpdateDBTab = () => {
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (file) {
      // Check if file is PDF or DOC/DOCX
      const validTypes = ['application/pdf', 
                         'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      
      const isTypeValid = validTypes.includes(file.type) || 
                         validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isTypeValid) {
        setSelectedFile(file);
        setFileError(null);
      } else {
        setSelectedFile(null);
        setFileError('Please upload a PDF or Word document only');
      }
    }
  };

  const downloadFile = () => {
    if (!selectedFile) return;
    
    // Create a download link
    const url = URL.createObjectURL(selectedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div>
      <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>Update Database</h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? '#d4a373' : '#d4a373'}`,
            borderRadius: '8px',
            padding: '40px 20px',
            marginBottom: '20px',
            backgroundColor: isDragging ? '#fff8f0' : '#fffaf5',
            transition: 'all 0.3s ease'
          }}
        >
          <FiUpload style={{ fontSize: '48px', color: '#d4a373', marginBottom: '15px' }} />
          <h3 style={{ color: '#1a1a1a', marginTop: 0 }}>Upload Magazine File</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Drag and drop a PDF or Word document here, or click to select
          </p>
          
          <label style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#d4a373',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}>
            Choose File
            <input 
              type="file" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              disabled={loading.upload}
            />
          </label>
          
          {selectedFile && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ color: '#1a1a1a', margin: '5px 0' }}>
                Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
              </p>
              <button 
                onClick={downloadFile}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FiDownload /> Download
              </button>
            </div>
          )}
          
          {fileError && (
            <p style={{ 
              color: '#d32f2f', 
              margin: '10px 0',
              backgroundColor: '#ffe6e6',
              padding: '8px',
              borderRadius: '4px'
            }}>
              {fileError}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || loading.upload || fileError}
            style={{
              padding: '12px 24px',
              backgroundColor: !selectedFile || fileError ? '#ccc' : loading.upload ? '#a5a58d' : '#6b705c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (!selectedFile || fileError) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              minWidth: '200px'
            }}
          >
            {loading.upload ? 'Uploading...' : 'Update Database'}
          </button>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'left', color: '#666' }}>
          <h4 style={{ color: '#1a1a1a' }}>Instructions:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Upload a PDF or Word document containing artist information</li>
            <li>You can drag and drop files or click to select</li>
            <li>The file should include store name, owner, email, and other relevant details</li>
            <li>Existing records will be updated, new records will be added</li>
            <li>This process may take a few minutes depending on file size</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

  // Artist Profile Tab
  const ArtistProfileTab = () => {
    if (!selectedArtist) return null;
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#1a1a1a', margin: 0 }}>Artist Profile</h1>
          <button 
            onClick={() => setActiveTab('artists')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              color: '#1a1a1a',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Back to Artists
          </button>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '40px',
              fontWeight: 'bold'
            }}>
              {selectedArtist.name.charAt(0)}
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>{selectedArtist.name}</h2>
              <p style={{ color: '#666', marginBottom: '15px' }}>Artist ID: {selectedArtist.artistID}</p>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#e6f4ea',
                  color: '#2e7d32',
                  fontSize: '14px'
                }}>
                  Active
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#f0f0f0',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Member since {new Date(selectedArtist.joined).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '15px' }}>Basic Information</h3>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Real Name</p>
                <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.realName}</p>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Location</p>
                <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.location}</p>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Genres</p>
                <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.genres}</p>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '15px' }}>System Information</h3>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Artist ID</p>
                <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.artistID}</p>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Database ID</p>
                <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>{selectedArtist.id}</p>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>Registration Date</p>
                <p style={{ color: '#1a1a1a', margin: '5px 0', fontWeight: '500' }}>
                  {new Date(selectedArtist.joined).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar Component
  const Sidebar = () => (
    <div style={{
      width: '250px',
      backgroundColor: '#1a1a1a',
      color: '#e6e6e6',
      height: '100vh',
      position: 'fixed',
      padding: '20px 0',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      <div style={{
        padding: '0 20px 20px',
        borderBottom: '1px solid #333',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Placeholder logo - replace with your actual logo later */}

        <img src={"./logo.png"}></img>

      </div>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '5px' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 20px',
                backgroundColor: activeTab === 'dashboard' ? '#333' : 'transparent',
                color: activeTab === 'dashboard' ? '#d4a373' : '#e6e6e6',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px'
              }}
            >
              <FiDatabase /> Dashboard
            </button>
          </li>
          <li style={{ marginBottom: '5px' }}>
            <button 
              onClick={() => setActiveTab('artists')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 20px',
                backgroundColor: activeTab === 'artists' ? '#333' : 'transparent',
                color: activeTab === 'artists' ? '#d4a373' : '#e6e6e6',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px'
              }}
            >
              <FiUsers /> Artist Stores
            </button>
          </li>
          <li style={{ marginBottom: '5px' }}>
            <button 
              onClick={() => setActiveTab('requests')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 20px',
                backgroundColor: activeTab === 'requests' ? '#333' : 'transparent',
                color: activeTab === 'requests' ? '#d4a373' : '#e6e6e6',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px'
              }}
            >
              <FiMail /> Requests
            </button>
          </li>
          <li style={{ marginBottom: '5px' }}>
            <button 
              onClick={() => setActiveTab('updateDB')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 20px',
                backgroundColor: activeTab === 'updateDB' ? '#333' : 'transparent',
                color: activeTab === 'updateDB' ? '#d4a373' : '#e6e6e6',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px'
              }}
            >
              <FiUpload /> Update DB
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      marginLeft: '250px' // Make space for fixed sidebar
    }}>
      <Sidebar />
      
      <div style={{ padding: '30px' }}>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'artists' && <ArtistsTab />}
        {activeTab === 'updateDB' && <UpdateDBTab />}
        {activeTab === 'requests' && <RequestsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'artistProfile' && selectedArtist && <ArtistProfileTab />}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;