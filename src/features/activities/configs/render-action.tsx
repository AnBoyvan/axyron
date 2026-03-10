import type { Activity } from '../types';
import { ArchivedAction } from '../ui/components/archived-action';
import { AssignedAction } from '../ui/components/assigned-action';
import { CreatedAction } from '../ui/components/created-action';
import { DateAction } from '../ui/components/date-action';
import { DeletedAction } from '../ui/components/deleted-action';
import { PriorityAction } from '../ui/components/priority-action';
import { RenamedAction } from '../ui/components/renamed-action';
import { StatusAction } from '../ui/components/status-action';
import { UnassignedAction } from '../ui/components/unassigned-action';
import { VisibilityAction } from '../ui/components/visibility-action';

export const renderAction = (activity: Activity) => {
	switch (activity.action) {
		case 'created':
			return <CreatedAction activity={activity} />;

		case 'renamed':
			return <RenamedAction activity={activity} />;

		case 'deleted':
			return <DeletedAction activity={activity} />;

		case 'assigned':
			return <AssignedAction activity={activity} />;

		case 'unassigned':
			return <UnassignedAction activity={activity} />;

		case 'status':
			return <StatusAction activity={activity} />;

		case 'priority':
			return <PriorityAction activity={activity} />;

		case 'start_date':
		case 'due_date':
			return <DateAction activity={activity} />;

		case 'archived':
		case 'restored':
			return <ArchivedAction activity={activity} />;

		case 'visibility':
			return <VisibilityAction activity={activity} />;

		default:
			return null;
	}
};
