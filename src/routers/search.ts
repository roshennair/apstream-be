import { Router } from 'express';
import { searchLectures } from '../db/lecture';
import {
	searchLecturersUnassignedToModule,
	searchStudentsUnassignedToModule,
} from '../db/user';

const searchRouter = Router();

searchRouter.get('/users/lecturers/unassigned/:moduleId', async (req, res) => {
	const { moduleId } = req.params;
	const { lecturer_query: lecturerQuery } = req.query;

	if (!moduleId || !lecturerQuery) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const lecturers = await searchLecturersUnassignedToModule(
			lecturerQuery as string,
			moduleId as string
		);
		res.status(200).json({ lecturers });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

searchRouter.get('/users/students/unassigned/:moduleId', async (req, res) => {
	const { moduleId } = req.params;
	const { student_query: studentQuery } = req.query;

	if (!moduleId || !studentQuery) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const students = await searchStudentsUnassignedToModule(
			studentQuery as string,
			moduleId as string
		);
		res.status(200).json({ students });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

searchRouter.get('/lectures', async (req, res) => {
	const { q: searchQuery } = req.query;

	if (!searchQuery) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const lectures = await searchLectures(searchQuery as string);
		res.status(200).json({ lectures });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

export default searchRouter;
