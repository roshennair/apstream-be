export type GetBookmarksParams = {
	userId: string;
	lectureId: string;
};

export type NewBookmark = {
	userId: string;
	lectureId: string;
	timestampSeconds: number;
	label: string;
};

export type Bookmark = {
	id: string;
	userId: string;
	lectureId: string;
	timestampSeconds: number;
	label: string;
	createdAt: string;
	updatedAt: string;
};
