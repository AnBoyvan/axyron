import z from 'zod';

export const updateOrgMemberSchema = z.object({
	role: z.enum(['admin', 'member']).optional(),
	canInvite: z.boolean().optional(),
	canRemoveMember: z.boolean().optional(),
	canUpdate: z.boolean().optional(),
	canCreateProject: z.boolean().optional(),
	canCreateMeeting: z.boolean().optional(),
});

export type UpdateOrgMemberSchema = z.infer<typeof updateOrgMemberSchema>;
