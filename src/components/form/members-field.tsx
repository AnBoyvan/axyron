/** biome-ignore-all lint/suspicious/noExplicitAny: use as shared form field */
/** biome-ignore-all lint/complexity/noUselessFragments: Fragment needed */

import { type ReactNode, useMemo, useState } from 'react';

import { LoaderIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';

import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import { SearchFilter } from '../shared/search-filter';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Field, FieldLabel } from '../ui/field';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';

type FormUser = {
	userId: string;
	name: string;
	email: string;
	image?: string | null;
};

interface MembersFieldProps {
	control: Control<any, any>;
	name: string;
	label: string;
	users?: FormUser[];
	children: ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
}

export const MembersField = ({
	name,
	control,
	label,
	users,
	children,
	isLoading,
	disabled,
}: MembersFieldProps) => {
	const t = useTranslations();

	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);

	const filteredUsers = useMemo(() => {
		if (!users) {
			return null;
		}

		return users.filter(user =>
			user.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [users, search]);

	return (
		<FormField
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormItem>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild disabled={disabled}>
							{children}
						</PopoverTrigger>
						<PopoverContent
							align="start"
							className="flex flex-col gap-y-2 p-0 pb-2"
						>
							<div className="relative flex h-8 w-full items-center px-2 pt-2">
								<Button
									size="icon"
									variant="ghost"
									className="absolute top-0 right-1"
									onClick={() => setOpen(false)}
								>
									<XIcon />
								</Button>
								<p className="w-full px-8 text-center text-sm">{label}</p>
							</div>
							<div className="w-full px-2">
								<SearchFilter
									value={search}
									onChange={setSearch}
									wrapperClassName="w-full"
									className="w-full md:w-full"
								/>
							</div>
							{isLoading ? (
								<div className="flex h-40 items-center justify-center">
									<LoaderIcon className="size-5 animate-spin text-muted-foreground" />
								</div>
							) : (
								<>
									{filteredUsers && filteredUsers.length > 0 ? (
										<ScrollArea className="max-h-64">
											<div className="flex max-h-64 min-h-40 flex-col gap-2 px-2">
												{filteredUsers.map(user => (
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
														<FieldLabel htmlFor={user.userId}>
															<UserAvatar
																size="sm"
																imageUrl={user.image}
																name={user.name}
															/>
															{user.name}
														</FieldLabel>
													</Field>
												))}
											</div>
										</ScrollArea>
									) : (
										<div className="flex h-40 items-center justify-center p-4 text-center">
											<p className="text-muted-foreground">
												{t('members.no_available_members')}
											</p>
										</div>
									)}
								</>
							)}
						</PopoverContent>
					</Popover>
				</FormItem>
			)}
		/>
	);
};
