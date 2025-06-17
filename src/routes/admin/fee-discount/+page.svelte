<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import FeeDiscountList from './FeeDiscountList.svelte';

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [
		{ label: 'Dashboard', href: '/admin/dashboard' },
		{ label: 'Fee Management' },
		{ label: 'Fee Discounts' }
	];
</script>

<Breadcrumb title="Fee Discount List" items={breadcrumbItems} />

<FeeDiscountList {response} />