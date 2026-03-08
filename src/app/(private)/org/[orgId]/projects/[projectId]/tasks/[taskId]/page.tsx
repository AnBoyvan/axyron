import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULT_COMMENTS_LIMIT } from '@/features/task-comments/constants';
import { TaskView } from '@/features/tasks/ui/views/task-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ taskId: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { taskId } = await params;

	prefetch(trpc.tasks.getById.queryOptions({ taskId }));
	prefetch(
		trpc.taskComments.getByTask.infiniteQueryOptions({
			limit: DEFAULT_COMMENTS_LIMIT,
			taskId,
		}),
	);

	return (
		<HydrateClient>
			<TaskView taskId={taskId} />
		</HydrateClient>
	);
};

export default Page;
