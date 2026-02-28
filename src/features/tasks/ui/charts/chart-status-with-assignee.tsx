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
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from '@/components/ui/chart';
import type { AnalyticsByStatus } from '@/features/projects/utils/get-analytics-by-status';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import { taskStatuses } from '../../configs/task-status-options';
import { TASK_STATUS_KEYS } from '../../constants';

interface ChartStatusWithAssigneesProps {
	data: AnalyticsByStatus;
}

export const ChartStatusWithAssignees = ({
	data,
}: ChartStatusWithAssigneesProps) => {
	const t = useTranslations();

	const chartData = TASK_STATUS_KEYS.map(status => {
		const assignees = data[status].assignees;
		const notAssigned = data[status].notAssigned;
		const total = data[status].total;

		const assigneeParts: {
			key: string;
			label: string;
			count: number;
			image?: string | null;
		}[] = [];

		if (notAssigned > 0) {
			assigneeParts.push({
				key: 'not_assigned',
				label: t('tasks.not_assigned'),
				image: undefined,
				count: notAssigned,
			});
		}

		assignees
			.filter(a => a.count > 0)
			.forEach(a => {
				assigneeParts.push({
					key: a.userId,
					label: a.name,
					count: a.count,
					image: a.image,
				});
			});

		return {
			status,
			total,
			assigneeParts,
		};
	});

	const config = Object.fromEntries(
		TASK_STATUS_KEYS.map(status => [
			status as string,
			{
				label: t(taskStatuses[status as keyof typeof taskStatuses].label),
				color: taskStatuses[status as keyof typeof taskStatuses].oklch,
			},
		]),
	) satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm lg:text-base">
					{t('tasks.chart_title.by_status_with_assignees')}
				</CardTitle>
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
							dataKey="total"
							radius={[0, 0, 0, 0]}
							isAnimationActive={false}
						>
							<LabelList
								dataKey="total"
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
						<ChartTooltip
							cursor={false}
							content={({ active, payload }) => {
								if (!active || !payload?.length) return null;
								const entry = payload[0].payload;
								const statusEntry =
									taskStatuses[entry.status as keyof typeof taskStatuses];

								return (
									<div className="grid min-w-36 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
										<span className="font-medium">{t(statusEntry.label)}</span>
										<div className="grid gap-1.5">
											{entry.assigneeParts?.map(
												(part: {
													key: string;
													label: string;
													count: number;
													image?: string;
												}) => (
													<div
														key={part.key}
														className="flex w-full items-center gap-2"
													>
														{part.key !== 'not_assigned' && (
															<UserAvatar
																size="xs"
																imageUrl={part.image}
																name={part.label}
															/>
														)}
														<div className="flex flex-1 items-center justify-between leading-none">
															<span className="text-muted-foreground">
																{part.label}
															</span>
															<span className="ml-4 font-medium font-mono text-foreground tabular-nums">
																{part.count.toLocaleString()}
															</span>
														</div>
													</div>
												),
											)}
										</div>
									</div>
								);
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
