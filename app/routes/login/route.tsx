import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';

import styles from './route.module.css';

export { action } from '@routes/login/action';
export { meta } from '@routes/login/meta';

export default function LoginPage() {
	return (
		<main className={styles.mainContainer}>
			<form className={styles.formContainer} method='POST'>
				<h1 className={styles.title}>Bienvenido</h1>
				<Input label='Usuario' name='username' isRequired={true} />
				<Input
					label='Contraseña'
					name='password'
					type='password'
					isRequired={true}
				/>
				<Button
					className={styles.submitButton}
					color='primary'
					type='submit'
				>
					Iniciar sesión
				</Button>
			</form>
		</main>
	);
}
