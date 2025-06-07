<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import StudentList from "$lib/components/shared/student/StudentList.svelte";

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [ { label: "Dashboard", href: "/admin/dashboard" }, { label: "Student List" }];
</script>

<Breadcrumb title="Student List" items={breadcrumbItems} />

<StudentList {response}  />

