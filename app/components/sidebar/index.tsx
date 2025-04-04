import type {
	SidebarLinkProps,
	SidebarMenuProps,
} from '@components/sidebar/types';
import type { PanInfo } from 'framer-motion';
import type { ReactElement } from 'react';

import { dataAttr } from '@components/utility';
import { useUserSession } from '@hooks/session';
import { useSidebar } from '@hooks/sidebar';
import { useWindowSize } from '@hooks/window';
import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';
import {
	BookBookmark,
	Calendar,
	Gear,
	House,
	SignOut,
	Users,
} from '@phosphor-icons/react';
import { useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { cloneElement } from 'react';

import cn from 'classnames';
import styles from './styles.module.css';

/**
 * Builds and returns the variants for the sidebar animation.
 * @returns The variants object with the 'hidden' and 'visible' variants.
 */
function buildVariants() {
	const variants = {
		hidden: { translateX: '-100%' },
		visible: { translateX: 0 },
	};

	return variants;
}

/**
 * Returns an object containing the attributes for dragging the sidebar.
 *
 * @returns An object with the following attributes:
 * - animate: The animation type for the sidebar.
 * - drag: The direction of dragging (x for mobile, undefined for desktop).
 * - dragElastic: The elasticity of dragging.
 * - dragConstraints: The constraints for dragging.
 * - transition: The transition settings for the sidebar animation.
 * - initial: The initial position of the sidebar.
 * - onDrag: The event handler for dragging.
 * @see {@link https://www.framer.com/api/motion/motionvalue/#dragging | Framer Motion - Dragging}
 */
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

/**
 * Represents a link in the sidebar.
 *
 * @param {SidebarLinkProps} props - The props for the SidebarLink component.
 * @returns {ReactElement} The rendered SidebarLink component.
 */
function SidebarLink(props: SidebarLinkProps): ReactElement {
	const { pathname } = useLocation();
	const { to, icon, children, className, ...liProps } = props;

	const isActive = pathname.toLowerCase().includes(to.toLowerCase());

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

/**
 * Represents a menu in the sidebar.
 *
 * @param {SidebarMenuProps} props - The props for the SidebarMenu component.
 * @returns {ReactElement} The rendered SidebarMenu component.
 */
function SidebarMenu(props: SidebarMenuProps): ReactElement {
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

/**
 * A component that renders its children only if the current user has an admin role.
 *
 * @param {Object} props - The props object.
 * @param {ReactElement} props.children - The child elements to be rendered if the user is an admin.
 * @returns The children elements if the user is an admin, otherwise null.
 */
function OnlyAdmin({ children }: { children: ReactElement }) {
	const session = useUserSession();

	if (session.role !== 'admin') {
		return null;
	}

	return children;
}

/**
 * Renders the sidebar component.
 *
 * @returns The rendered sidebar component.
 */
export function Sidebar() {
	const { sidebarActive } = useSidebar();
	const session = useUserSession();

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
					<p className={styles.userName}>
						{session.name.split(' ').at(0)}
					</p>
					<p className={styles.userRole}>{session.role}</p>
				</div>
			</div>

			<Divider className={styles.divider} />

			<div className={styles.menusContainer}>
				<SidebarMenu hasDivider={true} title='Main menu'>
					{/* <SidebarLink to='/dashboard' icon={<SquaresFour />}>
						Dashboard
					</SidebarLink> */}

					<SidebarLink to='/reservations' icon={<BookBookmark />}>
						Reservations
					</SidebarLink>
					{/* <SidebarLink to='/requests' icon={<Clipboard />}>
						Requests
					</SidebarLink> */}
					<OnlyAdmin>
						<SidebarLink to='/users' icon={<Users />}>
							Users
						</SidebarLink>
					</OnlyAdmin>
					<OnlyAdmin>
						<SidebarLink to='/classrooms' icon={<House />}>
							Classrooms
						</SidebarLink>
					</OnlyAdmin>
					<OnlyAdmin>
						<SidebarLink to='/periods' icon={<Calendar />}>
							Academic periods
						</SidebarLink>
					</OnlyAdmin>
				</SidebarMenu>
				<SidebarMenu hasDivider={false} title='Options'>
					<OnlyAdmin>
						<SidebarLink to='/settings' icon={<Gear />}>
							Settings
						</SidebarLink>
					</OnlyAdmin>
					<SidebarLink
						to='/logout'
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
