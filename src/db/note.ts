import type { RowDataPacket } from 'mysql2';
import db from '.';
import type { GetNoteParams, NewNote, Note } from '../types/note';

export const getNote = async (params: GetNoteParams) => {
	const { userId, lectureId } = params;

	try {
		const [rows] = (await db.query(
			`SELECT * FROM lecture_note WHERE user_id = ? AND lecture_id = ?`,
			[userId, lectureId]
		)) as RowDataPacket[];
		const noteRow = rows[0];
		if (!noteRow) {
			return null;
		}
		const note: Note = {
			userId: noteRow.user_id,
			lectureId: noteRow.lecture_id,
			content: noteRow.content,
			createdAt: noteRow.created_at,
			updatedAt: noteRow.updated_at,
		};
		return note;
	} catch {
		throw new Error(
			`Failed to get note by lecture ID ${lectureId} for user ID ${userId}`
		);
	}
};

export const setNote = async (newNote: NewNote) => {
	const { userId, lectureId, content } = newNote;

	try {
		await db.query(
			`INSERT INTO lecture_note (user_id, lecture_id, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content = ?`,
			[userId, lectureId, content, content]
		);
	} catch {
		throw new Error(
			`Failed to set note for lecture ID ${lectureId} for user ID ${userId}`
		);
	}
};
