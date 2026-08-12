const AdvisorDashboard = ({ currentUser }) => {
    const [advisorClassData, setAdvisorClassData] = useState({ students: [], subjects: [] });

    useEffect(() => {
        fetch(`http://localhost:5000/api/advisor/class-marks?dept=${currentUser.department}&year=${currentUser.year || 3}`)
            .then(res => res.json())
            .then(data => data.success && setAdvisorClassData(data));
    }, [currentUser]);

    return (
        <div>
            <h2 style={{ color: '#38bdf8' }}>📋 Class Advisor - Consolidated Marks View</h2>
            <p style={{ color: '#94a3b8' }}>Dept: {currentUser.department} | Year: {currentUser.year || 3}</p>
            
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Reg No</th>
                        <th style={styles.th}>Name</th>
                        {advisorClassData.subjects.map(sub => <th key={sub} style={{ ...styles.th, color: '#38bdf8' }}>{sub}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {advisorClassData.students.map(st => (
                        <tr key={st.id}>
                            <td style={styles.td}>{st.id}</td>
                            <td style={styles.td}>{st.name}</td>
                            {advisorClassData.subjects.map(sub => (
                                <td key={sub} style={styles.td}>{st.subjects[sub]?.internalMark ?? 'N/A'}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};