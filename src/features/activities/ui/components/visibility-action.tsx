import { useTranslations } from 'next-intl';

import type { ProjectVisibilityType } from '@/features/projects/types';

import type { Activity, ActivityMeta } from '../../types';

interface VisibilityActionProps {
	activity: Activity;
}

export const VisibilityAction = ({ activity }: VisibilityActionProps) => {
	const t = useTranslations();
	const meta = activity.meta as ActivityMeta | null;

	const visibility = meta?.to as ProjectVisibilityType;

	return (
		<>
			{t.rich('activities.action.visibility', {
				to: t(`projects.${visibility}`),
				b: chunks => <strong>{chunks}</strong>,
			})}
		</>
	);
};
