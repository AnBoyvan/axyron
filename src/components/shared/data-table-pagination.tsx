import type { Table } from '@tanstack/react-table';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '../ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';

interface TaskTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizeVariants: number[];
}

export function TaskTablePagination<TData>({
	table,
	pageSizeVariants,
}: TaskTablePaginationProps<TData>) {
	const t = useTranslations();

	const currentPage = table.getState().pagination.pageIndex + 1;
	const pageCount = table.getPageCount();

	return (
		<div className="mt-4 flex w-full flex-wrap justify-between gap-x-8 gap-y-4">
			<div className="flex items-center space-x-2">
				<p className="font-medium text-sm">{t('common.page_per')}</p>
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={value => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger className="h-9 w-[70px]">
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{pageSizeVariants.map(pageSize => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex items-center justify-center space-x-2">
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronsLeftIcon />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeftIcon />
				</Button>
				<div className="flex w-28 items-center justify-center font-medium text-sm">
					{`${t('common.page')} ${currentPage}${t('common.of')}${pageCount}`}
				</div>
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRightIcon />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<ChevronsRightIcon />
				</Button>
			</div>
		</div>
	);
}

export const DataTablePaginationSkeleton = () => {
	const t = useTranslations();

	return (
		<div className="mt-4 flex w-full flex-wrap justify-between gap-x-8 gap-y-4">
			<div className="flex items-center space-x-2">
				<p className="font-medium text-sm">{t('common.page_per')}</p>
				<Skeleton className="h-9 w-[70px]" />
			</div>
			<div className="flex items-center justify-center space-x-2">
				<Button variant="outline" size="icon" disabled>
					<ChevronsLeftIcon />
				</Button>
				<Button variant="outline" size="icon" disabled>
					<ChevronLeftIcon />
				</Button>
				<div className="flex w-28 items-center justify-center font-medium text-sm">
					{`${t('common.page')} `}
					<Skeleton className="mx-1 h-3.5 w-3" />
					{`${t('common.of')}`}
					<Skeleton className="mx-1 h-3.5 w-3" />
				</div>
				<Button variant="outline" size="icon" disabled>
					<ChevronRightIcon />
				</Button>
				<Button variant="outline" size="icon" disabled>
					<ChevronsRightIcon />
				</Button>
			</div>
		</div>
	);
};
