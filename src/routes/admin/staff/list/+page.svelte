<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import StaffList from '$lib/components/shared/staff/StaffList.svelte';

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Staff List' }];
</script>

<Breadcrumb title="Staff List" items={breadcrumbItems} />

<StaffList {response} />
