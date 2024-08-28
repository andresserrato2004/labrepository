import { Sidebar } from '@components';
import { Outlet } from '@remix-run/react';

import { dataAttr } from '@components/utility';
import { useSidebar } from '@hooks/sidebar';
import { Button } from '@nextui-org/button';
import { List } from '@phosphor-icons/react';

import styles from './styles.module.css';

export { loader } from '@routes/home/loader';

export default function HomeLayout() {
	const { sidebarActive, toggleSidebar } = useSidebar();

	const handleOutletClick = () => {
		if (sidebarActive) {
			toggleSidebar();
		}
	};

	return (
		<main className={styles.layoutMainContainer}>
			<Sidebar />
			<Button
				className={styles.sidebarToggler}
				isIconOnly={true}
				onPress={toggleSidebar}
				data-active={dataAttr(sidebarActive)}
				variant='light'
				color='primary'
			>
				<List className={styles.sidebarTogglerIcon} />
			</Button>
			<div
				className={styles.outletContainer}
				onClick={handleOutletClick}
				onKeyUp={handleOutletClick}
			>
				<Outlet />
			</div>
		</main>
	);
}
