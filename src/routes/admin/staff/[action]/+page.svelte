<script lang="ts">
	import { env } from "$env/dynamic/public";
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import StaffForm from "$lib/components/shared/staff/StaffForm.svelte";

	const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
	import { page } from "$app/state";
	const action = $derived(page.params.action);
	const staffData = page.data.staffData;
	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Staff Registration" }];
</script>

<svelte:head>
	<title>{schoolName} - Registration</title>
</svelte:head>

<Breadcrumb title={action === "create" ? "Staff Registration - New" : "Staff Registration - Update"} items={breadcrumbItems} />

{#if action === "update"}
	<StaffForm {action} {staffData} />
{:else if action === "create"}
	<StaffForm {action} staffData={[]} />
{:else if action === "view"}
	View Staff
{/if}
