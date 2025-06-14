<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import AcademicYearList from "./AcademicYearList.svelte";

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Academic Year" }];
</script>

<Breadcrumb title="Academic Year List" items={breadcrumbItems} />

<AcademicYearList {response} />
