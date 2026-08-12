const StaffDashboard = ({ currentUser }) => {
    const [staffWorkloads, setStaffWorkloads] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [markingStudents, setMarkingStudents] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/staff/workload/${encodeURIComponent(currentUser.username)}`)
            .then(res => res.json())
            .then(data => data.success && setStaffWorkloads(data.workload));
    }, [currentUser]);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setSelectedSubjectCode('');
        setMarkingStudents([]);
        if (year) {
            setAvailableSubjects(staffWorkloads.filter(w => String(w.year) === String(year)));
        }
    };

    const handleSubjectChange = async (subjCode) => {
        setSelectedSubjectCode(subjCode);
        if (subjCode) {
            const res = await fetch(`http://localhost:5000/api/students-for-marking?department=${currentUser.department}&year=${selectedYear}&subject=${subjCode}`);
            const data = await res.json();
            if (data.success) setMarkingStudents(data.students);
        }
    };

    const handleMarkChange = async (studentId, markType, value) => {
        try {
            const response = await fetch('http://localhost:5000/api/marks/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, subjectCode: selectedSubjectCode, markType, value })
            });
            const data = await response.json();
            if (data.success) {
                setMarkingStudents(prev => prev.map(s => 
                    s.id === studentId ? { ...s, subjects: { ...s.subjects, [selectedSubjectCode]: data.updatedSubjectData } } : s
                ));
            }
        } catch (err) {
            console.error('Mark update error');
        }
    };

    return (
        <div>
            <h2 style={{ color: '#38bdf8' }}>🧑‍🏫 Staff Portal - Mark Entry</h2>
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <select style={styles.input} value={selectedYear} onChange={e => handleYearChange(e.target.value)}>
                    <option value="">-- Select Year --</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>

                {selectedYear && (
                    <select style={styles.input} value={selectedSubjectCode} onChange={e => handleSubjectChange(e.target.value)}>
                        <option value="">-- Select Subject --</option>
                        {availableSubjects.map(s => <option key={s.subject} value={s.subject}>{s.subject} - {s.subjectName}</option>)}
                    </select>
                )}
            </div>

            {selectedSubjectCode && (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>S.No</th>
                            <th style={styles.th}>Reg No</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>CIA 1</th>
                            <th style={styles.th}>ASSIGNMENT 1</th>
                            <th style={styles.th}>SEMINAR 1</th>
                            <th style={styles.th}>CIA 2</th>
                            <th style={styles.th}>MODEL</th>
                            <th style={styles.th}>ASSIGNMENT 2</th>
                            <th style={styles.th}>SEMINAR 2</th>
                            <th style={styles.th}>Total Mark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {markingStudents.map(s => {
                            const m = s.subjects[selectedSubjectCode] || {};
                            return (
                                <tr key={s.id}>
                                    <td style={styles.td}>{s.id}</td>
                                    <td style={styles.td}>{s.name}</td>
                                    <td style={styles.td}><input type="number" style={styles.tableInput} value={m.cia1 ?? ''} onChange={e => handleMarkChange(s.id, 'cia1', e.target.value)} /></td>
                                    <td style={styles.td}><input type="number" style={styles.tableInput} value={m.cia2 ?? ''} onChange={e => handleMarkChange(s.id, 'cia2', e.target.value)} /></td>
                                    <td style={{ ...styles.td, color: '#38bdf8' }}>{m.internalMark ?? 'N/A'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};