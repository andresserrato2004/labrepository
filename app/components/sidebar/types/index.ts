import type { PropsWithChildren, ReactElement } from 'react';

export interface SidebarLinkProps extends PropsWithChildren {
	to: string;
	icon: NonNullable<ReactElement>;
	children: string;
}
