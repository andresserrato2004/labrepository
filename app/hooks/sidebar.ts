import { atom, useAtom } from 'jotai';

export const sidebarAtom = atom(false);

/**
 * Custom hook for managing the sidebar state.
 * @returns An object containing the sidebarActive state, toggleSidebar function, and setSidebarActive function.
 */
export function useSidebar() {
	const [sidebarActive, setSidebarActive] = useAtom(sidebarAtom);

	const toggleSidebar = () => {
		setSidebarActive(!sidebarActive);
	};

	return { sidebarActive, toggleSidebar, setSidebarActive } as const;
}
