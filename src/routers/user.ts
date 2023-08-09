import { Request, Response, Router } from 'express';
import {
	createUser,
	getAllUsers,
	getUserByEmail,
	getUserById,
} from '../db/user';
import { isAdmin } from '../middleware';
import type { NewUser } from '../types/user';

const userRouter = Router();

userRouter.get('/', async (_req: Request, res: Response) => {
	try {
		const users = await getAllUsers();
		res.status(200).json({ users });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

userRouter.post('/', isAdmin, async (req: Request, res: Response) => {
	const newUser = req.body as NewUser;

	if (
		!newUser.email ||
		!newUser.password ||
		!newUser.userType ||
		!newUser.fullName
	) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		const existingUser = await getUserByEmail(newUser.email);
		if (existingUser) {
			return res.status(409).json({ error: 'User already exists' });
		}
		await createUser(newUser);
		res.sendStatus(201);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

userRouter.get('/me', async (req: Request, res: Response) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Not logged in' });
	}

	try {
		const user = await getUserById(req.session.userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

userRouter.get('/:userId', async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		const user = await getUserById(userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default userRouter;
