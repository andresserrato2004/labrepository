import type { ComponentProps } from 'react';

export interface HiddenInputProps
	extends Omit<ComponentProps<'input'>, 'value'> {
	name: string;
	value?: string | number | boolean | null | undefined;
}
