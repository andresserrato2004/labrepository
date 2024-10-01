import type { action } from '@routes/login/action';

import { useFetcherErrors, useFetcherWithReset } from '@hooks/fetcher';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';

import styles from './route.module.css';

export { action } from '@routes/login/action';
export { meta } from '@routes/login/meta';

export default function LoginPage() {
	const fetcher = useFetcherWithReset<typeof action>();
	const { createErrorProps, clearErrors } = useFetcherErrors(fetcher);

	const isLoading = fetcher.state !== 'idle';

	return (
		<main className={styles.mainContainer}>
			<fetcher.Form className={styles.formContainer} method='POST'>
				<h1 className={styles.title}>Bienvenido</h1>
				<Input
					label='Usuario'
					name='username'
					isRequired={true}
					autoFocus={true}
					isDisabled={isLoading}
					onValueChange={clearErrors('username')}
					{...createErrorProps('username')}
				/>
				<Input
					label='Contraseña'
					name='password'
					type='password'
					isRequired={true}
					isDisabled={isLoading}
					onValueChange={clearErrors('password')}
					{...createErrorProps('password')}
				/>
				<Button
					className={styles.submitButton}
					color='primary'
					type='submit'
					isLoading={isLoading}
				>
					Iniciar sesión
				</Button>
			</fetcher.Form>
		</main>
	);
}
