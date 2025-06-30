<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import FeeGroupList from './FeeGroupList.svelte';

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Fee Collection' }, { label: 'Fee Groups' }];
</script>

<Breadcrumb title="Fee Group List" items={breadcrumbItems} />

<FeeGroupList {response} />
