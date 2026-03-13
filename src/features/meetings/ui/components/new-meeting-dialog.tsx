import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlusIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { DateField } from '@/components/form/date-field';
import { DurationField } from '@/components/form/duration-field';
import { InputField } from '@/components/form/input-field';
import { MembersField } from '@/components/form/members-field';
import { TextareaField } from '@/components/form/textarea-field';
import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useOrgMembersForMeeting } from '@/features/organizations/hooks/use-org-members-for-meeting';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import { useCreateMeeting } from '../../hooks/use-create-meeting';
import {
	type CreateMeetingSchema,
	createMeetingSchema,
} from '../../schemas/create-meeting-schema';

interface NewMeetingDialogProps {
	orgId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
	orgId,
	open,
	onOpenChange,
}: NewMeetingDialogProps) => {
	const t = useTranslations();

	const form = useForm<CreateMeetingSchema>({
		resolver: zodResolver(createMeetingSchema),
		defaultValues: {
			title: '',
			description: '',
			meetingUrl: '',
			startTime: (() => {
				const date = new Date();
				date.setHours(15, 0, 0, 0);
				return date;
			})(),
			duration: 60,
			organizationId: orgId,
			memberIds: [],
		},
	});

	const { data, isLoading } = useOrgMembersForMeeting(orgId);

	const createMeeting = useCreateMeeting();

	const onCancel = () => {
		onOpenChange(false);
		form.reset();
	};

	const onSubmit = (values: CreateMeetingSchema) => {
		createMeeting.mutate(
			{ ...values },
			{
				onSuccess: () => {
					onCancel();
				},
			},
		);
	};

	const addedMembers = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.filter(item => form.watch('memberIds')?.includes(item.userId));
	}, [data, form.watch('memberIds')]);

	const users = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.map(item => ({
			userId: item.userId,
			name: item.name,
			image: item.image,
			email: item.email,
		}));
	}, [data]);

	return (
		<ResponsiveDialog
			title={t('meetings.new_title')}
			description={t('meetings.new_description')}
			open={open}
			onOpenChange={onCancel}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<InputField
						control={form.control}
						name="title"
						disabled={createMeeting.isPending}
						label={t('common.title')}
						placeholder={t('meetings.title_placeholder')}
					/>
					<TextareaField
						control={form.control}
						name="description"
						disabled={createMeeting.isPending}
						label={t('common.description')}
						placeholder={t('meetings.description_placeholder')}
					/>
					<InputField
						control={form.control}
						name="meetingUrl"
						disabled={createMeeting.isPending}
						label={t('common.link')}
						placeholder={t('meetings.link_placeholder')}
					/>
					<div className="grid grid-cols-5 gap-4 overflow-hidden">
						<div className="col-span-3">
							<DateField
								control={form.control}
								disabled={createMeeting.isPending}
								name="startTime"
								label={t('common.start_time')}
								placeholder={t('common.not_set')}
								withTime
							/>
						</div>
						<div className="col-span-2">
							<DurationField
								control={form.control}
								disabled={createMeeting.isPending}
								name="duration"
								label={t('common.duration')}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label>{t('common.attendees')}</Label>
						<MembersField
							control={form.control}
							name="memberIds"
							label={t('common.attendees')}
							users={users}
							isLoading={isLoading}
							disabled={createMeeting.isPending}
						>
							<Button size="sm" variant="select" className="w-fit">
								<UserPlusIcon />
								{t('actions.invite')}
							</Button>
						</MembersField>
						{addedMembers.map(member => (
							<div
								key={member.userId}
								className="flex w-full items-center gap-2"
							>
								<UserAvatar imageUrl={member.image} name={member.name} />
								<span className="truncate text-sm">{member.name}</span>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() =>
										form.setValue(
											'memberIds',
											form
												.watch('memberIds')
												?.filter(item => item !== member.userId),
										)
									}
								>
									<XIcon className="text-destructive" />
								</Button>
							</div>
						))}
					</div>
					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={createMeeting.isPending}
							variant="ghost"
							onClick={onCancel}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={createMeeting.isPending}>
							{t('actions.create')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
