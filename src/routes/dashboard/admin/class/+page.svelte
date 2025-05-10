<script>
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import ClassForm from "$lib/components/forms/ClassForm.svelte";
	import SchoolClassList from "./SchoolClassList.svelte";

	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard/admin" }, { label: "Classes" }];
</script>

<Breadcrumb title="Class List" items={breadcrumbItems} />
<!-- <Breadcrumb title="Class List" items={breadcrumbItems} /> -->
<SchoolClassList />
<!-- <ClassForm /> -->
