import Link from 'next/link';

import { RocketIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { PLANS } from '@/lib/polar/plans';

import type { PlanKey } from '../../configs/plan-config';

interface PlanWidgetProps {
	orgId: string;
	plan: PlanKey;
	membersCount: number;
	projectsCount: number;
}

export const PlanWidget = ({
	orgId,
	plan,
	membersCount,
	projectsCount,
}: PlanWidgetProps) => {
	const t = useTranslations();
	const { state } = useSidebar();

	const limits = PLANS[plan];

	const membersPercent =
		limits.maxMembers === Infinity
			? 100
			: Math.min((membersCount / limits.maxMembers) * 100, 100);

	const projectsPercent =
		limits.maxProjects === Infinity
			? 100
			: Math.min((projectsCount / limits.maxProjects) * 100, 100);

	const membersLabel =
		limits.maxMembers === Infinity
			? `${membersCount}`
			: `${membersCount}/${limits.maxMembers}`;

	const projectsLabel =
		limits.maxProjects === Infinity
			? `${projectsCount}`
			: `${projectsCount}/${limits.maxProjects}`;

	if (state === 'collapsed') {
		return (
			<SidebarFooter className="mt-auto">
				<Link href={`/org/${orgId}/billing`}>
					<Button variant="ghost" size="icon" className="w-full">
						<RocketIcon className="size-4" />
					</Button>
				</Link>
			</SidebarFooter>
		);
	}

	return (
		<SidebarFooter className="mt-auto">
			<div className="rounded-lg bg-card p-3">
				<div className="mb-3 flex items-center gap-2">
					<RocketIcon className="size-4 shrink-0 text-primary" />
					<span className="font-medium text-sm capitalize">{plan}</span>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex flex-col gap-1">
						<div className="flex justify-between text-muted-foreground text-xs">
							<span>{t('common.members')}</span>
							<span>{membersLabel}</span>
						</div>
						<Progress value={membersPercent} className="h-1.5" />
					</div>

					<div className="flex flex-col gap-1">
						<div className="flex justify-between text-muted-foreground text-xs">
							<span>{t('common.projects')}</span>
							<span>{projectsLabel}</span>
						</div>
						<Progress value={projectsPercent} className="h-1.5" />
					</div>
				</div>

				{plan !== 'pro' && (
					<Button asChild size="sm" className="mt-3 w-full">
						<Link href={`/org/${orgId}/billing`}>{t('billing.upgrade')}</Link>
					</Button>
				)}
			</div>
		</SidebarFooter>
	);
};
