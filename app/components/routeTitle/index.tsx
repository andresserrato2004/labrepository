import type { RouteTitleProps } from '@components/routeTitle/types';

import styles from './styles.module.css';

export function RouteTitle(props: RouteTitleProps) {
	const { children, ...headerProps } = props;
	return (
		<header {...headerProps}>
			<h1 className={styles.title}>{children}</h1>
		</header>
	);
}
