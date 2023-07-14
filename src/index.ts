import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (_req: Request, res: Response) => {
	res.send('Your mom!');
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
