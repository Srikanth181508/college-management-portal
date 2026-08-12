const AdminDashboard = ({ staffList, students, fetchStudents, setAdminSuccess, setAdminError }) => {
    const [newStudentId, setNewStudentId] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentDept, setNewStudentDept] = useState('AI&DS');
    const [newStudentYear, setNewStudentYear] = useState('1');

    // Workload mapping states
    const [assignStaffUsername, setAssignStaffUsername] = useState('');
    const [assignDept, setAssignDept] = useState('AI&DS');
    const [assignYear, setAssignYear] = useState('1');
    const [assignSubject, setAssignSubject] = useState('');
    const [assignSubjectName, setAssignSubjectName] = useState('');

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: newStudentId, name: newStudentName, department: newStudentDept, year: newStudentYear })
            });
            const data = await res.json();
            if (data.success) {
                fetchStudents();
                setNewStudentId('');
                setNewStudentName('');
                setAdminSuccess('Student added successfully!');
            }
        } catch (err) {
            setAdminError('Error adding student.');
        }
    };

    const handleAssignStaff = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/admin/assign-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: assignStaffUsername, department: assignDept, year: assignYear, subject: assignSubject, subjectName: assignSubjectName })
            });
            const data = await res.json();
            if (data.success) {
                setAdminSuccess(`Assigned ${assignSubject} to ${assignStaffUsername}`);
                setAssignSubject('');
                setAssignSubjectName('');
            }
        } catch (err) {
            setAdminError('Workload assignment failed.');
        }
    };

    return (
        <div>
            <h2 style={{ color: '#38bdf8' }}>⚙️ Admin Control Panel</h2>
            
            {/* Add Student Form */}
            <div style={styles.formBox}>
                <h3>➕ Add Single Student</h3>
                <form onSubmit={handleAddStudent} style={styles.flexForm}>
                    <input type="text" placeholder="Reg. No" style={styles.input} value={newStudentId} onChange={e => setNewStudentId(e.target.value)} required />
                    <input type="text" placeholder="Student Name" style={styles.input} value={newStudentName} onChange={e => setNewStudentName(e.target.value)} required />
                    <select style={styles.input} value={newStudentDept} onChange={e => setNewStudentDept(e.target.value)}>
                        <option value="AI&DS">AI&DS</option>
                        <option value="IT">IT</option>
                    </select>
                    <select style={styles.input} value={newStudentYear} onChange={e => setNewStudentYear(e.target.value)}>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                    </select>
                    <button type="submit" style={styles.button}>Add</button>
                </form>
            </div>

            {/* Map Staff Workload */}
            <div style={{ ...styles.formBox, marginTop: '20px' }}>
                <h3>👨‍🏫 Assign Staff Workload</h3>
                <form onSubmit={handleAssignStaff} style={styles.flexForm}>
                    <select style={styles.input} value={assignStaffUsername} onChange={e => setAssignStaffUsername(e.target.value)} required>
                        <option value="">-- Select Staff --</option>
                        {staffList.map(s => <option key={s.username} value={s.username}>{s.name} ({s.department})</option>)}
                    </select>
                    <select style={styles.input} value={assignDept} onChange={e => setAssignDept(e.target.value)}>
                        <option value="AI&DS">AI&DS</option>
                        <option value="IT">IT</option>
                    </select>
                    <select style={styles.input} value={assignYear} onChange={e => setAssignYear(e.target.value)}>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                    </select>
                    <input type="text" placeholder="Subject Code" style={styles.input} value={assignSubject} onChange={e => setAssignSubject(e.target.value)} required />
                    <input type="text" placeholder="Subject Name" style={styles.input} value={assignSubjectName} onChange={e => setAssignSubjectName(e.target.value)} required />
                    <button type="submit" style={styles.button}>Assign</button>
                </form>
            </div>
        </div>
    );
};