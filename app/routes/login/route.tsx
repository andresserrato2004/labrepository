import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';

import styles from './route.module.css';

export default function LoginPage() {
	return (
		<main className={styles.mainContainer}>
			<form className={styles.formContainer}>
				<h1 className={styles.title}>Bienvenido</h1>
				<Input label='Username' name='username' isRequired={true} />
				<Input
					label='Password'
					name='password'
					type='password'
					isRequired={true}
				/>
				<Button
					className={styles.submitButton}
					color='primary'
					type='button'
				>
					Iniciar sesión
				</Button>
			</form>
		</main>
	);
}
