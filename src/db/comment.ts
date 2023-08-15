import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';
import type { Comment, NewComment } from '../types/comment';
import db from './';

export const getCommentsByLectureId = async (lectureId: string) => {
	try {
		const [rows] = (await db.query(
			`SELECT lecture_comment.*, user.full_name AS user_name
            FROM lecture_comment LEFT JOIN user 
            ON lecture_comment.user_id = user.id
            WHERE lecture_id = ?`,
			[lectureId]
		)) as RowDataPacket[];
		const comments: Comment[] = rows.map((commentRow: any) => {
			return {
				id: commentRow.id,
				lectureId: commentRow.lecture_id,
				parentId: commentRow.parent_id,
				userId: commentRow.user_id,
				userName: commentRow.user_name,
				content: commentRow.content,
				createdAt: commentRow.created_at,
				updatedAt: commentRow.updated_at,
			};
		});
		return comments;
	} catch {
		throw new Error(`Failed to get comments by lecture ID ${lectureId}`);
	}
};

export const createComment = async (newComment: NewComment) => {
	const id = randomUUID();
	try {
		await db.query(
			`INSERT INTO lecture_comment (id, lecture_id, parent_id, user_id, content)
            VALUES (?, ?, ?, ?, ?)`,
			[
				id,
				newComment.lectureId,
				newComment.parentId,
				newComment.userId,
				newComment.content,
			]
		);
	} catch {
		throw new Error('Failed to create comment');
	}
};

export const deleteComment = async (commentId: string) => {
	try {
		await db.query(`DELETE FROM lecture_comment WHERE id = ?`, [commentId]);
	} catch {
		throw new Error(`Failed to delete comment ${commentId}`);
	}
};
