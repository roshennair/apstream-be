import { Router } from 'express';
import { createBookmark, deleteBookmark } from '../db/bookmark';

const bookmarkRouter = Router();

bookmarkRouter.post('/', async (req, res) => {
	const { userId } = req.session;
	if (!userId) {
		return res.status(401).json({ error: 'Not logged in' });
	}

	const { lectureId, timestampSeconds, label } = req.body;
	if (!lectureId || !label || timestampSeconds === undefined) {
		return res.status(400).json({
			error: 'Missing required fields',
		});
	}

	try {
		await createBookmark({
			userId,
			lectureId,
			timestampSeconds,
			label,
		});
		res.sendStatus(201);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

bookmarkRouter.delete('/:bookmarkId', async (req, res) => {
	try {
		await deleteBookmark(req.params.bookmarkId);
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default bookmarkRouter;
