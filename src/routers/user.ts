import { Request, Response, Router } from 'express';
import { createUser, getUserByEmail, getUserById } from '../db';
import { isAdmin } from '../middleware';
import type { NewUserDetails } from '../types/user';

const userRouter = Router();

userRouter.get('/', async (req: Request, res: Response) => {
	const { userId } = req.session;

	if (!userId || userId.length === 0) {
		return res.status(401).json({ error: 'Not logged in' });
	}

	try {
		const user = await getUserById(userId);
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		res.status(200).json({ self: user });
	} catch (err) {
		res.status(500).json({ error: 'Failed to get user' });
	}
});

userRouter.post('/', isAdmin, async (req: Request, res: Response) => {
	const userDetails = req.body as NewUserDetails;

	if (
		!userDetails.email ||
		!userDetails.password ||
		!userDetails.userType ||
		!userDetails.fullName
	) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		const existingUser = await getUserByEmail(userDetails.email);
		if (existingUser) {
			return res.status(409).json({ error: 'User already exists' });
		}
		await createUser(userDetails);
		res.sendStatus(201);
	} catch (err) {
		res.status(500).json({ error: 'Failed to create user' });
	}
});

export default userRouter;
