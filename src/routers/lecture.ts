import { Request, Response, Router } from 'express';
import { getCommentsByLectureId } from '../db/comment';
import { createLecture, getLectureById } from '../db/lecture';
import { BunnyCreateVideoResponse, NewLecture } from '../types/lecture';

const lectureRouter = Router();

lectureRouter.get('/:lectureId', async (req: Request, res: Response) => {
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

lectureRouter.get(
	'/:lectureId/comments',
	async (req: Request, res: Response) => {
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
	}
);

lectureRouter.post('/', async (req: Request, res: Response) => {
	const newLecture = req.body as NewLecture;

	try {
		// Create new video on Bunny Stream
		const bunnyRes = await fetch(`${process.env.BUNNY_STREAM_URL}/videos`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/*+json',
				AccessKey: process.env.BUNNY_STREAM_API_KEY as string,
			},
			body: JSON.stringify({
				title: newLecture.title,
			}),
		});
		const { guid: videoId } =
			(await bunnyRes.json()) as BunnyCreateVideoResponse;
		newLecture.videoId = videoId;

		// Create new lecture in database
		const lectureId = await createLecture(newLecture);
		res.status(201).json({ lectureId, videoId });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default lectureRouter;
