import type { PropsWithChildren, ReactElement } from 'react';

/**
 * Represents the properties for a SidebarLink component.
 */
export interface SidebarLinkProps extends PropsWithChildren {
	to: string;
	icon: NonNullable<ReactElement>;
	children: string;
	className?: string;
}

/**
 * Represents the props for the SidebarMenu component.
 */
export interface SidebarMenuProps extends PropsWithChildren {
	title: string;
	hasDivider?: boolean;
	children: NonNullable<ReactElement>[];
}
