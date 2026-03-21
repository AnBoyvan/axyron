export const PLANS = {
	free: {
		maxMembers: 5,
		maxProjects: 1,
	},
	basic: {
		maxMembers: 25,
		maxProjects: 5,
	},
	pro: {
		maxMembers: Infinity,
		maxProjects: Infinity,
	},
} as const;

export type Plan = keyof typeof PLANS;
