import { z } from 'zod';

export const updateOrgRuleSchema = z.object({
	rule: z.enum([
		'canInvite',
		'canCreateProject',
		'canCreateTask',
		'canCreateMeeting',
	]),
	value: z.boolean(),
});

export type UpdateOrgRuleSchema = z.infer<typeof updateOrgRuleSchema>;
