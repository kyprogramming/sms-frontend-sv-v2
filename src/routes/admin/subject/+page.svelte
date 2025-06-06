<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import SubjectList from "./SubjectList.svelte";

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Classes" }];
</script>

<Breadcrumb title="Subject List" items={breadcrumbItems} />

<SubjectList {response} />
