const HodDashboard = ({ currentUser }) => {
    const [selectedHodDept, setSelectedHodDept] = useState(currentUser.department || 'AI&DS');
    const [selectedHodYear, setSelectedHodYear] = useState('all');
    const [hodData, setHodData] = useState({ students: [], subjects: [] });

    useEffect(() => {
        fetch(`http://localhost:5000/api/hod/department-marks/${selectedHodDept}`)
            .then(res => res.json())
            .then(data => data.success && setHodData(data));
    }, [selectedHodDept]);

    return (
        <div>
            <h2 style={{ color: '#38bdf8' }}>📋 HOD Department Overall Performance</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <select style={styles.input} value={selectedHodDept} onChange={e => setSelectedHodDept(e.target.value)}>
                    <option value="AI&DS">AI&DS Department</option>
                    <option value="IT">IT Department</option>
                </select>
                <select style={styles.input} value={selectedHodYear} onChange={e => setSelectedHodYear(e.target.value)}>
                    <option value="all">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Reg.No</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Year</th>
                        {hodData.subjects.map(sub => <th key={sub} style={{ ...styles.th, color: '#38bdf8' }}>{sub}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {hodData.students
                        .filter(s => selectedHodYear === 'all' || String(s.year) === selectedHodYear)
                        .map(student => (
                            <tr key={student.id}>
                                <td style={styles.td}>{student.id}</td>
                                <td style={styles.td}>{student.name}</td>
                                <td style={styles.td}>{student.year}</td>
                                {hodData.subjects.map(sub => (
                                    <td key={sub} style={styles.td}>{student.subjects[sub]?.internalMark ?? 'N/A'}</td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};