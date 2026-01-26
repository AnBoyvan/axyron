import { create } from 'zustand';

interface CreateOrgDialoglStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useCreateOrgDialog = create<CreateOrgDialoglStore>(set => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
