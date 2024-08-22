import { dataAttr } from '@components/utility';
import { useSidebar } from '@hooks/sidebar';
import { List } from '@phosphor-icons/react';

import styles from './styles.module.css';

export function Header() {
	const { sidebarActive, toggleSidebar } = useSidebar();

	return (
		<header className={styles.headerContainer}>
			<div className={styles.brandContainer}>
				<p className={styles.brand}>Booking Lab</p>
			</div>
			<button
				type='button'
				onClick={toggleSidebar}
				data-active={dataAttr(sidebarActive)}
				className={styles.menuButton}
			>
				<List
					className={styles.menuIcon}
					data-active={dataAttr(sidebarActive)}
				/>
			</button>
		</header>
	);
}
