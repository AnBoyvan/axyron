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

import { TaskTablePagination } from './data-table-pagination';

interface DataTableProps<TData extends { link?: string }, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	placeholder: string;
}

export function DataTable<TData extends { link?: string }, TValue>({
	columns,
	data,
	placeholder,
}: DataTableProps<TData, TValue>) {
	const router = useRouter();

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 25,
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
											if (row.original.link) {
												router.push(row.original.link);
											}
										}}
										className={cn(
											Boolean(row.original.link) && 'cursor-pointer',
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
			<TaskTablePagination table={table} />
		</div>
	);
}
