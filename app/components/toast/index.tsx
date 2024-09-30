import {
	CheckCircle,
	Warning,
	WarningCircle,
	XCircle,
} from '@phosphor-icons/react';
import { toast } from 'sonner';

import cx from 'classnames';
import styles from './styles.module.css';

function success(message: string): void;
function success(message: string, description: string): void;

function success(message: string, description?: string) {
	toast(message, {
		className: cx(styles.toast, styles.success),
		description: description,
		duration: 3000,
		icon: <CheckCircle className={styles.icon} weight='fill' />,
	});
}

function error(message: string): void;
function error(message: string, description: string): void;

function error(message: string, description?: string) {
	toast(message, {
		className: cx(styles.toast, styles.error),
		description: description,
		duration: 3000,
		icon: <XCircle className={styles.icon} weight='fill' />,
	});
}

function info(message: string): void;
function info(message: string, description: string): void;

function info(message: string, description?: string) {
	toast(message, {
		className: cx(styles.toast, styles.info),
		description: description,
		duration: 3000,
		icon: <WarningCircle className={styles.icon} weight='fill' />,
	});
}

function warning(message: string): void;
function warning(message: string, description: string): void;

function warning(message: string, description?: string) {
	toast(message, {
		className: cx(styles.toast, styles.warning),
		description: description,
		duration: 3000,
		icon: <Warning className={styles.icon} weight='fill' />,
	});
}

const toaster = {
	success: success,
	error: error,
	info: info,
	warning: warning,
};

export { toaster as toast };
