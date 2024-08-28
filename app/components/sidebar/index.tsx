import type {
	SidebarLinkProps,
	SidebarMenuProps,
} from '@components/sidebar/types';

import { dataAttr } from '@components/utility';
import { useSidebar } from '@hooks/sidebar';
import { Link } from '@nextui-org/link';
import {
	Calendar,
	Clipboard,
	Gear,
	House,
	Info,
	SquaresFour,
} from '@phosphor-icons/react';
import { useLocation } from '@remix-run/react';
import { cloneElement } from 'react';

import { Divider } from '@nextui-org/divider';
import cn from 'classnames';
import styles from './styles.module.css';

function SidebarLink(props: SidebarLinkProps) {
	const { pathname } = useLocation();
	const { to, icon, children, ...liProps } = props;

	const isActive = pathname.toLowerCase().includes(children.toLowerCase());

	const computedIcon = cloneElement(icon, {
		className: cn(icon.props.className, styles.linkIcon),
		weight: isActive ? 'fill' : 'regular',
	});

	return (
		<li
			className={cn('group', styles.linkContainer)}
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
	return (
		<aside
			className={styles.sidebarContainer}
			data-active={dataAttr(sidebarActive)}
		>
			<div className={styles.brandContainer} />

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
					<SidebarLink to='/' icon={<Info />}>
						Help
					</SidebarLink>
				</SidebarMenu>
			</div>

			<div className={styles.profileWrapper}>
				<div className={styles.profileContainer}>
					<div className={styles.profileImageContainer} />
					<p className={styles.userName}>Joe doe</p>
					<p className={styles.userRole}>admin</p>
				</div>
			</div>
		</aside>
	);
}
