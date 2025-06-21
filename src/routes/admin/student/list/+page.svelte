<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import StudentList from '$lib/components/shared/student/StudentList.svelte';
	import { SCHOOL_NAME } from '$lib/utils/constants';

	const pageTitle = 'Student List';
	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: pageTitle }];
</script>

<svelte:head>
	<title>{SCHOOL_NAME} - {pageTitle}</title>
</svelte:head>

<Breadcrumb title={pageTitle} items={breadcrumbItems} />
<StudentList />
