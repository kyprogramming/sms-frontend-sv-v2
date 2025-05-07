<script>
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import SectionList from "./SectionList.svelte";

	const breadcrumbItems = [
		{ label: "Home", href: "/" },
		{ label: "Dashboard", href: "/dashboard/admin" },
		{ label: "Sections" },
	];
</script>

<Breadcrumb title="Sections" items={breadcrumbItems} />
<!-- <Breadcrumb title="Class List" items={breadcrumbItems} /> -->
<SectionList />
<!-- <ClassForm /> -->
