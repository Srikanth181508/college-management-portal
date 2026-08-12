// ==========================================
// server.js - COMPLETE BACKEND WITH STAFF API & 13 COLUMNS MARKS
// ==========================================
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import pool from './db.js';

const app = express();

// CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Server crash aagamarukuka Database test connection
pool.getConnection()
    .then(conn => {
        console.log("✅ MySQL Database Connected Successfully!");
        conn.release();
    })
    .catch(err => {
        console.error("⚠️ MySQL Database Connection Failed! Ensure MySQL service is running.", err.message);
    });

// ------------------------------------------
// ------------------------------------------
// AUTH & USERS DATABASE (In-Memory + DB Sync)
// ------------------------------------------
let users = [
    { username: 'admin', password: 'pgpcet@123', role: 'admin', name: 'System Admin' },
    { username: 'ithod', password: 'pgpcet@123', role: 'hod', department: 'IT', name: 'Dr. IT HOD' },
    
    // 🌟 RAMYA AS CLASS ADVISOR 🌟
    { username: 'ramya', password: 'pgpcet@123', role: 'class_advisor', department: 'IT', year: '3', name: 'E. Ramya' },

    // 🌟 JANARTHINI AS CLASS ADVISOR 🌟
    { username: 'janarthini', password: 'pgpcet@123', role: 'class_advisor', department: 'IT', year: '3', name: 'S. Janarthini'}, 
    
    // 🌟 RAMYA AS STAFF 🌟
    { username: 'ramya', password: 'staff123', role: 'staff', department: 'IT', name: 'E. Ramya' },

    { username: 'advisor', password: 'pgpcet@123', role: 'class_advisor', department: 'IT', year: '3', name: 'IT Year 3 Advisor' },
    { username: 's_janarthini', password: 'staff123', role: 'staff', name: 'S. Janarthini', department: 'IT' },
    { username: 'p_nandhini', password: 'staff123', role: 'staff', name: 'P. Nandhini', department: 'IT' },
    { username: 's_narmatha', password: 'staff123', role: 'staff', name: 'S. Narmatha', department: 'AI&DS' }
];

let staffWorkloads = [
    { username: 's_janarthini', department: 'IT', year: '2', subject: 'IT3401', subjectName: 'Web Technologies' },
    { username: 's_janarthini', department: 'IT', year: '3', subject: 'IT3502', subjectName: 'Full Stack Development' },
    
    // 🌟 RAMYA WORKLOADS (Username updated to 'ramya') 🌟
    { username: 'ramya', department: 'IT', year: '3', subject: 'CCS335', subjectName: 'cloud computing' },
    { username: 'ramya', department: 'AI&DS', year: '3', subject: 'CCS335', subjectName: 'cloud computing'},
    { username: 'ramya', department: 'AI&DS', year: '2', subject: 'AD25C01', subjectName: 'Exploratory Data Analysis'},
    
    { username: 'p_nandhini', department: 'IT', year: '3', subject: 'CS3551', subjectName: 'Distributed Computing' },
    { username: 's_narmatha', department: 'AI&DS', year: '3', subject: 'AD3501' , subjectName: 'Deep Learning'},
    { username: 's_narmatha', department: 'AI&DS', year: '2', subject: 'CS25C08' , subjectName: 'Data Structures'},
    { username: 's_narmatha', department: 'IT', year: '2', subject: 'CS25C08' , subjectName: 'Data Structures'}
];

let studentMarksStore = {};

// ------------------------------------------
// API ENDPOINTS
// ------------------------------------------

// 1. LOGIN API (CRASH-PROOF VERSION)
app.post('/api/login', async (req, res) => {
    try {
        // Default empty string set panrom, so empty-a vandhalum crash aagadhu
        const { username = "", password = "", role = "" } = req.body;
        
        // String-a convert panni trim panrom (Safe method)
        const cleanUser = String(username).trim();
        const cleanPass = String(password).trim();

        if (!cleanUser || !cleanPass) {
            return res.status(400).json({ success: false, message: 'Please enter both Username and Password!' });
        }

        // 🌟 LOGIC FOR STUDENT LOGIN 🌟
        if (role === 'student') {
            if (cleanUser !== cleanPass) {
                return res.status(401).json({ success: false, message: 'Invalid Password! Your Password is your Reg No.' });
            }

            let connection;
            try {
                connection = await pool.getConnection();
                const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [cleanUser]);
                
                if (rows.length > 0) {
                    const student = rows[0];
                    return res.json({ 
                        success: true, 
                        user: { 
                            username: student.id, 
                            role: 'student', 
                            name: student.name, 
                            department: student.department, 
                            year: student.year 
                        } 
                    });
                } else {
                    return res.status(401).json({ success: false, message: 'Student Reg No not found in Database!' });
                }
            } finally {
                if (connection) connection.release();
            }
        }

        // 🌟 LOGIC FOR STAFF, ADMIN, HOD, ADVISOR 🌟
        const user = users.find(u => 
            String(u.username).trim().toLowerCase() === cleanUser.toLowerCase() && 
            String(u.password).trim() === cleanPass && 
            u.role === role
        );

        if (user) {
            return res.json({ 
                success: true, 
                user: { username: user.username, role: user.role, name: user.name, department: user.department, year: user.year } 
            });
        }
        
        return res.status(401).json({ success: false, message: 'Invalid Username or Password!' });

    } catch (error) {
        console.error("Critical Login Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
// 2. ADD NEW STAFF MEMBER
app.post('/api/admin/add-staff', (req, res) => {
    const { username, name, department, password, year, subjectCode, subjectName } = req.body;

    if (!username || !name) {
        return res.status(400).json({ success: false, message: 'Staff ID and Name are required!' });
    }

    const cleanUsername = username.trim().toLowerCase();

    if (users.find(u => u.username.toLowerCase() === cleanUsername)) {
        return res.status(400).json({ success: false, message: 'Staff ID / Username already registered!' });
    }

    const newStaff = {
        username: cleanUsername,
        password: password || 'staff123',
        role: 'staff',
        name: name.trim(),
        department: department
    };
    users.push(newStaff);

    if (year && subjectCode && subjectName) {
        staffWorkloads.push({
            username: cleanUsername,
            department: department,
            year: year,
            subject: subjectCode.toUpperCase(),
            subjectName: subjectName
        });
    }

    const updatedStaffList = users.filter(u => u.role === 'staff').map(s => ({
        username: s.username, name: s.name, department: s.department
    }));

    return res.json({ success: true, message: 'Staff & Subject registered successfully!', staffList: updatedStaffList });
});

// 3. FETCH STAFF LIST BY DEPARTMENT
app.get('/api/staff-by-dept', (req, res) => {
    const { dept } = req.query;
    let staffList = users.filter(u => u.role === 'staff');

    if (dept && dept !== 'all') {
        const assignedStaffUsernames = staffWorkloads
            .filter(w => w.department === dept)
            .map(w => w.username);

        staffList = staffList.filter(u => 
            u.department === dept || assignedStaffUsernames.includes(u.username)
        );
    }
    return res.json({ 
        success: true, 
        staffList: staffList.map(s => ({ username: s.username, name: s.name, department: s.department })) 
    });
});

// 4. WORKLOAD APIS
app.get('/api/admin/workloads', (req, res) => {
    return res.json({ success: true, workloads: staffWorkloads || [] });
});

app.get('/api/staff/workload/:username', (req, res) => {
    const { username } = req.params;
    const workload = staffWorkloads.filter(w => 
        String(w.username).trim().toLowerCase() === String(username).trim().toLowerCase()
    );
    return res.json({ success: true, workload });
});

app.post('/api/admin/assign-staff', (req, res) => {
    const { username, department, year, subject, subjectName } = req.body;
    staffWorkloads.push({ username, department, year, subject, subjectName });
    return res.json({ success: true, message: 'Workload assigned successfully!' });
});

// 5. STUDENTS APIS (MYSQL CONNECTED)
app.get('/api/students', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM students');
        res.json({ success: true, students: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database fetch error' });
    } finally {
        if (connection) connection.release();
    }
});

// 🌟 MISSING API ADDED HERE - THIS FIXES THE "NO STUDENTS FOUND" ERROR 🌟
app.get('/api/students-for-marking', async (req, res) => {
    const { department, year, subject } = req.query;
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM students');
        
        // Accurate Filtering (Handles '3' and '3rd Year' mismatches gracefully)
        const matchedStudents = rows.filter(s => {
            const stuDept = String(s.department).trim().toUpperCase();
            const targetDept = String(department).trim().toUpperCase();
            const stuYear = String(s.year).replace(/[^0-9]/g, '');
            const targetYear = String(year).replace(/[^0-9]/g, '');
            return stuDept === targetDept && stuYear === targetYear;
        });

        // Attach Marks
        const finalStudents = matchedStudents.map(st => {
            const stMarks = studentMarksStore[st.id] || {};
            return {
                ...st,
                subjects: { [subject]: stMarks[subject] || {} }
            };
        });

        res.json({ success: true, students: finalStudents });
    } catch (err) {
        console.error("Fetch marking error:", err);
        res.status(500).json({ success: false, message: 'DB Error' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/students', async (req, res) => {
    const { id, name, department, year } = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query('INSERT INTO students (id, name, department, year) VALUES (?, ?, ?, ?)', [id, name, department, year]);
        const [updatedList] = await connection.query('SELECT * FROM students');
        res.json({ success: true, students: updatedList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add student to DB' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/students/bulk-add', async (req, res) => {
    const { students: newStudents, department, year } = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        for (const st of newStudents) {
            await connection.query(
                'INSERT INTO students (id, name, department, year) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
                [st.id, st.name, department, year]
            );
        }
        const [updatedList] = await connection.query('SELECT * FROM students');
        res.json({ success: true, students: updatedList });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Bulk upload failed' });
    } finally {
        if (connection) connection.release();
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const studentId = req.params.id;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query('DELETE FROM students WHERE id = ?', [studentId]);
        res.json({ success: true, message: 'Student deleted successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete student' });
    } finally {
        if (connection) connection.release();
    }
});

// 6. MARKS UPDATE API
app.post('/api/marks/update', (req, res) => {
    const { studentId, subjectCode, markType, value } = req.body;
    
    if (!studentMarksStore[studentId]) studentMarksStore[studentId] = {};
    if (!studentMarksStore[studentId][subjectCode]) {
        studentMarksStore[studentId][subjectCode] = { 
            cia1: 0, assignment1: 0, seminar1: 0, slot1: 0, 
            cia2: 0, model: 0, assignment2: 0, seminar2: 0, slot2: 0, 
            internalMark: 0 
        };
    }
    
    studentMarksStore[studentId][subjectCode][markType] = parseFloat(value) || 0;
    const marks = studentMarksStore[studentId][subjectCode];
    
    // SLOT 1 CALCULATION
    const cia1 = marks.cia1 || 0;
    const assign1 = marks.assignment1 || 0;
    const sem1 = marks.seminar1 || 0;
    const total1 = cia1 + assign1 + sem1; 
    marks.slot1 = Math.round((total1 / 100) * 20); 
    
    // SLOT 2 CALCULATION
    const cia2 = marks.cia2 || 0;
    const model = marks.model || 0;
    const convertedModel = (model / 100) * 60; 
    
    const bestExamMark = Math.max(cia2, convertedModel); 
    
    const assign2 = marks.assignment2 || 0;
    const sem2 = marks.seminar2 || 0;
    const total2 = bestExamMark + assign2 + sem2; 
    marks.slot2 = Math.round((total2 / 100) * 20); 
    
    // TOTAL INTERNAL MARK
    marks.internalMark = marks.slot1 + marks.slot2;

    return res.json({ success: true, updatedSubjectData: marks });
});

// 7. HOD & ADVISOR & STUDENT APIS 
app.get('/api/hod/department-marks/:dept', async (req, res) => {
    const dept = req.params.dept;
    let connection;
    try {
        connection = await pool.getConnection();
        const [students] = await connection.query('SELECT * FROM students WHERE department = ?', [dept]);
        let allSubjects = new Set();
        const studentsWithMarks = students.map(st => {
            const stMarks = studentMarksStore[st.id] || {};
            Object.keys(stMarks).forEach(sub => allSubjects.add(sub));
            return { ...st, subjects: stMarks };
        });
        res.json({ success: true, students: studentsWithMarks, subjects: Array.from(allSubjects) });
    } catch (err) { res.status(500).json({ success: false }); } 
    finally { if (connection) connection.release(); }
});

app.get('/api/advisor/class-marks', async (req, res) => {
    const { dept, year } = req.query;
    let connection;
    try {
        connection = await pool.getConnection();
        const [students] = await connection.query('SELECT * FROM students WHERE department = ? AND year = ?', [dept, year]);
        let allSubjects = new Set();
        const studentsWithMarks = students.map(st => {
            const stMarks = studentMarksStore[st.id] || {};
            Object.keys(stMarks).forEach(sub => allSubjects.add(sub));
            return { ...st, subjects: stMarks };
        });
        res.json({ success: true, students: studentsWithMarks, subjects: Array.from(allSubjects) });
    } catch (err) { res.status(500).json({ success: false }); } 
    finally { if (connection) connection.release(); }
});

app.get('/api/student/my-marks/:username', async (req, res) => {
    const username = req.params.username; 
    let connection;
    try {
        connection = await pool.getConnection();
        const [students] = await connection.query('SELECT * FROM students WHERE id = ?', [username]);
        if (students.length === 0) return res.json({ success: false });
        
        const student = students[0];
        const stMarks = studentMarksStore[student.id] || {};
        const marksArray = Object.keys(stMarks).map(subCode => ({
            subject_code: subCode,
            internal_mark: stMarks[subCode].internalMark || 0
        }));

        res.json({ success: true, student: { ...student, marks: marksArray } });
    } catch (err) { res.status(500).json({ success: false }); } 
    finally { if (connection) connection.release(); }
});


// -----------------------------------------
// PUDHU API: UPDATE STAFF DETAILS
// -----------------------------------------
app.put('/api/staff/:username', (req, res) => {
    const username = req.params.username;
    const { name, department } = req.body;
    
    // Find staff in users array
    const staffIndex = users.findIndex(u => u.username === username && u.role === 'staff');
    if (staffIndex !== -1) {
        users[staffIndex].name = name;
        users[staffIndex].department = department;
        res.json({ success: true, message: 'Staff updated successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Staff not found' });
    }
});

// -----------------------------------------
// PUDHU API: DELETE STAFF
// -----------------------------------------
app.delete('/api/staff/:username', (req, res) => {
    const username = req.params.username;
    const initialLength = users.length;
    
    // Remove from users list
    users = users.filter(u => !(u.username === username && u.role === 'staff'));
    
    // Remove their assigned workloads too
    staffWorkloads = staffWorkloads.filter(w => w.username !== username);

    if (users.length < initialLength) {
        res.json({ success: true, message: 'Staff deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Staff not found' });
    }
});

// -----------------------------------------
// 1. CLASS ADVISOR MARKS API (WITH SUBJECT COLUMNS)
// -----------------------------------------
app.get('/api/advisor/class-marks', async (req, res) => {
    const { dept = 'IT', year = '4' } = req.query;
    try {
        let connection = await pool.getConnection();
        
        // Fetch Students for this Dept & Year
        const [students] = await connection.query(
            'SELECT * FROM students WHERE UPPER(TRIM(department)) = UPPER(TRIM(?)) AND TRIM(year) = TRIM(?)', 
            [dept, year]
        );

        // Fetch All Marks
        const [marks] = await connection.query('SELECT * FROM marks');
        connection.release();

        const subjectsSet = new Set();

        const studentMap = students.map(st => {
            const studentMarks = {};
            marks.filter(m => String(m.studentId).trim() === String(st.id).trim()).forEach(m => {
                if (m.subjectCode) {
                    subjectsSet.add(m.subjectCode);
                    studentMarks[m.subjectCode] = {
                        internalMark: m.internalMark ?? m.total_mark ?? 0
                    };
                }
            });

            return {
                id: st.id,
                name: st.name,
                year: st.year,
                department: st.department,
                subjects: studentMarks
            };
        });

        return res.json({
            success: true,
            subjects: Array.from(subjectsSet), // Returns all unique subject codes
            students: studentMap
        });
    } catch (err) {
        console.error("Advisor Marks API Error:", err);
        return res.status(500).json({ success: false, message: 'Database error fetching advisor marks' });
    }
});

// -----------------------------------------
// 2. HOD DEPARTMENT MARKS API (WITH SUBJECT COLUMNS)
// -----------------------------------------
app.get('/api/hod/department-marks/:dept', async (req, res) => {
    const dept = req.params.dept;
    try {
        let connection = await pool.getConnection();
        
        const [students] = await connection.query(
            'SELECT * FROM students WHERE UPPER(TRIM(department)) = UPPER(TRIM(?))', 
            [dept]
        );

        const [marks] = await connection.query('SELECT * FROM marks');
        connection.release();

        const subjectsSet = new Set();

        const studentMap = students.map(st => {
            const studentMarks = {};
            marks.filter(m => String(m.studentId).trim() === String(st.id).trim()).forEach(m => {
                if (m.subjectCode) {
                    subjectsSet.add(m.subjectCode);
                    studentMarks[m.subjectCode] = {
                        internalMark: m.internalMark ?? m.total_mark ?? 0
                    };
                }
            });

            return {
                id: st.id,
                name: st.name,
                year: st.year,
                department: st.department,
                subjects: studentMarks
            };
        });

        return res.json({
            success: true,
            subjects: Array.from(subjectsSet),
            students: studentMap
        });
    } catch (err) {
        console.error("HOD Marks API Error:", err);
        return res.status(500).json({ success: false, message: 'Database error fetching HOD marks' });
    }
});

// START SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on https://localhost:${PORT}`));