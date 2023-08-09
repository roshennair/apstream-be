import type { NextFunction, Request, Response } from 'express';
import { getUserById } from './db/user';

export const isAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.session;

	if (!userId || userId.length === 0) {
		return res.status(401).json({ error: 'Not logged in' });
	}

	try {
		const user = await getUserById(userId);
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		if (user.userType !== 'admin') {
			return res.status(401).json({ error: 'Not admin' });
		}

		next();
	} catch (err) {
		return res.status(500).json({ error: 'Failed to verify admin status' });
	}
};
