type sn = string | number;

type HashMap = { [key: string]: string };

type User = {
	uid: string;
	displayName: string;
	email: string;
	photoURL?: string;
	providerId?: string;
	emailVerified?: boolean;
	collectiveProjects: HashMap[];
};

type LoginForm = {
	email: string;
	password: string;
};

type env = {
	production: boolean;
	domain: string;
	firebase?: HashMap;
};

type Participant = {
	uid: string;
	email: string;
	name?: string;
};