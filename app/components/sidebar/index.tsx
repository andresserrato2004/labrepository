import type { SidebarLinkProps } from '@components/sidebar/types';

import { dataAttr } from '@components/utility';
import { useSidebar } from '@hooks/sidebar';
import { Link } from '@nextui-org/link';
import { Calendar, Clipboard, House, SquaresFour } from '@phosphor-icons/react';
import { useLocation } from '@remix-run/react';
import { cloneElement } from 'react';

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

export function Sidebar() {
	const { sidebarActive } = useSidebar();
	return (
		<aside
			className={styles.sidebarContainer}
			data-active={dataAttr(sidebarActive)}
		>
			<div className={styles.brandContainer} />
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
		</aside>
	);
}
