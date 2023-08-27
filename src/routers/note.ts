import { Router } from 'express';
import { setNote } from '../db/note';
import type { NewNote } from '../types/note';

const noteRouter = Router();

noteRouter.post('/', async (req, res) => {
	const { lectureId, content } = req.body as NewNote;

	if (!lectureId || !content) {
		return res.status(400).send('Missing required fields');
	}

	const { userId } = req.session;

	if (!userId) {
		return res.status(401).send('Not logged in');
	}

	try {
		await setNote({
			userId,
			lectureId,
			content,
		});
		res.sendStatus(201);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default noteRouter;
