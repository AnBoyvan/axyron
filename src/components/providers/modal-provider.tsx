'use client';

import { useEffect, useState } from 'react';

import { CreateOrgDialog } from '@/features/organizations/ui/components/create-org-dialog';

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		// biome-ignore lint/complexity/noUselessFragments: later
		<>
			<CreateOrgDialog />
		</>
	);
};
