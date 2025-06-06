<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import ClassList from "./ClassList.svelte";

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Classes" }];

</script>

<Breadcrumb title="Class List" items={breadcrumbItems} />

<ClassList {response} />
