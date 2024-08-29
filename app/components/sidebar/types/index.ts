import type { PropsWithChildren, ReactElement } from 'react';

export interface SidebarLinkProps extends PropsWithChildren {
	to: string;
	icon: NonNullable<ReactElement>;
	children: string;
	className?: string;
}

export interface SidebarMenuProps extends PropsWithChildren {
	title: string;
	hasDivider?: boolean;
	children: NonNullable<ReactElement>[];
}
