interface MonthHeaderProps {
	label: string;
}

export const MonthHeader = ({ label }: MonthHeaderProps) => {
	return (
		<div className="py-2 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
			{label}
		</div>
	);
};
