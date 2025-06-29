<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import StudentForm from '$lib/components/shared/student/StudentForm.svelte';
	import StudentView from '$lib/components/shared/student/StudentView.svelte';

	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	const pageTitle = 'Student Registration';
	
    //TODO: do not change from derived to state
	const action = $derived(page.params.action);
	const actionLabel = $derived(action === 'create' ? 'New' : action === 'update' ? 'Update' : 'View');
	const breadcrumbItems = $derived([{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Student List', href: '/admin/student/list' }, { label: `Student ${actionLabel}` }]);
</script>

<svelte:head>
	<title>{schoolName} - {pageTitle}</title>
</svelte:head>

{#key actionLabel}
	<Breadcrumb title={`${pageTitle} - ${actionLabel}`} items={breadcrumbItems} />
{/key}
{#key action}
	{#if action === 'create' || action === 'update'}
		<StudentForm {action} />
	{:else if action === 'view'}
		<StudentView {action} />
	{/if}
{/key}
