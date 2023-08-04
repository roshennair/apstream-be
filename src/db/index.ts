import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import mysql2, { RowDataPacket } from 'mysql2/promise';
import type { NewUserDetails, User } from '../types/user';

const pool = mysql2.createPool(process.env.DATABASE_URL ?? '');

export const getUserByEmail = async (email: string) => {
	try {
		const [rows] = (await pool.query('SELECT * FROM user WHERE email = ?', [
			email,
		])) as RowDataPacket[];
		if (rows.length === 0) {
			return null;
		}
		const userRow = rows[0];
		const user: User = {
			id: userRow.id,
			email: userRow.email,
			hashedPassword: userRow.hashed_password,
			createdAt: userRow.created_at,
			updatedAt: userRow.updated_at,
			userType: userRow.user_type,
			fullName: userRow.full_name,
		};
		return user;
	} catch {
		throw new Error('Failed to get user');
	}
};

export const createUser = async (userDetails: NewUserDetails) => {
	const id = randomUUID();
	const hashedPassword = await hash(userDetails.password, 10);

	try {
		await pool.query(
			'INSERT INTO user (id, email, hashed_password, user_type, full_name) VALUES (?, ?, ?, ?, ?)',
			[
				id,
				userDetails.email,
				hashedPassword,
				userDetails.userType,
				userDetails.fullName,
			]
		);
	} catch (error) {
		throw new Error('Failed to create user');
	}
};
