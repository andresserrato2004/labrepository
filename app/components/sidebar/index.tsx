import type {
	SidebarLinkProps,
	SidebarMenuProps,
} from '@components/sidebar/types';
import type { PanInfo } from 'framer-motion';

import { dataAttr } from '@components/utility';
import { useSidebar } from '@hooks/sidebar';
import { useWindowSize } from '@hooks/window';
import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';
import {
	Calendar,
	Clipboard,
	Gear,
	House,
	SignOut,
	SquaresFour,
} from '@phosphor-icons/react';
import { useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { cloneElement } from 'react';

import cn from 'classnames';
import styles from './styles.module.css';

function buildVariants() {
	const variants = {
		hidden: { translateX: '-100%' },
		visible: { translateX: 0 },
	};

	return variants;
}

function buildDragAttrs() {
	const { sidebarActive, setSidebarActive } = useSidebar();
	const { isMobile } = useWindowSize();

	const drag = isMobile ? 'x' : undefined;
	const dragElastic = 0;
	const dragConstraints = { left: 0, right: 0 };
	const initialTranslateX = isMobile ? '-100%' : 0;
	const transition = { bounce: 0.25, type: 'spring', duration: 0.4 };
	const initial = { translateX: initialTranslateX };
	const triggerThreshold = 20;
	const animate = isMobile
		? sidebarActive
			? 'visible'
			: 'hidden'
		: undefined;

	const onDrag = (event: PointerEvent, info: PanInfo) => {
		if (event.pointerType === 'mouse') {
			return;
		}

		if (info.offset.x < -triggerThreshold && sidebarActive) {
			setSidebarActive(false);
		}
	};

	return {
		animate,
		drag,
		dragElastic,
		dragConstraints,
		transition,
		initial,
		onDrag,
	} as const;
}

function SidebarLink(props: SidebarLinkProps) {
	const { pathname } = useLocation();
	const { to, icon, children, className, ...liProps } = props;

	const isActive = pathname.toLowerCase().includes(children.toLowerCase());

	const computedIcon = cloneElement(icon, {
		className: cn(icon.props.className, styles.linkIcon),
		weight: isActive ? 'fill' : 'duotone',
	});

	return (
		<li
			className={cn('group', className, styles.linkContainer)}
			data-active={dataAttr(isActive)}
			{...liProps}
		>
			<Link className={styles.link} href={to}>
				<span className={styles.linkIconContainer}>{computedIcon}</span>
				<span className={styles.linkText}>{children}</span>
			</Link>
		</li>
	);
}

function SidebarMenu(props: SidebarMenuProps) {
	const { title, hasDivider, children } = props;

	return (
		<>
			<div className={styles.menu}>
				<h3 className={styles.menuTitle}>{title}</h3>
				<ul className={styles.linksContainer}>{children}</ul>
				{hasDivider ? <Divider className={styles.divider} /> : null}
			</div>
		</>
	);
}

export function Sidebar() {
	const { sidebarActive } = useSidebar();

	const dragAttrs = buildDragAttrs();
	const variants = buildVariants();

	return (
		<motion.aside
			className={styles.sidebarContainer}
			data-active={dataAttr(sidebarActive)}
			variants={variants}
			{...dragAttrs}
		>
			<div className={styles.profileContainer}>
				<div className={styles.profileImageContainer} />
				<div className={styles.nameWrapper}>
					<p className={styles.userName}>Joe doe</p>
					<p className={styles.userRole}>admin</p>
				</div>
			</div>

			<Divider className={styles.divider} />

			<div className={styles.menusContainer}>
				<SidebarMenu hasDivider={true} title='Main menu'>
					<SidebarLink to='/' icon={<SquaresFour />}>
						Dashboard
					</SidebarLink>
					<SidebarLink to='/' icon={<Clipboard />}>
						Requests
					</SidebarLink>
					<SidebarLink to='/' icon={<House />}>
						Classrooms
					</SidebarLink>
					<SidebarLink to='/' icon={<Calendar />}>
						Schedules
					</SidebarLink>
				</SidebarMenu>
				<SidebarMenu hasDivider={false} title='Options'>
					<SidebarLink to='/' icon={<Gear />}>
						Settings
					</SidebarLink>
					<SidebarLink
						to='/'
						icon={<SignOut />}
						className={styles.logoutLink}
					>
						Logout
					</SidebarLink>
				</SidebarMenu>
			</div>
		</motion.aside>
	);
}
