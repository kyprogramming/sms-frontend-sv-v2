<script>
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import ClassForm from "$lib/components/forms/ClassForm-old.svelte";
	import SchoolClassList from "./SchoolClassList.svelte";

	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/admin/dashboard" }, { label: "Classes" }];
</script>

<Breadcrumb title="Class List" items={breadcrumbItems} />
<!-- <Breadcrumb title="Class List" items={breadcrumbItems} /> -->
<SchoolClassList />
<!-- <ClassForm /> -->
