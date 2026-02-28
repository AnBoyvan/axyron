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

import { taskStatuses } from '../../configs/task-status-options';
import { TASK_STATUS_KEYS } from '../../constants';

interface ChartMemberWithStatusProps {
	data: AnalyticsByMembers;
}

export const ChartMemberWithStatus = ({ data }: ChartMemberWithStatusProps) => {
	const t = useTranslations();
	const [selectedId, setSelectedId] = useState<string>('not_assigned');

	const selectedStats =
		selectedId === 'not_assigned'
			? data.notAssigned
			: data.members.find(m => m.userId === selectedId);

	const chartData = selectedStats
		? TASK_STATUS_KEYS.map(status => ({
				status,
				value: selectedStats.byStatus[status],
			}))
		: [];

	const config = Object.fromEntries(
		TASK_STATUS_KEYS.map(status => [
			status,
			{
				label: t(taskStatuses[status].label),
				color: taskStatuses[status].oklch,
			},
		]),
	) satisfies ChartConfig;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-sm lg:text-base">
					{t('tasks.chart_title.by_member_with_status')}
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
							dataKey="status"
							tickMargin={5}
							interval={0}
							tick={({ x, y, payload }) => {
								const statusEntry =
									taskStatuses[payload.value as keyof typeof taskStatuses];
								if (!statusEntry) return <g />;
								const Icon = statusEntry.icon;
								return (
									<g transform={`translate(${x},${y})`}>
										<foreignObject x={-8} y={0} width={16} height={16}>
											<Icon className={`size-4 ${statusEntry.iconStyle}`} />
										</foreignObject>
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
									key={entry.status}
									fill={
										taskStatuses[entry.status as keyof typeof taskStatuses]
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
