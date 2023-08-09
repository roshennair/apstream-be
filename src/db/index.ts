import mysql2, { RowDataPacket } from 'mysql2/promise';

const pool = mysql2.createPool(process.env.DATABASE_URL ?? '');

export const getMetrics = async () => {
	try {
		const [rows] = (await pool.query(
			`SELECT (SELECT COUNT(*) FROM user WHERE user_type = 'student') as studentCount, (SELECT COUNT(*) FROM user WHERE user_type = 'lecturer') as lecturerCount, (SELECT COUNT(*) FROM module) as moduleCount`
		)) as RowDataPacket[];
		return {
			studentCount: rows[0].studentCount,
			lecturerCount: rows[0].lecturerCount,
			moduleCount: rows[0].moduleCount,
			videoCount: 0,
		};
	} catch {
		throw new Error(`Failed to get metrics`);
	}
};

export default pool;
