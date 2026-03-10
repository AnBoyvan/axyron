import { useTranslations } from 'next-intl';

import type { Activity } from '../../types';

interface ArchivedActionProps {
	activity: Activity;
}

export const ArchivedAction = ({ activity }: ArchivedActionProps) => {
	const t = useTranslations();
	const isRestored = activity.action === 'restored';

	return (
		<>
			{t(
				isRestored
					? 'activities.action.restored'
					: 'activities.action.archived',
			)}
		</>
	);
};
