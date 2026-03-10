import { ActivityIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

import { TaskActivitySection } from '../sections/task-activity-section';

interface TaskActivityMobileProps {
	taskId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const TaskActivityMobile = ({
	taskId,
	open,
	onOpenChange,
}: TaskActivityMobileProps) => {
	const t = useTranslations();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent aria-describedby={undefined} className="gap-0">
				<SheetHeader className="flex flex-row items-center justify-center gap-2 border-b">
					<ActivityIcon className="size-4" />
					<SheetTitle>{t('common.activity')}</SheetTitle>
				</SheetHeader>
				<div className="max-h-full overflow-y-scroll">
					<TaskActivitySection taskId={taskId} />
				</div>
			</SheetContent>
		</Sheet>
	);
};
