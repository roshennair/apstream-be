import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';
import type { Module, NewModule } from '../types/module';
import db from './';

export const getAllModules = async () => {
	try {
		const [rows] = (await db.query(
			'SELECT * FROM module ORDER BY created_at DESC'
		)) as RowDataPacket[];
		const modules: Module[] = rows.map((moduleRow: any) => {
			return {
				id: moduleRow.id,
				name: moduleRow.name,
				code: moduleRow.code,
				createdAt: moduleRow.created_at,
				updatedAt: moduleRow.updated_at,
			};
		});
		return modules;
	} catch {
		throw new Error('Failed to get all modules');
	}
};

export const getModuleById = async (id: string) => {
	try {
		const [rows] = (await db.query('SELECT * FROM module WHERE id = ?', [
			id,
		])) as RowDataPacket[];
		if (rows.length === 0) {
			return null;
		}
		const moduleRow = rows[0];
		const module: Module = {
			id: moduleRow.id,
			name: moduleRow.name,
			code: moduleRow.code,
			createdAt: moduleRow.created_at,
			updatedAt: moduleRow.updated_at,
		};
		return module;
	} catch {
		throw new Error(`Failed to get module by ID ${id}`);
	}
};

export const getModuleByCode = async (code: string) => {
	try {
		const [rows] = (await db.query('SELECT * FROM module WHERE code = ?', [
			code,
		])) as RowDataPacket[];
		if (rows.length === 0) {
			return null;
		}
		const moduleRow = rows[0];
		const module: Module = {
			id: moduleRow.id,
			code: moduleRow.code,
			name: moduleRow.name,
			createdAt: moduleRow.created_at,
			updatedAt: moduleRow.updated_at,
		};
		return module;
	} catch {
		throw new Error(`Failed to get module by code ${code}`);
	}
};

export const createModule = async (newModule: NewModule) => {
	const id = randomUUID();

	try {
		await db.query('INSERT INTO module (id, name, code) VALUES (?, ?, ?)', [
			id,
			newModule.name,
			newModule.code,
		]);
	} catch (error) {
		throw new Error(`Failed to create module ${newModule.code}`);
	}
};
