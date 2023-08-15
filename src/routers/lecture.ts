import { Router } from 'express';
import { getCommentsByLectureId } from '../db/comment';
import { getLectureById } from '../db/lecture';

const lectureRouter = Router();

lectureRouter.get('/:lectureId', async (req, res) => {
	const { lectureId } = req.params;

	try {
		const lecture = await getLectureById(lectureId);
		if (!lecture) {
			return res.status(404).json({ error: 'Lecture not found' });
		}
		res.status(200).json({ lecture });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

lectureRouter.get('/:lectureId/comments', async (req, res) => {
	const { lectureId } = req.params;

	try {
		const lecture = await getLectureById(lectureId);
		if (!lecture) {
			return res.status(404).json({ error: 'Lecture not found' });
		}
		const comments = await getCommentsByLectureId(lectureId);
		res.status(200).json({ comments });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default lectureRouter;
