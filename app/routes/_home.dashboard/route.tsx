import { RouteTitle } from '@components';

export { loader } from '@routes/dashboard/loader';
export { meta } from '@routes/dashboard/meta';

export default function DashboardPage() {
	return <RouteTitle>Dashboard</RouteTitle>;
}
