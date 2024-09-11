import type { ComponentProps } from 'react';

export interface RouteTitleProps
	extends Omit<ComponentProps<'header'>, 'children'> {
	children: string;
}
