import { Header, Sidebar } from '@components';
import { Outlet } from '@remix-run/react';

import styles from './styles.module.css';

export { loader } from '@routes/home/loader';

export default function HomeLayout() {
	return (
		<main className={styles.layoutMainContainer}>
			<Header />
			<Sidebar />
			<Outlet />
		</main>
	);
}
