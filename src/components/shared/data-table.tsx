import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	type PaginationState,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';

import { Skeleton } from '../ui/skeleton';
import {
	DataTablePaginationSkeleton,
	TaskTablePagination,
} from './data-table-pagination';

interface DataTableProps<TData extends { link?: string }, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	placeholder: string;
	defaultPageSize: number;
	pageSizeVariants: number[];
	onRowClick?: (row: TData) => void;
}

export function DataTable<TData extends { link?: string }, TValue>({
	columns,
	data,
	placeholder,
	defaultPageSize,
	pageSizeVariants,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const router = useRouter();

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: defaultPageSize,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
	});

	return (
		<div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow
								key={headerGroup.id}
								className="bg-muted hover:bg-muted"
							>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => {
								return (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
										onClick={() => {
											if (onRowClick) {
												onRowClick(row.original);
											} else if (row.original.link) {
												router.push(row.original.link);
											}
										}}
										className={cn(
											(Boolean(row.original.link) || Boolean(onRowClick)) &&
												'cursor-pointer',
										)}
									>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{placeholder}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<TaskTablePagination table={table} pageSizeVariants={pageSizeVariants} />
		</div>
	);
}

export const DataTableSkeleton = ({
	defaultPageSize,
}: {
	defaultPageSize: number;
}) => {
	return (
		<div>
			<div className="flex flex-col overflow-hidden rounded-md border">
				<Skeleton className="h-10 w-full rounded-none" />
				{Array.from({ length: defaultPageSize }).map((_, idx) => (
					<Skeleton
						key={idx}
						className="h-[41px] w-full rounded-none border-t bg-accent/50"
					/>
				))}
			</div>
			<DataTablePaginationSkeleton />
		</div>
	);
};
