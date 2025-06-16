<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import ConstantList from './ConstantList.svelte';

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'System Settings' }, { label: 'Constants' }];
</script>

<Breadcrumb title="System Constants" items={breadcrumbItems} />

<ConstantList {response} />
