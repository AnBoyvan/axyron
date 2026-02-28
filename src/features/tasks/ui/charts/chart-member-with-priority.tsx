import { useState } from 'react';

import { useTranslations } from 'next-intl';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { AnalyticsByMembers } from '@/features/projects/utils/get-analytics-by-members';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import {
	taskPriority,
	taskPriorityOptions,
} from '../../configs/task-priority-options';

interface ChartMemberWithPriorityProps {
	data: AnalyticsByMembers;
}

export const ChartMemberWithPriority = ({
	data,
}: ChartMemberWithPriorityProps) => {
	const t = useTranslations();
	const [selectedId, setSelectedId] = useState<string>('not_assigned');

	const selectedStats =
		selectedId === 'not_assigned'
			? data.notAssigned
			: data.members.find(m => m.userId === selectedId);

	const chartData = selectedStats
		? taskPriorityOptions.map(({ value: priority }) => ({
				priority,
				value: selectedStats.byPriority[priority],
			}))
		: [];

	const config = Object.fromEntries(
		taskPriorityOptions.map(({ value: priority }) => [
			priority,
			{
				label: t(taskPriority[priority].label),
				color: taskPriority[priority].oklch,
			},
		]),
	) satisfies ChartConfig;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-sm lg:text-base">
					{t('tasks.chart_title.by_member_with_priority')}
				</CardTitle>
				<Select value={selectedId} onValueChange={setSelectedId}>
					<SelectTrigger className="h-7 w-40 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="not_assigned">
							<span className="text-xs">{t('tasks.not_assigned')}</span>
						</SelectItem>
						{data.members.map(member => (
							<SelectItem key={member.userId} value={member.userId}>
								<div className="flex items-center gap-2">
									<UserAvatar
										size="xs"
										imageUrl={member.image ?? undefined}
										name={member.name}
									/>
									<span className="text-xs">{member.name}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<BarChart
						accessibilityLayer
						data={chartData}
						barCategoryGap="20%"
						margin={{ left: -10, top: 16 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="priority"
							tickMargin={5}
							interval={0}
							tick={({ x, y, payload }) => {
								const priorityEntry =
									taskPriority[payload.value as keyof typeof taskPriority];
								if (!priorityEntry) return <g />;
								return (
									<g transform={`translate(${x},${y})`}>
										<text
											x={0}
											y={0}
											dy={12}
											textAnchor="middle"
											fontSize={12}
											className="fill-muted-foreground"
										>
											{t(priorityEntry.label)}
										</text>
									</g>
								);
							}}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							allowDecimals={false}
							width={30}
						/>
						<Bar
							dataKey="value"
							radius={[0, 0, 0, 0]}
							isAnimationActive={false}
						>
							<LabelList
								dataKey="value"
								position="top"
								className="fill-foreground text-xs"
							/>
							{chartData.map(entry => (
								<Cell
									key={entry.priority}
									fill={
										taskPriority[entry.priority as keyof typeof taskPriority]
											.oklch
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
