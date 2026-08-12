const { useState, useEffect } = React;

// -----------------------------------------
// 1. ADMIN DASHBOARD COMPONENT
// -----------------------------------------
const AdminDashboard = () => {
    const [staffList, setStaffList] = useState([]);
    const [students, setStudents] = useState([]);
    const [allWorkloads, setAllWorkloads] = useState([]); 
    
    const [newStudentId, setNewStudentId] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentDept, setNewStudentDept] = useState('IT');
    const [newStudentYear, setNewStudentYear] = useState('1');

    const [newStaffUsername, setNewStaffUsername] = useState('');
    const [newStaffName, setNewStaffName] = useState('');
    const [newStaffDept, setNewStaffDept] = useState('IT');
    const [newStaffPassword, setNewStaffPassword] = useState('staff123');
    const [newStaffYear, setNewStaffYear] = useState('1');
    const [newStaffSubjectCode, setNewStaffSubjectCode] = useState('');
    const [newStaffSubjectName, setNewStaffSubjectName] = useState('');

    const [assignStaffUsername, setAssignStaffUsername] = useState('');
    const [assignDept, setAssignDept] = useState('IT');
    const [assignYear, setAssignYear] = useState('1');
    const [assignSubject, setAssignSubject] = useState('');
    const [assignSubjectName, setAssignSubjectName] = useState('');

    const [bulkDept, setBulkDept] = useState('IT');
    const [bulkYear, setBulkYear] = useState('1');
    const [fileUpload, setFileUpload] = useState(null);

    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    // ✨ PUDHU STATE FOR STAFF EDITING ✨
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [editStaffName, setEditStaffName] = useState('');
    const [editStaffDept, setEditStaffDept] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchStaff();
        fetchAllWorkloads(); 
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/students');
            const data = await res.json();
            if (data.success) setStudents(data.students);
        } catch (err) { console.error('Fetch error'); }
    };

    const fetchStaff = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/staff-by-dept?dept=all');
            const data = await res.json();
            if (data.success) setStaffList(data.staffList);
        } catch (err) { console.error('Fetch staff error'); }
    };

    const fetchAllWorkloads = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/workloads');
            const data = await res.json();
            if (data.success) setAllWorkloads(data.workloads);
        } catch (err) { console.error('Fetch workloads error'); }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/add-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: newStaffUsername, name: newStaffName, department: newStaffDept, 
                    password: newStaffPassword, year: newStaffYear, subjectCode: newStaffSubjectCode, 
                    subjectName: newStaffSubjectName
                })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(`✅ Staff '${newStaffName}' & Subject registered successfully!`);
                setStaffList(data.staffList);
                fetchAllWorkloads(); 
                setNewStaffUsername(''); setNewStaffName(''); setNewStaffPassword('staff123');
                setNewStaffSubjectCode(''); setNewStaffSubjectName('');
            } else {
                setError(data.message || 'Failed to add staff');
            }
        } catch (err) {
            setError('Failed to connect to backend server.');
        }
    };

    // ✨ PUDHU FUNCTION: DELETE STAFF ✨
    const handleDeleteStaff = async (username) => {
        if (!window.confirm(`Are you sure you want to delete Staff ID: ${username}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/staff/${username}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setMsg('🗑️ Staff deleted successfully!');
                fetchStaff();
                fetchAllWorkloads();
            } else {
                setError(data.message || 'Failed to delete staff');
            }
        } catch (err) { setError('Failed to delete staff.'); }
    };

    // ✨ PUDHU FUNCTION: EDIT STAFF ✨
    const startEditStaff = (staff) => {
        setEditingStaffId(staff.username);
        setEditStaffName(staff.name);
        setEditStaffDept(staff.department);
    };

    const saveEditStaff = async (username) => {
        try {
            const res = await fetch(`http://localhost:5000/api/staff/${username}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editStaffName, department: editStaffDept })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('✅ Staff details updated successfully!');
                setEditingStaffId(null);
                fetchStaff();
                fetchAllWorkloads();
            } else {
                setError(data.message || 'Failed to update staff');
            }
        } catch (err) { setError('Failed to update staff.'); }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        const res = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newStudentId, name: newStudentName, department: newStudentDept, year: newStudentYear })
        });
        const data = await res.json();
        if (data.success) {
            setMsg('✅ Student added successfully!');
            fetchStudents();
            setNewStudentId(''); setNewStudentName('');
        } else {
            setError(data.message || 'Failed to add student');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm(`Are you sure you want to delete Student Reg.No: ${studentId}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/students/${studentId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setMsg('🗑️ Student deleted successfully!');
                fetchStudents();
            }
        } catch (err) {
            setError('Failed to delete student.');
        }
    };

    const handleAssignStaff = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        const res = await fetch('http://localhost:5000/api/admin/assign-staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: assignStaffUsername, department: assignDept, year: assignYear, subject: assignSubject, subjectName: assignSubjectName })
        });
        const data = await res.json();
        if (data.success) {
            setMsg(`✅ Assigned Extra Subject '${assignSubject}' successfully!`);
            fetchAllWorkloads(); 
            setAssignSubject(''); setAssignSubjectName(''); setAssignStaffUsername('');
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!fileUpload) return alert('Please select a file first.');
        setMsg(''); setError('');
        const fileName = fileUpload.name.toLowerCase();

        if (fileName.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = async ({ target }) => {
                const lines = target.result.split('\n');
                const parsedStudents = [];
                lines.forEach((line) => {
                    const [id, name] = line.split(',').map(item => item?.trim());
                    if (id && name && id.toLowerCase() !== 'id' && id.toLowerCase() !== 'regno') {
                        parsedStudents.push({ id, name });
                    }
                });
                sendBulkToBackend(parsedStudents);
            };
            reader.readAsText(fileUpload);
        } else {
            alert('Only .csv files are supported!');
        }
    };

    const sendBulkToBackend = async (parsedStudents) => {
        try {
            const res = await fetch('http://localhost:5000/api/students/bulk-add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ students: parsedStudents, department: bulkDept, year: bulkYear })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(`✅ Imported ${parsedStudents.length} students successfully!`);
                fetchStudents(); setFileUpload(null);
            }
        } catch (err) { setError('Bulk upload failed.'); }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>⚙️ Admin Control Panel</h2>
            {msg && <p style={{ color: '#4ade80', textAlign: 'center', fontWeight: 'bold' }}>{msg}</p>}
            {error && <p style={{ color: '#f87171', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

            <div style={adminStyles.formGrid}>
                {/* 1. REGISTER STAFF */}
                <div style={adminStyles.cardBox}>
                    <h3 style={adminStyles.cardTitle}>👩‍🏫 Register New Staff & Subject</h3>
                    <form onSubmit={handleAddStaff}>
                        <div style={adminStyles.inputRow}>
                            <input type="text" placeholder="Staff ID (e.g. s_kumar)" style={adminStyles.input} value={newStaffUsername} onChange={e => setNewStaffUsername(e.target.value)} required />
                            <input type="text" placeholder="Staff Full Name" style={adminStyles.input} value={newStaffName} onChange={e => setNewStaffName(e.target.value)} required />
                        </div>
                        <div style={adminStyles.inputRow}>
                            <select style={adminStyles.input} value={newStaffDept} onChange={e => setNewStaffDept(e.target.value)}>
                                <option value="IT">IT</option><option value="AI&DS">AI&DS</option><option value="CSE">CSE</option>
                            </select>
                            <select style={adminStyles.input} value={newStaffYear} onChange={e => setNewStaffYear(e.target.value)}>
                                <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
                            </select>
                        </div>
                        <div style={adminStyles.inputRow}>
                            <input type="text" placeholder="Sub Code (e.g. IT3401)" style={adminStyles.input} value={newStaffSubjectCode} onChange={e => setNewStaffSubjectCode(e.target.value)} required />
                            <input type="text" placeholder="Subject Name" style={adminStyles.input} value={newStaffSubjectName} onChange={e => setNewStaffSubjectName(e.target.value)} required />
                        </div>
                        <input type="text" placeholder="Password (Default: staff123)" style={{ ...adminStyles.input, width: '100%', marginBottom: '10px', boxSizing: 'border-box' }} value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} required />
                        <button type="submit" style={{ ...adminStyles.primaryBtn, backgroundColor: '#8b5cf6' }}>+ Register Staff & Subject</button>
                    </form>
                </div>

                {/* 2. ADD SINGLE STUDENT */}
                <div style={adminStyles.cardBox}>
                    <h3 style={adminStyles.cardTitle}>➕ Add Single Student</h3>
                    <form onSubmit={handleAddStudent}>
                        <div style={adminStyles.inputRow}>
                            <input type="text" placeholder="Reg. No" style={adminStyles.input} value={newStudentId} onChange={e => setNewStudentId(e.target.value)} required />
                            <input type="text" placeholder="Student Name" style={adminStyles.input} value={newStudentName} onChange={e => setNewStudentName(e.target.value)} required />
                        </div>
                        <div style={adminStyles.inputRow}>
                            <select style={adminStyles.input} value={newStudentDept} onChange={e => setNewStudentDept(e.target.value)}>
                                <option value="AI&DS">AI&DS</option><option value="IT">IT</option><option value="CSE">CSE</option>
                            </select>
                            <select style={adminStyles.input} value={newStudentYear} onChange={e => setNewStudentYear(e.target.value)}>
                                <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
                            </select>
                        </div>
                        <button type="submit" style={adminStyles.primaryBtn}>Add Student</button>
                    </form>
                </div>

                {/* 3. ASSIGN EXTRA WORKLOAD */}
                <div style={{ ...adminStyles.cardBox, gridColumn: '1 / -1' }}>
                    <h3 style={adminStyles.cardTitle}>👨‍🏫 Assign Additional Subject to Existing Staff</h3>
                    <form onSubmit={handleAssignStaff}>
                        <div style={adminStyles.inputRow}>
                            <select style={adminStyles.input} value={assignStaffUsername} onChange={e => setAssignStaffUsername(e.target.value)} required>
                                <option value="">-- Select Existing Staff --</option>
                                {staffList.map(s => <option key={s.username} value={s.username}>{s.name} ({s.department})</option>)}
                            </select>
                            <select style={adminStyles.input} value={assignDept} onChange={e => setAssignDept(e.target.value)}>
                                <option value="AI&DS">AI&DS</option><option value="IT">IT</option><option value="CSE">CSE</option>
                            </select>
                            <select style={adminStyles.input} value={assignYear} onChange={e => setAssignYear(e.target.value)}>
                                <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
                            </select>
                        </div>
                        <div style={adminStyles.inputRow}>
                            <input type="text" placeholder="Sub Code (e.g. CS3391)" style={adminStyles.input} value={assignSubject} onChange={e => setAssignSubject(e.target.value)} required />
                            <input type="text" placeholder="Subject Name (e.g. OOPS)" style={adminStyles.input} value={assignSubjectName} onChange={e => setAssignSubjectName(e.target.value)} required />
                        </div>
                        <button type="submit" style={{ ...adminStyles.primaryBtn, backgroundColor: '#0284c7' }}>+ Assign Extra Workload</button>
                    </form>
                </div>
            </div>

            {/* BULK UPLOAD */}
            <div style={{ ...adminStyles.cardBox, marginTop: '20px', marginBottom: '20px' }}>
                <h3 style={adminStyles.cardTitle}>📁 Bulk Upload Students List (CSV)</h3>
                <form onSubmit={handleBulkUpload} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select style={{ ...adminStyles.input, width: '180px' }} value={bulkDept} onChange={e => setBulkDept(e.target.value)}>
                        <option value="IT">IT</option><option value="AI&DS">AI&DS</option><option value="CSE">CSE</option>
                    </select>
                    <select style={{ ...adminStyles.input, width: '150px' }} value={bulkYear} onChange={e => setBulkYear(e.target.value)}>
                        <option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                    </select>
                    <input type="file" accept=".csv" style={{ ...adminStyles.input, flex: '1', minWidth: '220px' }} onChange={e => setFileUpload(e.target.files[0])} required />
                    <button type="submit" style={{ ...adminStyles.primaryBtn, backgroundColor: '#10b981', width: 'auto', marginTop: 0 }}>Upload & Process File</button>
                </form>
            </div>

            {/* WORKLOADS TABLE */}
            <div style={{ ...styles.professionalTableContainer, marginTop: '30px', borderLeft: '4px solid #8b5cf6' }}>
                <h3 style={{ ...adminStyles.cardTitle, margin: '15px', color: '#c4b5fd' }}>📚 Assigned Staff Workloads</h3>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Staff ID</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>Staff Name</th>
                                <th style={styles.th}>Class Dept</th>
                                <th style={styles.th}>Year</th>
                                <th style={styles.th}>Subject Code</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>Subject Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allWorkloads.map((w, index) => {
                                const staffObj = staffList.find(s => s.username === w.username);
                                const displayName = staffObj ? staffObj.name : w.username;
                                return (
                                    <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                        <td style={styles.td}>{w.username}</td>
                                        <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold', color: '#38bdf8' }}>{displayName}</td>
                                        <td style={styles.td}>{w.department}</td>
                                        <td style={styles.td}>Year {w.year}</td>
                                        <td style={styles.td}>{w.subject || w.subjCode}</td>
                                        <td style={{ ...styles.td, textAlign: 'left' }}>{w.subjectName || w.subject_name}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REGISTERED STAFF REGISTRY */}
            <div style={{ ...styles.professionalTableContainer, marginTop: '30px', borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ ...adminStyles.cardTitle, margin: '15px', color: '#fde047' }}>👨‍🏫 Registered Staff Registry</h3>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Staff ID</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>Staff Name</th>
                                <th style={styles.th}>Department</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff, index) => (
                                <tr key={staff.username} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                    <td style={styles.td}>{staff.username}</td>
                                    <td style={{ ...styles.td, textAlign: 'left' }}>
                                        {editingStaffId === staff.username ? (
                                            <input type="text" style={{ ...styles.tableInput, width: '200px', textAlign: 'left' }} value={editStaffName} onChange={e => setEditStaffName(e.target.value)} />
                                        ) : (
                                            staff.name
                                        )}
                                    </td>
                                    <td style={styles.td}>
                                        {editingStaffId === staff.username ? (
                                            <select style={{ ...styles.tableInput, width: '100px' }} value={editStaffDept} onChange={e => setEditStaffDept(e.target.value)}>
                                                <option value="IT">IT</option>
                                                <option value="AI&DS">AI&DS</option>
                                                <option value="CSE">CSE</option>
                                            </select>
                                        ) : (
                                            staff.department
                                        )}
                                    </td>
                                    <td style={styles.td}>
                                        {editingStaffId === staff.username ? (
                                            <>
                                                <button style={{ ...styles.button, backgroundColor: '#10b981', padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px' }} onClick={() => saveEditStaff(staff.username)}>Save</button>
                                                <button style={{ ...styles.button, backgroundColor: '#64748b', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setEditingStaffId(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button style={{ ...styles.button, backgroundColor: '#0ea5e9', padding: '5px 12px', fontSize: '0.8rem', marginRight: '5px' }} onClick={() => startEditStaff(staff)}>Edit</button>
                                                <button style={{ ...styles.logoutBtn, padding: '5px 12px', fontSize: '0.8rem', margin: '0' }} onClick={() => handleDeleteStaff(staff.username)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REGISTERED STUDENTS TABLE */}
            <div style={{ ...styles.professionalTableContainer, marginTop: '30px' }}>
                <h3 style={{ ...adminStyles.cardTitle, margin: '15px' }}>📜 Registered Students Registry</h3>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Reg No</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>Name</th>
                                <th style={styles.th}>Dept</th>
                                <th style={styles.th}>Year</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, index) => (
                                <tr key={s.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                    <td style={styles.td}>{s.id}</td>
                                    <td style={{ ...styles.td, textAlign: 'left' }}>{s.name}</td>
                                    <td style={styles.td}>{s.department}</td>
                                    <td style={styles.td}>Year {s.year}</td>
                                    <td style={styles.td}>
                                        <button style={{ ...styles.logoutBtn, padding: '5px 12px', fontSize: '0.8rem', margin: '0' }} onClick={() => handleDeleteStudent(s.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------
// 2. HOD DASHBOARD COMPONENT
// -----------------------------------------
const HodDashboard = ({ currentUser }) => {
    const [selectedHodDept, setSelectedHodDept] = useState(currentUser.department || 'IT');
    const [selectedHodYear, setSelectedHodYear] = useState('all');
    const [hodData, setHodData] = useState({ students: [], subjects: [] });

    useEffect(() => {
        fetch(`http://localhost:5000/api/hod/department-marks/${encodeURIComponent(selectedHodDept)}`)
            .then(res => res.json())
            .then(data => data.success && setHodData(data))
            .catch(err => console.error("HOD Data fetch error", err));
    }, [selectedHodDept]);

    const filteredStudents = hodData.students.filter(s => selectedHodYear === 'all' || String(s.year) === selectedHodYear);

    return (
        <div>
            <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>👑 HOD Department Overall Performance</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                <select style={styles.input} value={selectedHodDept} onChange={e => setSelectedHodDept(e.target.value)}>
                    <option value="IT">IT Department</option>
                    <option value="AI&DS">AI&DS Department</option>
                    <option value="CSE">CSE Department</option>
                </select>
                <select style={styles.input} value={selectedHodYear} onChange={e => setSelectedHodYear(e.target.value)}>
                    <option value="all">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>
            
            <div style={styles.professionalTableContainer}>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>REG NO</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>NAME</th>
                                <th style={styles.th}>YEAR</th>
                                {hodData.subjects && hodData.subjects.length > 0 ? (
                                    hodData.subjects.map(sub => (
                                        <th key={sub} style={{ ...styles.th, color: '#38bdf8' }}>{sub}</th>
                                    ))
                                ) : (
                                    <th style={{ ...styles.th, color: '#f87171' }}>NO SUBJECT MARKS</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                    <td style={styles.td}>{student.id}</td>
                                    <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>{student.name}</td>
                                    <td style={styles.td}>Year {student.year}</td>
                                    {hodData.subjects && hodData.subjects.length > 0 ? (
                                        hodData.subjects.map(sub => {
                                            const mark = student.subjects[sub]?.internalMark;
                                            return (
                                                <td key={sub} style={{ ...styles.td, fontWeight: 'bold', color: mark >= 20 ? '#4ade80' : mark !== undefined ? '#f87171' : '#94a3b8' }}>
                                                    {mark ?? 'N/A'}
                                                </td>
                                            );
                                        })
                                    ) : (
                                        <td style={styles.td}>-</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------
// 3. CLASS ADVISOR DASHBOARD COMPONENT
// -----------------------------------------
const AdvisorDashboard = ({ currentUser }) => {
    const [advisorClassData, setAdvisorClassData] = useState({ students: [], subjects: [] });
    const [selectedYear, setSelectedYear] = useState(currentUser.year || '4');

    useEffect(() => {
        const dept = currentUser.department || 'IT';
        fetch(`http://localhost:5000/api/advisor/class-marks?dept=${encodeURIComponent(dept)}&year=${selectedYear}`)
            .then(res => res.json())
            .then(data => data.success && setAdvisorClassData(data))
            .catch(err => console.error("Advisor Data fetch error", err));
    }, [currentUser, selectedYear]);

    return (
        <div>
            <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>📋 Class Advisor View</h2>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1' }}>Dept: <strong>{currentUser.department || 'IT'}</strong></span>
                <select style={{ ...styles.input, width: '150px' }} value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                </select>
            </div>
            
            <div style={styles.professionalTableContainer}>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>REG NO</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>NAME</th>
                                {advisorClassData.subjects && advisorClassData.subjects.length > 0 ? (
                                    advisorClassData.subjects.map(sub => (
                                        <th key={sub} style={{ ...styles.th, color: '#38bdf8' }}>{sub}</th>
                                    ))
                                ) : (
                                    <th style={{ ...styles.th, color: '#f87171' }}>NO SUBJECT MARKS ENTRY</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {advisorClassData.students.map((st, index) => (
                                <tr key={st.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                    <td style={styles.td}>{st.id}</td>
                                    <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>{st.name}</td>
                                    {advisorClassData.subjects && advisorClassData.subjects.length > 0 ? (
                                        advisorClassData.subjects.map(sub => {
                                            const mark = st.subjects[sub]?.internalMark;
                                            return (
                                                <td key={sub} style={{ ...styles.td, fontWeight: 'bold', color: mark >= 20 ? '#4ade80' : mark !== undefined ? '#f87171' : '#94a3b8' }}>
                                                    {mark ?? 'N/A'}
                                                </td>
                                            );
                                        })
                                    ) : (
                                        <td style={styles.td}>-</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------
// 4. STAFF DASHBOARD COMPONENT
// -----------------------------------------
const StaffDashboard = ({ currentUser }) => {
    const [staffWorkloads, setStaffWorkloads] = useState([]);
    const [selectedClassDept, setSelectedClassDept] = useState(currentUser.department || 'IT');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [markingStudents, setMarkingStudents] = useState([]);

    const inputColumns = [
        'cia1', 'assignment1', 'seminar1', 
        'cia2', 'model', 'assignment2', 'seminar2'
    ];

    const inputHeaders = [
        'CIA 1', 'Assign 1', 'Seminar 1', 'Slot 1 (Auto)',
        'CIA 2', 'Model', 'Assign 2', 'Seminar 2', 'Slot 2 (Auto)'
    ];

    useEffect(() => {
        if (currentUser?.username) {
            fetch(`http://localhost:5000/api/staff/workload/${encodeURIComponent(currentUser.username)}`)
                .then(res => res.json())
                .then(data => { if (data.success) setStaffWorkloads(data.workload); })
                .catch(err => console.error('❌ Workload fetch error:', err));
        }
    }, [currentUser]);

    const availableSubjects = staffWorkloads.filter(w => {
        const wYear = String(w.year).replace(/[^0-9]/g, '');
        const sYear = String(selectedYear).replace(/[^0-9]/g, '');
        const normWDept = String(w.department || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const normSDept = String(selectedClassDept || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        return wYear === sYear && normWDept === normSDept;
    });

    const handleClassDeptChange = (dept) => {
        setSelectedClassDept(dept);
        setSelectedSubjectCode('');
        setMarkingStudents([]);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year); 
        setSelectedSubjectCode(''); 
        setMarkingStudents([]);
    };

    const handleSubjectChange = async (subjCode) => {
        setSelectedSubjectCode(subjCode);
        if (!subjCode || !selectedClassDept || !selectedYear) {
            setMarkingStudents([]);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/students`);
            const data = await res.json();
            
            if (data.success && data.students) {
                const normalizeText = (text) => String(text || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
                
                const targetDept = normalizeText(selectedClassDept);
                const targetYear = String(selectedYear).replace(/[^0-9]/g, '');

                const matchedStudents = data.students.filter(student => {
                    const stuDept = normalizeText(student.department);
                    const stuYear = String(student.year || '').replace(/[^0-9]/g, '');
                    return (stuDept === targetDept) && (stuYear === targetYear);
                });

                const finalStudents = matchedStudents.map(s => ({
                    ...s,
                    subjects: s.subjects || {}
                }));

                setMarkingStudents(finalStudents);
            } else {
                setMarkingStudents([]);
            }
        } catch (err) { 
            console.error('❌ Error fetching students', err); 
            setMarkingStudents([]); 
        }
    };

    const handleMarkChange = async (studentId, markType, value) => {
        try {
            const response = await fetch('http://localhost:5000/api/marks/update', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, subjectCode: selectedSubjectCode, markType, value })
            });
            const data = await response.json();
            if (data.success) {
                setMarkingStudents(prev => prev.map(s => 
                    s.id === studentId ? { ...s, subjects: { ...s.subjects, [selectedSubjectCode]: data.updatedSubjectData } } : s
                ));
            }
        } catch (err) { console.error('Mark update error'); }
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const maxRows = markingStudents.length; 
        const maxCols = inputColumns.length; 
        let nextRow = rowIndex; let nextCol = colIndex;

        if (e.key === 'ArrowUp') nextRow -= 1;
        else if (e.key === 'ArrowDown' || e.key === 'Enter') nextRow += 1;
        else if (e.key === 'ArrowRight') { nextCol += 1; if (nextCol >= maxCols) { nextCol = 0; nextRow += 1; } }
        else if (e.key === 'ArrowLeft') { nextCol -= 1; if (nextCol < 0) { nextCol = maxCols - 1; nextRow -= 1; } }
        else return;

        if (nextRow >= 0 && nextRow < maxRows) {
            const nextElement = document.getElementById(`mark-${nextRow}-${nextCol}`);
            if (nextElement) { e.preventDefault(); nextElement.focus(); nextElement.select(); }
        }
    };

    const exportToExcel = () => {
        if (markingStudents.length === 0) return;
        const excelData = markingStudents.map((s, index) => {
            const m = s.subjects[selectedSubjectCode] || {};
            return {
                "S.No": index + 1, "Reg No": s.id, "Name": s.name,
                "CIA 1": m.cia1 || 0, "Assignment 1": m.assignment1 || 0, "Seminar 1": m.seminar1 || 0, "Slot 1 (Auto)": m.slot1 || 0,
                "CIA 2": m.cia2 || 0, "Model": m.model || 0, "Assignment 2": m.assignment2 || 0, "Seminar 2": m.seminar2 || 0, "Slot 2 (Auto)": m.slot2 || 0,
                "Total Internal Mark": m.internalMark || 0
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Internal Marks");
        XLSX.writeFile(workbook, `${selectedClassDept}_Year${selectedYear}_${selectedSubjectCode}_Marks.xlsx`);
    };

    return (
        <div>
            <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>🧑‍🏫 Staff Data Entry Portal</h2>
            
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>1. Class Dept:</label>
                    <select style={styles.input} value={selectedClassDept} onChange={e => handleClassDeptChange(e.target.value)}>
                        <option value="IT">IT</option>
                        <option value="AI&DS">AI&DS</option>
                        <option value="CSE">CSE</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>2. Select Year:</label>
                    <select style={styles.input} value={selectedYear} onChange={e => handleYearChange(e.target.value)}>
                        <option value="">-- Choose Year --</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>3. Select Subject:</label>
                    <select style={{ ...styles.input, opacity: selectedYear ? 1 : 0.5, minWidth: '220px' }} value={selectedSubjectCode} onChange={e => handleSubjectChange(e.target.value)} disabled={!selectedYear}>
                        <option value="">-- Choose Subject --</option>
                        {availableSubjects.map((s, idx) => <option key={idx} value={s.subject || s.subjCode}>{s.subject || s.subjCode} - {s.subjectName || s.subject_name}</option>)}
                    </select>
                </div>
            </div>

            {selectedSubjectCode && markingStudents.length > 0 ? (
                <div style={styles.professionalTableContainer}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: '#0f172a', borderBottom: '1px solid #334155', borderRadius: '12px 12px 0 0' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Subject: {selectedSubjectCode} ({selectedClassDept})</span>
                        <button onClick={exportToExcel} style={{ ...styles.button, backgroundColor: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
                            <span>📊</span> Export Excel
                        </button>
                    </div>

                    <div style={{ ...styles.tableScroll, padding: '0' }}>
                        <table style={{ ...styles.table, minWidth: '1300px' }}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>S.No</th>
                                    <th style={styles.th}>Reg No</th>
                                    <th style={{ ...styles.th, textAlign: 'left', minWidth: '180px' }}>Name</th>
                                    {inputHeaders.map((head, i) => <th key={i} style={styles.th}>{head}</th>)}
                                    <th style={{ ...styles.th, color: '#4ade80' }}>Total (40)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {markingStudents.map((s, rowIndex) => {
                                    const m = s.subjects[selectedSubjectCode] || {};
                                    return (
                                        <tr key={s.id} style={rowIndex % 2 === 0 ? styles.trEven : styles.trOdd}>
                                            <td style={styles.td}>{rowIndex + 1}</td>
                                            <td style={styles.td}>{s.id}</td>
                                            <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>{s.name}</td>
                                            
                                            {/* First 3 Inputs */}
                                            {['cia1', 'assignment1', 'seminar1'].map((colKey, i) => (
                                                <td key={colKey} style={styles.td}>
                                                    <input id={`mark-${rowIndex}-${i}`} type="number" style={styles.tableInput} value={m[colKey] ?? ''} onChange={e => handleMarkChange(s.id, colKey, e.target.value)} onKeyDown={e => handleKeyDown(e, rowIndex, i)} onFocus={(e) => e.target.style.backgroundColor = '#1e293b'} onBlur={(e) => e.target.style.backgroundColor = '#0f172a'} />
                                                </td>
                                            ))}

                                            <td style={{ ...styles.td, color: '#eab308', fontWeight: 'bold', fontSize: '1.05rem' }}>{m.slot1 ?? '0'}</td>

                                            {/* Next 4 Inputs */}
                                            {['cia2', 'model', 'assignment2', 'seminar2'].map((colKey, i) => {
                                                const colIndex = i + 3; 
                                                return (
                                                    <td key={colKey} style={styles.td}>
                                                        <input id={`mark-${rowIndex}-${colIndex}`} type="number" style={styles.tableInput} value={m[colKey] ?? ''} onChange={e => handleMarkChange(s.id, colKey, e.target.value)} onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)} onFocus={(e) => e.target.style.backgroundColor = '#1e293b'} onBlur={(e) => e.target.style.backgroundColor = '#0f172a'} />
                                                    </td>
                                                );
                                            })}

                                            <td style={{ ...styles.td, color: '#eab308', fontWeight: 'bold', fontSize: '1.05rem' }}>{m.slot2 ?? '0'}</td>
                                            <td style={{ ...styles.td, color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem' }}>{m.internalMark ?? '0'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : selectedSubjectCode ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px' }}>No students found for this configuration. Please add {selectedClassDept} {selectedYear} Year students in Admin Panel.</p>
            ) : null}
        </div>
    );
};

// -----------------------------------------
// 5. STUDENT DASHBOARD COMPONENT
// -----------------------------------------
const StudentDashboard = ({ currentUser }) => {
    const [studentProfile, setStudentProfile] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/student/my-marks/${currentUser.username}`)
            .then(res => res.json())
            .then(data => data.success && setStudentProfile(data.student));
    }, [currentUser]);

    if (!studentProfile) return <p style={{ textAlign: 'center' }}>Loading student marks...</p>;

    return (
        <div>
            <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>🎓 Student Performance Report</h2>
            <div style={styles.formBox}>
                <p><strong>Name:</strong> {studentProfile.name}</p>
                <p><strong>Reg. No:</strong> {studentProfile.id}</p>
                <p><strong>Dept:</strong> {studentProfile.department} | <strong>Year:</strong> {studentProfile.year}</p>
            </div>
            
            <div style={styles.professionalTableContainer}>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Subject Code</th>
                                <th style={{ ...styles.th, textAlign: 'left' }}>Subject Name</th>
                                <th style={styles.th}>Internal Mark</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentProfile.marks.map((m, index) => {
                                const isPass = (m.internal_mark || 0) >= 20;
                                return (
                                    <tr key={m.subject_code} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                        <td style={styles.td}>{m.subject_code}</td>
                                        <td style={{ ...styles.td, textAlign: 'left' }}>{m.subject_name || 'N/A'}</td>
                                        <td style={{ ...styles.td, fontWeight: 'bold', color: '#38bdf8' }}>{m.internal_mark ?? 'N/A'}</td>
                                        <td style={styles.td}>
                                            <span style={{ backgroundColor: isPass ? '#15803d' : '#b91c1c', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>
                                                {isPass ? 'ELIGIBLE' : 'NEED IMPROVEMENT'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------
// MAIN APP ROOT
// -----------------------------------------
const MainApp = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [staffDept, setStaffDept] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showStaffGrid, setShowStaffGrid] = useState(false);
    const [showStaffPasscodeModal, setShowStaffPasscodeModal] = useState(false);

    const handleRoleSelect = (roleKey) => {
        setSelectedRole(roleKey); setError(''); setUsername(''); setPassword('');
        setShowStaffGrid(false); setSelectedStaff(null); setShowStaffPasscodeModal(false);
        if (roleKey !== 'staff') setShowLoginModal(true);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false); setSelectedRole(''); setShowStaffGrid(false); setShowStaffPasscodeModal(false);
    };

    const handleStaffDeptSelect = async (dept) => {
        setStaffDept(dept);
        try {
            const response = await fetch(`http://localhost:5000/api/staff-by-dept?dept=${encodeURIComponent(dept)}`);
            const data = await response.json();
            if (data.success) { setStaffList(data.staffList); setShowStaffGrid(true); }
        } catch (err) { console.error('Failed to fetch staff list'); }
    };

    const handleStaffClick = (staff) => {
        setSelectedStaff(staff); setPassword(''); setError(''); setShowStaffPasscodeModal(true);
    };

    const handleMainLogin = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        const finalUsername = selectedStaff ? selectedStaff.username : username;
        const finalRole = selectedStaff ? 'staff' : selectedRole;

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: finalUsername, password, role: finalRole })
            });
            const data = await response.json();
            if (response.ok && data.success) { setCurrentUser(data.user); handleCloseModal(); } 
            else { setError(data.message || 'Invalid Credentials!'); }
        } catch (err) { setError('Server connection error.'); } 
        finally { setLoading(false); }
    };

    const handleLogout = () => {
        setCurrentUser(null); handleCloseModal(); setUsername(''); setPassword('');
    };

    if (currentUser) {
        return (
            <div style={styles.container}>
                <div style={{ ...styles.header, position: 'relative', justifyContent: 'flex-end' }}>
                    <h2 style={styles.dashboardTitle}>🎓 College Management Portal</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Welcome, <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
                        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div style={styles.dashboardCard}>
                    {currentUser.role === 'admin' && <AdminDashboard />}
                    {currentUser.role === 'hod' && <HodDashboard currentUser={currentUser} />}
                    {currentUser.role === 'class_advisor' && <AdvisorDashboard currentUser={currentUser} />}
                    {currentUser.role === 'staff' && <StaffDashboard currentUser={currentUser} />}
                    {currentUser.role === 'student' && <StudentDashboard currentUser={currentUser} />}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.loginWrapper}>
            <style>
                {`
                .hover-card {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                }
                .hover-card:hover {
                    transform: translateY(-8px) scale(1.05);
                    box-shadow: 0 15px 35px rgba(56, 189, 248, 0.4) !important;
                    border-color: #38bdf8 !important;
                    z-index: 10;
                }
                `}
            </style>

            <div style={styles.titleContainer}>
                <h1 style={styles.title}>🎓 College Management Portal</h1>
            </div>
            
            <div style={styles.grid}>
                <div className="hover-card" style={{ ...styles.roleCard, borderColor: selectedRole === 'admin' ? '#38bdf8' : 'rgba(255,255,255,0.2)' }} onClick={() => handleRoleSelect('admin')}>
                    <span style={styles.icon}>⚙️</span><h3>Admin</h3>
                </div>
                <div className="hover-card" style={{ ...styles.roleCard, borderColor: selectedRole === 'hod' ? '#38bdf8' : 'rgba(255,255,255,0.2)' }} onClick={() => handleRoleSelect('hod')}>
                    <span style={styles.icon}>👑</span><h3>HOD</h3>
                </div>
                <div className="hover-card" style={{ ...styles.roleCard, borderColor: selectedRole === 'class_advisor' ? '#38bdf8' : 'rgba(255,255,255,0.2)' }} onClick={() => handleRoleSelect('class_advisor')}>
                    <span style={styles.icon}>📋</span><h3>Class Advisor</h3>
                </div>
                <div className="hover-card" style={{ ...styles.roleCard, borderColor: selectedRole === 'staff' ? '#38bdf8' : 'rgba(255,255,255,0.2)' }} onClick={() => handleRoleSelect('staff')}>
                    <span style={styles.icon}>🧑‍🏫</span><h3>Staff</h3>
                </div>
                <div className="hover-card" style={{ ...styles.roleCard, borderColor: selectedRole === 'student' ? '#38bdf8' : 'rgba(255,255,255,0.2)' }} onClick={() => handleRoleSelect('student')}>
                    <span style={styles.icon}>🎓</span><h3>Student</h3>
                </div>
            </div>

            {/* MODALS */}
            {showLoginModal && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ color: '#38bdf8', margin: 0 }}>Sign In ({selectedRole.toUpperCase()})</h3>
                            <button style={styles.closeIcon} onClick={handleCloseModal}>✖</button>
                        </div>
                        <form onSubmit={handleMainLogin}>
                            <div style={styles.formGroup}><label style={styles.label}>Username / Reg No</label><input type="text" style={styles.input} value={username} onChange={e => setUsername(e.target.value)} autoFocus required /></div>
                            <div style={styles.formGroup}><label style={styles.label}>Password</label><input type="password" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} required /></div>
                            {error && <p style={styles.error}>{error}</p>}
                            <button type="submit" style={{ ...styles.button, width: '100%', marginTop: '10px', boxSizing: 'border-box' }} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                        </form>
                    </div>
                </div>
            )}

            {selectedRole === 'staff' && !showStaffGrid && !showStaffPasscodeModal && (
                <div style={styles.modalBackdrop}>
                    <div style={{ ...styles.modalContent, maxWidth: '500px' }}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ color: '#38bdf8', margin: 0 }}>Select Department</h3>
                            <button style={styles.closeIcon} onClick={handleCloseModal}>✖</button>
                        </div>
                        <div style={{ ...styles.grid, marginTop: '20px' }}>
                            <div className="hover-card" style={{ ...styles.roleCard, width: '190px', padding: '20px 10px', boxSizing: 'border-box' }} onClick={() => handleStaffDeptSelect('IT')}>
                                <span style={styles.icon}>💻</span>
                                <h3 style={{ fontSize: '1.1rem', margin: '10px 0 0 0', wordWrap: 'break-word' }}>IT Department</h3>
                            </div>
                            <div className="hover-card" style={{ ...styles.roleCard, width: '190px', padding: '20px 10px', boxSizing: 'border-box' }} onClick={() => handleStaffDeptSelect('AI&DS')}>
                                <span style={styles.icon}>🤖</span>
                                <h3 style={{ fontSize: '1.1rem', margin: '10px 0 0 0', wordWrap: 'break-word' }}>AI&DS Department</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedRole === 'staff' && showStaffGrid && !showStaffPasscodeModal && (
                <div style={styles.modalBackdrop}>
                    <div style={{ ...styles.modalContent, maxWidth: '750px' }}>
                        <div style={styles.modalHeader}><h3 style={{ color: '#38bdf8', margin: 0 }}>{staffDept} Staff Members</h3><button style={styles.closeIcon} onClick={() => setShowStaffGrid(false)}>✖</button></div>
                        <div style={{ ...styles.grid, marginTop: '20px' }}>
                            {staffList.map(s => (
                                <div key={s.username} className="hover-card" style={{ ...styles.roleCard, width: '200px', padding: '20px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }} onClick={() => handleStaffClick(s)}>
                                    <span style={{ fontSize: '2rem', marginBottom: '8px', display: 'block' }}>🧑‍🏫</span>
                                    <h3 style={{ color: '#f8fafc', fontSize: '0.95rem', margin: 0, wordWrap: 'break-word', textAlign: 'center', lineHeight: '1.4', width: '100%' }}>{s.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {showStaffPasscodeModal && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ color: '#38bdf8', margin: 0 }}>Staff Verification</h3>
                            <button style={styles.closeIcon} onClick={() => setShowStaffPasscodeModal(false)}>✖</button>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <p style={{ color: '#cbd5e1', margin: 0 }}>Enter password for</p>
                            <h3 style={{ color: '#f8fafc', margin: '5px 0 0 0' }}>{selectedStaff?.name}</h3>
                        </div>
                        <form onSubmit={handleMainLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                type="password" 
                                placeholder="Enter Password" 
                                style={{ ...styles.input, boxSizing: 'border-box' }} 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                autoFocus 
                                required 
                            />
                            {error && <p style={styles.error}>{error}</p>}
                            <button type="submit" style={{ ...styles.button, width: '100%', boxSizing: 'border-box' }}>Login</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ADMIN SPECIFIC STYLES
const adminStyles = {
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' },
    cardBox: { backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' },
    cardTitle: { color: '#38bdf8', fontSize: '1.1rem', marginBottom: '15px' },
    inputRow: { display: 'flex', gap: '10px', marginBottom: '10px' },
    input: { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '6px', flex: '1', minWidth: '0', boxSizing: 'border-box' },
    primaryBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '5px', boxSizing: 'border-box' }
};

// GLOBAL STYLES
const styles = {
    container: { backgroundColor: 'transparent', color: '#f8fafc', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' },
    loginWrapper: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', boxSizing: 'border-box', backgroundColor: 'transparent', fontFamily: 'sans-serif', position: 'relative' },
    titleContainer: { position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', width: '100%', textAlign: 'center', zIndex: 10 },
    title: { color: '#38bdf8', margin: 0, textShadow: '0 4px 15px rgba(0,0,0,0.9)', fontSize: '2.5rem' },
    dashboardTitle: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: '#38bdf8', margin: 0, fontSize: '1.8rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '15px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '15px', borderRadius: '10px' },
    grid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '1000px', width: '100%' },
    roleCard: { width: '150px', backgroundColor: 'rgba(30, 41, 59, 0.85)', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '25px 15px', textAlign: 'center', cursor: 'pointer', backdropFilter: 'blur(5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.6)', transition: 'transform 0.2s, borderColor 0.2s' },
    icon: { fontSize: '2.5rem', display: 'block', marginBottom: '10px' },
    formBox: { backgroundColor: 'rgba(30, 41, 59, 0.95)', borderRadius: '10px', padding: '25px', maxWidth: '400px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', boxSizing: 'border-box' },
    formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { color: '#cbd5e1', fontSize: '0.85rem' },
    input: { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '10px 12px', borderRadius: '6px', width: '100%', boxSizing: 'border-box' },
    button: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxSizing: 'border-box' },
    logoutBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginLeft: '15px', fontWeight: 'bold' },
    error: { color: '#f87171', fontSize: '0.85rem', textAlign: 'center', marginTop: '10px' },
    dashboardCard: { backgroundColor: 'rgba(30, 41, 59, 0.95)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.2)' },
    professionalTableContainer: { backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden' },
    tableScroll: { overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }, 
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '12px 10px', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #334155', position: 'sticky', top: 0, zIndex: 1 },
    td: { padding: '10px', textAlign: 'center', color: '#e2e8f0', fontSize: '0.95rem', borderBottom: '1px solid #334155' },
    trEven: { backgroundColor: '#1e293b' },
    trOdd: { backgroundColor: '#0f172a' }, 
    tableInput: { backgroundColor: '#0f172a', border: '1px solid #475569', color: '#f8fafc', padding: '8px 4px', borderRadius: '4px', width: '60px', textAlign: 'center', fontWeight: '500', outline: 'none' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'rgba(30, 41, 59, 0.95)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', width: '90%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', boxSizing: 'border-box' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '20px' },
    closeIcon: { background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);