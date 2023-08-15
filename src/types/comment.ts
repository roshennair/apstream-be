export type Comment = {
	id: string;
	lectureId: string;
	parentId: string;
	userId: string;
	userName: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type NewComment = {
	lectureId: string;
	parentId: string;
	userId: string;
	content: string;
};
