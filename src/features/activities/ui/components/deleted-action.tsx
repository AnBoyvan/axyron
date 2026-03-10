import { useTranslations } from 'next-intl';

import { useEntityName } from '../../hooks/use-entity-name';
import type { Activity } from '../../types';

interface DeletedActionProps {
	activity: Activity;
}

export const DeletedAction = ({ activity }: DeletedActionProps) => {
	const t = useTranslations();

	const entityName = useEntityName(activity);

	return (
		<>
			{t.rich('activities.action.deleted', {
				entityType: t(`activities.type.${activity.entityType}`),
				entityName,
				b: chunks => <strong>{chunks}</strong>,
			})}
		</>
	);
};
