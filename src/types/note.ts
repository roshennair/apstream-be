export type GetNoteParams = {
	userId: string;
	lectureId: string;
};

export type Note = {
	userId: string;
	lectureId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type NewNote = {
	userId: string;
	lectureId: string;
	content: string;
};
