import { Request, Response, Router } from 'express';
import { createUser, getUserByEmail } from '../db';
import type { NewUserDetails } from '../types/user';

const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response) => {
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
