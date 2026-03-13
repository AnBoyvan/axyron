import { useState } from 'react';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useMeetingsByOrg } from '@/features/meetings/hooks/use-meetings-by-org';
import { NewMeetingDialog } from '@/features/meetings/ui/components/new-meeting-dialog';

interface MeetingsSectionProps {
	orgId: string;
	dateFrom?: string;
	dateTo?: string;
}

export const MeetingsSection = ({
	orgId,
	dateFrom,
	dateTo,
}: MeetingsSectionProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);

	const { data } = useMeetingsByOrg({
		orgId,
		dateFrom,
		dateTo,
	});

	return (
		<>
			<NewMeetingDialog orgId={orgId} open={open} onOpenChange={setOpen} />
			<div className="flex flex-col gap-4 lg:gap-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
					<div />
					<Button onClick={() => setOpen(true)}>
						<PlusIcon />
						{t('common.new')}
					</Button>
				</div>
			</div>
		</>
	);
};
