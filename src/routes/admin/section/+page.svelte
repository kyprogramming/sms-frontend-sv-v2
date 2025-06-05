<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import SectionList from "./SectionList.svelte";

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Sections" }];

</script>

<Breadcrumb title="Sections" items={breadcrumbItems} />

<SectionList {response} />

