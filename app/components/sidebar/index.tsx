import { dataAttr } from '@components/utility';
import { useSidebar } from '@hooks/sidebar';

import styles from './styles.module.css';

export function Sidebar() {
	const { sidebarActive } = useSidebar();
	return (
		<aside
			className={styles.sidebarContainer}
			data-active={dataAttr(sidebarActive)}
		>
			<h1>Sidebar</h1>
		</aside>
	);
}
