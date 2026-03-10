import { useTranslations } from 'next-intl';

import type { Activity } from '../types';

export const useActivityText = (activity: Activity): string => {
	const t = useTranslations();
	const { action, entityType, meta, entity } = activity;

	const entityName = entity?.title ?? entity?.name ?? entity?.email ?? '';

	console.log({
		entityName,
		text: t('activities.created', {
			entity: t(`activities.type.${entityType}`),
			name: entityName,
		}),
	});

	switch (action) {
		case 'created':
			return t('activities.created', {
				entity: t(`activities.type.${entityType}`),
				name: entityName,
			});

		case 'renamed':
			return t('activities.renamed', {
				from: meta?.from ?? '',
				to: meta?.to ?? '',
			});

		case 'deleted':
			return t('activities.deleted', {
				entity: t(`activities.type.${entityType}`),
				name: meta?.title ?? entityName,
			});

		case 'assigned':
			return t('activities.assigned', { name: entityName });

		case 'unassigned':
			return t('activities.unassigned', { name: entityName });

		case 'status':
			return t('activities.status', {
				from: meta?.from ?? '',
				to: meta?.to ?? '',
			});

		case 'priority':
			return t('activities.priority', {
				from: meta?.from ?? '',
				to: meta?.to ?? '',
			});

		case 'start_date':
			return t('activities.start_date', {
				to: meta?.to ?? t('activities.none'),
			});

		case 'due_date':
			return t('activities.due_date', { to: meta?.to ?? t('activities.none') });

		case 'archived':
			return t('activities.archived');

		case 'restored':
			return t('activities.restored');

		case 'visibility':
			return t('activities.visibility', { to: meta?.to ?? '' });

		default:
			return action;
	}
};
