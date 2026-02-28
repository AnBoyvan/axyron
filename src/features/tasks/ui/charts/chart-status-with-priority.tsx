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
import type { AnalyticsByStatus } from '@/features/projects/utils/get-analytics-by-status';

import {
	taskPriority,
	taskPriorityOptions,
} from '../../configs/task-priority-options';
import { taskStatuses } from '../../configs/task-status-options';
import { TASK_STATUS_KEYS } from '../../constants';

interface ChartStatusWithPriorityProps {
	data: AnalyticsByStatus;
}

export const ChartStatusWithPriority = ({
	data,
}: ChartStatusWithPriorityProps) => {
	const t = useTranslations();

	const chartData = TASK_STATUS_KEYS.map(status => ({
		status: t(taskStatuses[status].label),
		critical: data[status].critical,
		high: data[status].high,
		medium: data[status].medium,
		low: data[status].low,
		total:
			data[status].critical +
			data[status].high +
			data[status].medium +
			data[status].low,
	}));

	const config = {
		critical: {
			label: t(taskPriority.critical.label),
			color: taskPriority.critical.oklch,
		},
		high: {
			label: t(taskPriority.high.label),
			color: taskPriority.high.oklch,
		},
		medium: {
			label: t(taskPriority.medium.label),
			color: taskPriority.medium.oklch,
		},
		low: {
			label: t(taskPriority.low.label),
			color: taskPriority.low.oklch,
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm lg:text-base">
					{t('tasks.chart_title.by_status_with_priority')}
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
							dataKey="status"
							tickMargin={5}
							interval={0}
							tick={({ x, y, payload }) => {
								const statusEntry = Object.values(taskStatuses).find(
									s => t(s.label) === payload.value,
								);
								if (!statusEntry) return <g />;

								const Icon = statusEntry.icon;

								return (
									<g transform={`translate(${x},${y})`}>
										<foreignObject x={-10} y={0} width={16} height={16}>
											<Icon className={`size-4 ${statusEntry.iconStyle}`} />
										</foreignObject>
									</g>
								);
							}}
						/>
						<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
						{taskPriorityOptions.map((item, idx) => (
							<Bar
								key={item.value}
								dataKey={item.value}
								stackId="a"
								fill={item.oklch}
								radius={[0, 0, 0, 0]}
								isAnimationActive={false}
							>
								{idx === taskPriorityOptions.length - 1 && (
									<LabelList
										dataKey="total"
										position="top"
										className="fill-foreground text-xs"
									/>
								)}
							</Bar>
						))}
						<ChartTooltip
							content={<ChartTooltipContent />}
							cursor={false}
							defaultIndex={1}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
