<script lang="ts">
	import { env } from "$env/dynamic/public";
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import StudentForm from "$lib/components/shared/student/StudentForm.svelte";

	const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
	import { page } from "$app/state";
	const action = $derived(page.params.action);
	const studentData = page.data.studentData;
	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Student Registration" }];
</script>

<svelte:head>
	<title>{schoolName} - Registration</title>
</svelte:head>

<Breadcrumb title={action === "create" ? "Student Registration - New" : "Student Registration - Update"} items={breadcrumbItems} />

{#if action === "update"}
	<StudentForm {action} {studentData} />
{:else if action === "create"}
	<StudentForm {action} studentData={[]} />
{:else if action === "view"}
	View Student
{/if}
