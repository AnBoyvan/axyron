import { useTranslations } from 'next-intl';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import type { AnalyticsByPriority } from '@/features/projects/utils/get-analytics-by-priority';

import {
	taskPriority,
	taskPriorityOptions,
} from '../../configs/task-priority-options';
import { taskStatuses } from '../../configs/task-status-options';
import { TASK_STATUS_KEYS } from '../../constants';

interface ChartPriorityWithStatusProps {
	data: AnalyticsByPriority;
}

export const ChartPriorityWithStatus = ({
	data,
}: ChartPriorityWithStatusProps) => {
	const t = useTranslations();

	const chartData = taskPriorityOptions.map(({ value: priority }) => ({
		priority,
		...Object.fromEntries(
			TASK_STATUS_KEYS.map(status => [status, data[priority][status]]),
		),
		total: TASK_STATUS_KEYS.reduce(
			(sum, status) => sum + data[priority][status],
			0,
		),
	}));

	const config = {
		...Object.fromEntries(
			TASK_STATUS_KEYS.map(status => [
				status,
				{
					label: t(taskStatuses[status].label),
					color: taskStatuses[status].oklch,
				},
			]),
		),
		...Object.fromEntries(
			taskPriorityOptions.map(({ value: priority }) => [
				priority,
				{ label: t(taskPriority[priority].label) },
			]),
		),
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm lg:text-base">
					{t('tasks.chart_title.by_priority_with_status')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<BarChart
						accessibilityLayer
						data={chartData}
						barCategoryGap="20%"
						margin={{ left: -40, top: 16 }}
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
											fill="currentColor"
											fontSize={12}
											className="fill-muted-foreground"
										>
											{t(priorityEntry.label)}
										</text>
									</g>
								);
							}}
						/>
						<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
						{TASK_STATUS_KEYS.map((status, idx) => (
							<Bar
								key={status}
								dataKey={status}
								stackId="a"
								fill={taskStatuses[status].oklch}
								radius={[0, 0, 0, 0]}
								isAnimationActive={false}
							>
								{idx === TASK_STATUS_KEYS.length - 1 && (
									<LabelList
										dataKey="total"
										position="top"
										className="fill-foreground text-xs"
									/>
								)}
							</Bar>
						))}
						<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
