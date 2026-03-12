import { type inferParserType, parseAsStringEnum, useQueryStates } from 'nuqs';

enum Variant {
	Assigned = 'assigned',
	Created = 'created',
}

const variantValues = Object.values(Variant);

const memberTasksVariantsParsers = {
	variant: parseAsStringEnum(variantValues).withOptions({
		clearOnDefault: true,
	}),
} as const;

export type MemberTasksVariant = inferParserType<
	typeof memberTasksVariantsParsers
>;

export const useMemberTasksVariant = () => {
	return useQueryStates(memberTasksVariantsParsers);
};
