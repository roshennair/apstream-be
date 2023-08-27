import RedisStore from 'connect-redis';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { createClient } from 'redis';
import { getMetrics } from './db';
import { isAdmin } from './middleware';
import authRouter from './routers/auth';
import commentRouter from './routers/comment';
import lectureRouter from './routers/lecture';
import moduleRouter from './routers/module';
import noteRouter from './routers/note';
import searchRouter from './routers/search';
import userRouter from './routers/user';

const app = express();
const port = process.env.PORT ?? 3001;

const redisClient = createClient();
redisClient.connect().catch(console.error);

declare module 'express-session' {
	interface SessionData {
		userId: string;
	}
}

app.use(
	cors({
		origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: process.env.SESSION_SECRET ?? 'secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: false,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
		},
	})
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/module', moduleRouter);
app.use('/search', searchRouter);
app.use('/lecture', lectureRouter);
app.use('/comment', commentRouter);
app.use('/note', noteRouter);

app.get('/metrics', isAdmin, async (_req, res) => {
	try {
		const metrics = await getMetrics();
		res.status(200).json({ metrics });
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

app.listen(port, () => {
	console.log(`APStream server is listening on port ${process.env.PORT}`);
});
