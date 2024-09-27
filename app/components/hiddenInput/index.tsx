import type { HiddenInputProps } from '@components/hiddenInput/types';

export function HiddenInput(props: HiddenInputProps) {
	const { value, name, ...inputProps } = props;
	return (
		<input
			readOnly={true}
			hidden={true}
			name={name}
			value={value !== undefined ? String(value) : undefined}
			type='hidden'
			{...inputProps}
		/>
	);
}
