const StudentDashboard = ({ currentUser }) => {
    const [studentProfile, setStudentProfile] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/student/my-marks/${currentUser.username}`)
            .then(res => res.json())
            .then(data => data.success && setStudentProfile(data.student));
    }, [currentUser]);

    if (!studentProfile) return <p>Loading marks...</p>;

    return (
        <div>
            <h2 style={{ color: '#38bdf8' }}>🎓 Student Performance Report</h2>
            <div style={styles.formBox}>
                <p><strong>Name:</strong> {studentProfile.name}</p>
                <p><strong>Reg. No:</strong> {studentProfile.id}</p>
                <p><strong>Dept:</strong> {studentProfile.department} | <strong>Year:</strong> {studentProfile.year}</p>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Subject Code</th>
                        <th style={styles.th}>Internal Mark</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {studentProfile.marks.map(m => {
                        const isPass = (m.internal_mark || 0) >= 20;
                        return (
                            <tr key={m.subject_code}>
                                <td style={styles.td}>{m.subject_code}</td>
                                <td style={styles.td}>{m.internal_mark ?? 'N/A'}</td>
                                <td style={styles.td}>
                                    <span style={{ backgroundColor: isPass ? '#15803d' : '#b91c1c', padding: '4px 8px', borderRadius: '4px' }}>
                                        {isPass ? 'ELIGIBLE' : 'NEED IMPROVEMENT'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};