import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';
import { NewUser, User } from '../types/user';
import db from './';

export const getUserById = async (id: string) => {
	try {
		const [rows] = (await db.query('SELECT * FROM user WHERE id = ?', [
			id,
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
		throw new Error(`Failed to get user by ID ${id}`);
	}
};

export const getUserByEmail = async (email: string) => {
	try {
		const [rows] = (await db.query('SELECT * FROM user WHERE email = ?', [
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
		throw new Error(`Failed to get user by email ${email}`);
	}
};

export const getAllUsers = async () => {
	try {
		const [rows] = (await db.query(
			'SELECT * FROM user ORDER BY created_at DESC'
		)) as RowDataPacket[];
		const users: User[] = rows.map((userRow: any) => {
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
		});
		return users;
	} catch {
		throw new Error('Failed to get all users');
	}
};

export const createUser = async (newUser: NewUser) => {
	const id = randomUUID();
	const hashedPassword = await hash(newUser.password, 10);

	try {
		await db.query(
			'INSERT INTO user (id, email, hashed_password, user_type, full_name) VALUES (?, ?, ?, ?, ?)',
			[
				id,
				newUser.email,
				hashedPassword,
				newUser.userType,
				newUser.fullName,
			]
		);
	} catch (error) {
		throw new Error(`Failed to create user ${newUser.email}`);
	}
};

export const getUsersByModuleId = async (moduleId: string) => {
	try {
		const [rows] = (await db.query(
			`SELECT * FROM user WHERE id IN (SELECT user_id FROM user_module WHERE module_id = ?) ORDER BY created_at DESC`,
			[moduleId]
		)) as RowDataPacket[];
		const users: User[] = rows.map((userRow: any) => {
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
		});
		return users;
	} catch {
		throw new Error(`Failed to get users by module ID ${moduleId}`);
	}
};

export const searchLecturersUnassignedToModule = async (
	lecturerQuery: string,
	moduleId: string
) => {
	try {
		const [rows] = (await db.query(
			`SELECT * FROM user WHERE user_type = 'lecturer' AND (LOWER(email) LIKE LOWER('%${lecturerQuery}%') OR LOWER(full_name) LIKE LOWER('%${lecturerQuery}%')) AND id NOT IN (SELECT user_id FROM user_module WHERE module_id = ?) ORDER BY created_at DESC`,
			[moduleId]
		)) as RowDataPacket[];
		const lecturers: User[] = rows.map((lecturerRow: any) => {
			const lecturer: User = {
				id: lecturerRow.id,
				email: lecturerRow.email,
				hashedPassword: lecturerRow.hashed_password,
				createdAt: lecturerRow.created_at,
				updatedAt: lecturerRow.updated_at,
				userType: lecturerRow.user_type,
				fullName: lecturerRow.full_name,
			};
			return lecturer;
		});
		return lecturers;
	} catch {
		throw new Error(
			`Failed to search lecturers unassigned to module ${moduleId} by query ${lecturerQuery}`
		);
	}
};

export const searchStudentsUnassignedToModule = async (
	studentQuery: string,
	moduleId: string
) => {
	try {
		const [rows] = (await db.query(
			`SELECT * FROM user WHERE user_type = 'student' AND (LOWER(email) LIKE LOWER('%${studentQuery}%') OR LOWER(full_name) LIKE LOWER('%${studentQuery}%')) AND id NOT IN (SELECT user_id FROM user_module WHERE module_id = ?) ORDER BY created_at DESC`,
			[moduleId]
		)) as RowDataPacket[];
		const students: User[] = rows.map((studentRow: any) => {
			const student: User = {
				id: studentRow.id,
				email: studentRow.email,
				hashedPassword: studentRow.hashed_password,
				createdAt: studentRow.created_at,
				updatedAt: studentRow.updated_at,
				userType: studentRow.user_type,
				fullName: studentRow.full_name,
			};
			return student;
		});
		return students;
	} catch {
		throw new Error(
			`Failed to search students unassigned to module ${moduleId} by query ${studentQuery}`
		);
	}
};

export const assignUserToModule = async (userId: string, moduleId: string) => {
	try {
		await db.query(
			'INSERT INTO user_module (user_id, module_id) VALUES (?, ?)',
			[userId, moduleId]
		);
	} catch {
		throw new Error(
			`Failed to assign user ${userId} to module ${moduleId}`
		);
	}
};

export const unassignUserFromModule = async (
	userId: string,
	moduleId: string
) => {
	try {
		await db.query(
			'DELETE FROM user_module WHERE user_id = ? AND module_id = ?',
			[userId, moduleId]
		);
	} catch {
		throw new Error(
			`Failed to remove user ${userId} from module ${moduleId}`
		);
	}
};
