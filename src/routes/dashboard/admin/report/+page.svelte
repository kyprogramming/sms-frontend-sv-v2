<script>
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import ReportList from "./ReportList.svelte";
	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard/admin" }, { label: "Sections" }];
</script>

<Breadcrumb title="Sections" items={breadcrumbItems} />
<ReportList />
