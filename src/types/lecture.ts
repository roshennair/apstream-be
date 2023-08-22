export type Lecture = {
	id: string;
	moduleId: string;
	videoId: string;
	title: string;
	description: string;
	durationSeconds: number;
	tags: string[];
	createdAt: string;
	updatedAt: string;
};

export type NewLecture = {
	moduleId: string;
	title: string;
	description: string;
	tags: string;
	durationSeconds: number;
	videoId: string;
};

export type BunnyCreateVideoResponse = {
	guid: string;
	[key: string]: any;
};
