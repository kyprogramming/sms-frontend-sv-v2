<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import FeeCategoryList from './FeeCategoryList.svelte';

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Fee Categories' }];
</script>

<Breadcrumb title="Fee Category List" items={breadcrumbItems} />

<FeeCategoryList {response} />
