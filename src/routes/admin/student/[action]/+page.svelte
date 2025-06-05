<script lang="ts">
    	import { env } from "$env/dynamic/public";
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import { isModalOpen, openEditModal, openModal } from "$lib/stores/modalStore";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { deleteSectionById, fetchSectionById, fetchSections } from "$lib/services/section";
	import StudentForm from "$lib/components/shared/student/StudentForm.svelte";
	
    const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
    // import { page } from "$app/state";

	// import { classList } from "$lib/stores/masterData";
	// import { page } from '$app/stores';
	import { navigating, page, updated } from "$app/state";
	const action = $derived(page.params.action);
	const studentData = page.data.studentData;
	// const action = $page.params.action;
	// console.log("@page- action", action);
	// console.log("@page- studentData:", studentData);

	// let { data }: Props = $props();
	// let response: any = data.data;
	// let action = page.data.action || null;
	// console.log("action @ page- student registration:", action);

	// let classesWithSections = response?.data || [];
	// console.log("classList:", $classList);
	// let classesWithSections = page.data?.classData || [];
	// let student = page.data?.student || [];

	// console.log("classesWithSections:", classesWithSections);

	let dataToUpdate: any;

	// console.log("response at student create", response);

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Student Registration" }];

	async function handleSearchChange() {
		if ($searchText === "") return;
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText, page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchSections(params);
		// response = { ...json };
	}

	async function handleRefreshPage() {
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText || "", page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchSections(params);
		// response = { ...json };
	}

	async function handleUpdate(id: string) {
		// console.log("id:", id);
		dataToUpdate = null;
		const res = await fetchSectionById(id);
		const { data } = res;
		dataToUpdate = data;
		if (res.success) openEditModal();
	}

	async function handleDelete(id: string) {
		const json = await deleteSectionById(id);
		if (json.success) showSnackbar({ message: `Section ${json.message}`, type: "success" });
		else showSnackbar({ message: `${json.message}`, type: "error" });
		await handleRefreshPage();
	}

	function loadPaginationVariables() {
		$searchText = get(searchText);
		$currentPage = get(currentPage);
		$rowsPerPage = get(rowsPerPage);
		$totalPages = get(totalPages);
		$totalItems = get(totalItems);
	}
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
