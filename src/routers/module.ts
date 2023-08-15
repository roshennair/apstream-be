import { Request, Response, Router } from 'express';
import { getLecturesByModuleId } from '../db/lecture';
import {
	createModule,
	getAllModules,
	getModuleByCode,
	getModuleById,
	getModulesByUserId,
} from '../db/module';
import {
	assignUserToModule,
	getUsersByModuleId,
	unassignUserFromModule,
} from '../db/user';
import { isAdmin } from '../middleware';
import { NewModule } from '../types/module';

const moduleRouter = Router();

moduleRouter.get('/', async (_req: Request, res: Response) => {
	try {
		const modules = await getAllModules();
		res.status(200).json({ modules });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

moduleRouter.get('/assigned', async (req: Request, res: Response) => {
	const { userId } = req.session;

	if (!userId) {
		return res.status(401).json({ error: 'Not logged in' });
	}

	try {
		const modules = await getModulesByUserId(userId);
		res.status(200).json({ modules });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

moduleRouter.get('/:moduleId', async (req: Request, res: Response) => {
	const { moduleId } = req.params;

	try {
		const module = await getModuleById(moduleId);
		if (!module) {
			return res.status(404).json({ error: 'Module not found' });
		}
		res.status(200).json({ module });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

moduleRouter.post('/', isAdmin, async (req: Request, res: Response) => {
	const newModule = req.body as NewModule;

	if (!newModule.code || !newModule.name) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		const existingModule = await getModuleByCode(newModule.code);
		if (existingModule) {
			return res.status(409).json({ error: 'Module already exists' });
		}
		await createModule(newModule);
		res.sendStatus(201);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

moduleRouter.get('/:moduleId/users', async (req: Request, res: Response) => {
	const { moduleId } = req.params;

	try {
		const users = await getUsersByModuleId(moduleId as string);
		res.status(200).json({ users });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
	return;
});

moduleRouter.post(
	'/:moduleId/assign/:userId',
	async (req: Request, res: Response) => {
		const { moduleId, userId } = req.params;

		if (!moduleId || !userId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		try {
			await assignUserToModule(userId, moduleId);
			res.sendStatus(200);
		} catch (err) {
			res.status(500).json({ error: (err as Error).message });
		}
	}
);

moduleRouter.post(
	'/:moduleId/unassign/:userId',
	async (req: Request, res: Response) => {
		const { moduleId, userId } = req.params;

		if (!moduleId || !userId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		try {
			await unassignUserFromModule(userId, moduleId);
			res.sendStatus(200);
		} catch (err) {
			res.status(500).json({ error: (err as Error).message });
		}
	}
);

moduleRouter.get('/:moduleId/lectures', async (req: Request, res: Response) => {
	const { moduleId } = req.params;

	try {
		const lectures = await getLecturesByModuleId(moduleId);
		res.status(200).json({ lectures });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
	return;
});

export default moduleRouter;
