interface OrgProjectsViewProps {
	orgId: string;
}

export const OrgProjectsView = ({ orgId }: OrgProjectsViewProps) => {
	return <div>Org ID: {orgId}</div>;
};
