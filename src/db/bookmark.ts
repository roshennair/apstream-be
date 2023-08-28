import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';
import type {
	Bookmark,
	GetBookmarksParams,
	NewBookmark,
} from '../types/bookmark';
import db from './';

export const getBookmarks = async (params: GetBookmarksParams) => {
	const { userId, lectureId } = params;

	try {
		const [rows] = (await db.query(
			`SELECT * FROM lecture_bookmark 
            WHERE user_id = ? AND lecture_id = ?
            ORDER BY timestamp_seconds ASC`,
			[userId, lectureId]
		)) as RowDataPacket[];
		const bookmarks: Bookmark[] = rows.map((bookmarkRow: any) => {
			return {
				id: bookmarkRow.id,
				userId: bookmarkRow.user_id,
				lectureId: bookmarkRow.lecture_id,
				timestampSeconds: bookmarkRow.timestamp_seconds,
				label: bookmarkRow.label,
				createdAt: bookmarkRow.created_at,
				updatedAt: bookmarkRow.updated_at,
			};
		});
		return bookmarks;
	} catch {
		throw new Error(
			`Failed to get bookmarks by lecture ID ${lectureId} for user ID ${userId}`
		);
	}
};

export const createBookmark = async (newBookmark: NewBookmark) => {
	const id = randomUUID();

	try {
		await db.query(
			`INSERT INTO lecture_bookmark (id, user_id, lecture_id, timestamp_seconds, label) 
            VALUES (?, ?, ?, ?, ?)`,
			[
				id,
				newBookmark.userId,
				newBookmark.lectureId,
				newBookmark.timestampSeconds,
				newBookmark.label,
				newBookmark.timestampSeconds,
				newBookmark.label,
			]
		);
	} catch {
		throw new Error(
			`Failed to set bookmark for lecture ID ${newBookmark.lectureId} for user ID ${newBookmark.userId}`
		);
	}
};

export const deleteBookmark = async (bookmarkId: string) => {
	try {
		await db.query(`DELETE FROM lecture_bookmark WHERE id = ?`, [
			bookmarkId,
		]);
	} catch {
		throw new Error(`Failed to delete bookmark with ID ${bookmarkId}`);
	}
};
