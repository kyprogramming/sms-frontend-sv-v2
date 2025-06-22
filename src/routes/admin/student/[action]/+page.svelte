<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import StudentForm from '$lib/components/shared/student/StudentForm.svelte';

	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	const pageTitle = 'Student Registration';
	const action = $derived(page.params.action);
	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' },{ label: 'Student List', href: '/admin/student/list' }, { label: action === 'create' ? `${pageTitle} - New` : `${pageTitle} - Update`}];
</script>

<svelte:head>
	<title>{schoolName} - {pageTitle}</title>
</svelte:head>

<Breadcrumb title={action === 'create' ? `${pageTitle} - New` : `${pageTitle} - Update`} items={breadcrumbItems} />
{#key action}
	<StudentForm {action} />
{/key}
