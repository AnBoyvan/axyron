import { useTranslations } from 'next-intl';

import { useEntityName } from '../../hooks/use-entity-name';
import type { Activity } from '../../types';

interface AssignedActionProps {
	activity: Activity;
}

export const AssignedAction = ({ activity }: AssignedActionProps) => {
	const t = useTranslations();
	const entityName = useEntityName(activity);

	return (
		<>
			{t.rich('activities.action.assigned', {
				entityName,
				b: chunks => <strong>{chunks}</strong>,
			})}
		</>
	);
};
