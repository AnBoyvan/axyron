import { useTranslations } from 'next-intl';

import type { Activity, ActivityMeta } from '../types';

export const useEntityName = (activity: Activity) => {
	const t = useTranslations();

	const meta = activity.meta as ActivityMeta | null;

	const existedEntityName = activity.entity?.name ?? activity.entity?.title;
	const metaName = meta?.title ?? meta?.name;

	const entityName = existedEntityName ?? metaName;

	if (!entityName && activity.entityType === 'user') {
		return t('users.deleted');
	}

	if (!entityName && activity.entityType === 'subtask') {
		return t('tasks.subtask_deleted');
	}

	return entityName ?? '';
};
