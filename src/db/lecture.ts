import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';
import type { Lecture, NewLecture } from '../types/lecture';
import db from './';

export const getLecturesByModuleId = async (moduleId: string) => {
	try {
		const [rows] = (await db.query(
			`SELECT lecture.*, GROUP_CONCAT(lecture_tag.name) AS tags 
            FROM lecture LEFT JOIN lecture_tag 
            ON lecture.id = lecture_tag.lecture_id 
            WHERE lecture.module_id = ? 
            GROUP BY lecture.id 
            ORDER BY lecture.created_at DESC;`,
			[moduleId]
		)) as RowDataPacket[];
		const lectures: Lecture[] = rows.map((lectureRow: any) => {
			return {
				id: lectureRow.id,
				moduleId: lectureRow.module_id,
				videoId: lectureRow.video_id,
				title: lectureRow.title,
				description: lectureRow.description,
				durationSeconds: lectureRow.duration_seconds,
				tags: lectureRow.tags ? lectureRow.tags.split(',') : [],
				createdAt: lectureRow.created_at,
				updatedAt: lectureRow.updated_at,
			};
		});
		return lectures;
	} catch {
		throw new Error(`Failed to get lectures by module ID ${moduleId}`);
	}
};

export const getLectureById = async (id: string) => {
	try {
		const [rows] = (await db.query(
			`SELECT lecture.*, GROUP_CONCAT(lecture_tag.name) AS tags 
            FROM lecture LEFT JOIN lecture_tag 
            ON lecture.id = lecture_tag.lecture_id 
            WHERE lecture.id = ? 
            GROUP BY lecture.id`,
			[id]
		)) as RowDataPacket[];
		if (rows.length === 0) {
			return null;
		}
		const lectureRow = rows[0];
		const lecture: Lecture = {
			id: lectureRow.id,
			moduleId: lectureRow.module_id,
			videoId: lectureRow.video_id,
			title: lectureRow.title,
			description: lectureRow.description,
			durationSeconds: lectureRow.duration_seconds,
			createdAt: lectureRow.created_at,
			updatedAt: lectureRow.updated_at,
			tags: lectureRow.tags ? lectureRow.tags.split(',') : [],
		};
		return lecture;
	} catch {
		throw new Error(`Failed to get lecture by ID ${id}`);
	}
};

export const createLecture = async (newLecture: NewLecture) => {
	const lectureId = randomUUID();

	try {
		await db.query(
			`INSERT INTO lecture (id, module_id, video_id, title, description, duration_seconds) 
            VALUES (?, ?, ?, ?, ?, ?)`,
			[
				lectureId,
				newLecture.moduleId,
				newLecture.videoId,
				newLecture.title,
				newLecture.description,
				newLecture.durationSeconds,
			]
		);
	} catch {
		throw new Error(
			`Failed to create lecture with title ${newLecture.title}`
		);
	}

	try {
		const tags = newLecture.tags.split(',');
		for (const tagName of tags) {
			const tagId = randomUUID();
			await db.query(
				`INSERT INTO lecture_tag (id, lecture_id, name) VALUES (?, ?, ?)`,
				[tagId, lectureId, tagName.trim()]
			);
		}
	} catch {
		throw new Error(
			`Failed to create lecture tags for lecture with ID ${lectureId}`
		);
	}

	return lectureId;
};
