import { CopyIcon, LinkIcon, TextIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { useMeetingById } from '../../hooks/use-meeting-by-id';
import { useUpdateMeeting } from '../../hooks/use-update-meeting';
import type { UpdateMeetingSchema } from '../../schemas/update-meeting-schema';
import {
	MeetingDatetime,
	MeetingDatetimeSkeleton,
} from '../components/meeting-datetime';
import {
	MeetingHeader,
	MeetingHeaderSkeleton,
} from '../components/meeting-header';
import { MeetingInlineField } from '../components/meeting-inline-field';
import {
	MeetingMembers,
	MeetingMembersSkeleton,
} from '../components/meeting-members';

interface MeetingMainSectionProps {
	meetingId: string;
}

export const MeetingMainSection = ({ meetingId }: MeetingMainSectionProps) => {
	const t = useTranslations();

	const { data } = useMeetingById(meetingId);

	const updateMeeting = useUpdateMeeting();

	const onUpdate = (values: UpdateMeetingSchema) => {
		updateMeeting.mutate({
			meetingId: data.id,
			data: values,
		});
	};

	const onCopyLink = async () => {
		if (data.meetingUrl) {
			await navigator.clipboard.writeText(data.meetingUrl);
			toast.success(t('common.link_copied'));
		}
	};

	return (
		<div className="flex flex-col">
			<MeetingHeader meeting={data} />
			<div className="flex flex-col gap-6 p-4 lg:p-8">
				<MeetingInlineField
					value={data.title}
					onSave={title => onUpdate({ title })}
					canEdit={data.permissions.isAdmin}
					className="font-semibold text-xl"
				/>
				<MeetingDatetime
					meeting={data}
					canEdit={data.permissions.isAdmin}
					onUpdate={onUpdate}
				/>
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<LinkIcon className="size-4" />
						<span className="font-medium text-xs uppercase tracking-wide">
							{t('common.link')}
						</span>
					</div>
					<MeetingInlineField
						value={data.meetingUrl ?? ''}
						onSave={meetingUrl => onUpdate({ meetingUrl })}
						canEdit={data.permissions.isAdmin}
						placeholder={t('common.not_set')}
					/>
					{data.meetingUrl && (
						<Button
							size="xs"
							variant="secondary"
							onClick={onCopyLink}
							className="w-fit"
						>
							<CopyIcon />
							{t('actions.copy_link')}
						</Button>
					)}
				</div>
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<TextIcon className="size-4" />
						<span className="font-medium text-xs uppercase tracking-wide">
							{t('common.description')}
						</span>
					</div>
					<MeetingInlineField
						value={data.description ?? ''}
						onSave={description => onUpdate({ description })}
						canEdit={data.permissions.isAdmin}
						placeholder={t('tasks.description_empty')}
						multiline
					/>
				</div>
				<Separator />
				<MeetingMembers meeting={data} canEdit={data.permissions.isAdmin} />
			</div>
		</div>
	);
};

export const MeetingMainSectionSkeleton = () => {
	return (
		<div className="flex flex-col">
			<MeetingHeaderSkeleton />
			<div className="flex flex-col gap-6 p-4 lg:p-8">
				<div className="flex h-9 items-center px-2">
					<Skeleton className="h-5 w-60" />
				</div>
				<MeetingDatetimeSkeleton />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-3.5 w-16" />
					<div className="flex h-6.5 items-center px-2">
						<Skeleton className="h-4 w-56" />
					</div>
					<Skeleton className="h-6 w-20" />
				</div>
				<div className="flex flex-col gap-2.5">
					<Skeleton className="h-3.5 w-20" />
					<Skeleton className="h-4.5 w-full" />
					<Skeleton className="h-4.5 w-full" />
					<Skeleton className="h-4.5 w-2/3" />
				</div>
				<Separator />
				<MeetingMembersSkeleton />
			</div>
		</div>
	);
};
