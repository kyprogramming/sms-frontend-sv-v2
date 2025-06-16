<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import FeeHeadList from './FeeHeadList.svelte';

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Fee Management' }, { label: 'Fee Heads' }];
</script>

<Breadcrumb title="Fee Head Management" items={breadcrumbItems} />

<FeeHeadList {response} />
