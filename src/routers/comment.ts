import { Router } from 'express';
import { createComment, deleteComment } from '../db/comment';

const commentRouter = Router();

commentRouter.post('/', async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Not logged in' });
	}

	if (!req.body.lectureId || !req.body.content) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		await createComment({
			content: req.body.content,
			lectureId: req.body.lectureId,
			userId: req.session.userId,
			parentId: req.body.parentId,
		});
		res.sendStatus(201);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

// delete comment
commentRouter.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		await deleteComment(id);
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default commentRouter;
