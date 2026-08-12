import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'srikanth$123',
    database: 'internal_marks_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Connection Test
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL Database Successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
    }
})();

export default pool;