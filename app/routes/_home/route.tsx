import type { PanInfo } from 'framer-motion';

import { Sidebar } from '@components';
import { Outlet } from '@remix-run/react';

import { dataAttr } from '@components/utility';
import { UserSessionProvider } from '@hooks/session';
import { useSidebar } from '@hooks/sidebar';
import { useWindowSize } from '@hooks/window';
import { Button } from '@nextui-org/button';
import { List } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

import styles from './styles.module.css';

export { loader } from '@routes/home/loader';

function buildDragAttrs() {
	const { sidebarActive, setSidebarActive } = useSidebar();
	const { isMobile } = useWindowSize();

	const triggerThreshold = 20;
	const drag = isMobile ? 'x' : false;
	const dragConstraints = { left: 0, right: 0 };
	const dragElastic = 0;
	const animate = isMobile ? {} : undefined;

	const onDrag = (_event: MouseEvent, info: PanInfo) => {
		if (info.offset.x > triggerThreshold && !sidebarActive) {
			setSidebarActive(true);
		}

		if (info.offset.x < -triggerThreshold && sidebarActive) {
			setSidebarActive(false);
		}
	};

	return {
		animate,
		drag,
		dragConstraints,
		dragElastic,
		onDrag,
	} as const;
}

export default function HomeLayout() {
	const { sidebarActive, toggleSidebar, setSidebarActive } = useSidebar();

	const handleOutletClick = () => {
		if (sidebarActive) {
			setSidebarActive(false);
		}
	};

	const dragAttrs = buildDragAttrs();

	return (
		<main className={styles.layoutMainContainer}>
			<UserSessionProvider>
				<Sidebar />
				<Button
					className={styles.sidebarToggler}
					isIconOnly={true}
					disableRipple={true}
					onPress={toggleSidebar}
					data-active={dataAttr(sidebarActive)}
					variant='light'
					color='primary'
				>
					<List className={styles.sidebarTogglerIcon} />
				</Button>
				<motion.div
					className={styles.outletContainer}
					onKeyDown={handleOutletClick}
					onClick={handleOutletClick}
					{...dragAttrs}
				>
					<Outlet />
				</motion.div>
			</UserSessionProvider>
		</main>
	);
}
