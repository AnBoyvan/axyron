/** biome-ignore-all lint/complexity/noUselessFragments: Fragment needed */

import { useMemo, useState } from 'react';

import { LoaderIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { SearchFilter } from '@/components/shared/search-filter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOrgMembersForProject } from '@/features/organizations/hooks/use-org-members-for-project';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import { useAddMeetingMembers } from '../../hooks/use-add-meeting-members';

interface AddAttendeesDialogProps {
	meetingId: string;
	orgId: string;
	existedIds: string[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AddAttendeesDialog = ({
	meetingId,
	orgId,
	existedIds,
	open,
	onOpenChange,
}: AddAttendeesDialogProps) => {
	const t = useTranslations();

	const [search, setSearch] = useState('');

	const addMembers = useAddMeetingMembers();
	const { data, isLoading } = useOrgMembersForProject(orgId);

	const form = useForm<{ userIds: string[] }>({
		defaultValues: {
			userIds: [],
		},
	});

	const onCancel = () => {
		onOpenChange(false);
		form.reset();
	};

	const onSubmit = ({ userIds }: { userIds: string[] }) => {
		addMembers.mutate(
			{
				meetingId,
				userIds,
			},
			{
				onSuccess: () => {
					onCancel();
				},
			},
		);
	};

	const users = useMemo(() => {
		if (!data) {
			return [];
		}
		const filtered = data.filter(
			item =>
				!existedIds.includes(item.userId) &&
				item.name.toLowerCase().includes(search),
		);

		return filtered.map(item => ({
			userId: item.userId,
			name: item.name,
			image: item.image,
			email: item.email,
		}));
	}, [data, existedIds, search]);

	return (
		<ResponsiveDialog
			title={t('meetings.members_add_title')}
			description={t('meetings.members_add_description')}
			open={open}
			onOpenChange={onOpenChange}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="w-full">
						<SearchFilter
							value={search}
							onChange={setSearch}
							wrapperClassName="w-full"
							className="w-full md:w-full"
						/>
					</div>
					<FormField
						name={'userIds'}
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<LoaderIcon className="size-5 animate-spin text-muted-foreground" />
									</div>
								) : (
									<>
										{users.length > 0 ? (
											<ScrollArea className="md:max-h-96">
												<div className="grid grid-cols-2 gap-4">
													{users.map(user => (
														<Field
															key={user.userId}
															orientation="horizontal"
															data-invalid={fieldState.invalid}
														>
															<FormControl>
																<Checkbox
																	id={user.userId}
																	aria-invalid={fieldState.invalid}
																	checked={field.value.includes(user.userId)}
																	onCheckedChange={checked => {
																		const newValue = checked
																			? [...field.value, user.userId]
																			: field.value.filter(
																					(id: string) => id !== user.userId,
																				);
																		field.onChange(newValue);
																	}}
																/>
															</FormControl>
															<FieldLabel
																htmlFor={user.userId}
																className="w-fit overflow-hidden text-base"
															>
																<UserAvatar
																	size="sm"
																	imageUrl={user.image}
																	name={user.name}
																/>
																<span className="line-clamp-1">
																	{user.name}
																</span>
															</FieldLabel>
														</Field>
													))}
												</div>
											</ScrollArea>
										) : (
											<div className="flex h-6 items-center justify-center text-center">
												<p className="text-muted-foreground">
													{t('members.no_available_members')}
												</p>
											</div>
										)}
									</>
								)}
							</FormItem>
						)}
					/>
					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={addMembers.isPending || isLoading}
							variant="ghost"
							onClick={onCancel}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={addMembers.isPending || isLoading}>
							{t('actions.add')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
