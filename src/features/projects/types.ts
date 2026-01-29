export type ProjectMemberDTO = {
	userId: string;
	role: 'admin' | 'member';
	name: string;
	image: string | null;
	email: string;
	phone: string | null;
};
