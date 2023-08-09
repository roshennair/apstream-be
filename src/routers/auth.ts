import { compare } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { getUserByEmail } from '../db/user';
import type { LoginParams } from '../types/auth';

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body as LoginParams;

	if (!email || !password) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	if (req.session.userId) {
		return res.status(400).json({ error: 'Already logged in' });
	}

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const passwordMatch = await compare(password, user.hashedPassword);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		req.session.userId = user.id;
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ error: 'Failed to login' });
	}
});

authRouter.post('/logout', async (req: Request, res: Response) => {
	if (!req.session.userId) {
		return res.status(400).json({ error: 'Not logged in' });
	}

	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ error: 'Failed to logout' });
		}
		res.sendStatus(200);
	});
});

export default authRouter;
