<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import { isModalOpen, openEditModal, openModal } from "$lib/stores/modalStore";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { deleteSectionById, fetchSectionById, fetchSections } from "$lib/services/section";
	import StudentForm from "./StudentForm.svelte";

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let response: any = data.data;
    let classesWithSections = response?.data || [];
	let dataToUpdate: any;

    console.log("response at student create", response);

	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/admin/dashboard" }, { label: "Student", href: "/admin/dashboard/student/create" },{ label: "Create" }];

	async function handleSearchChange() {
		if ($searchText === "") return;
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText, page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchSections(params);
		response = { ...json };
	}

	async function handleRefreshPage() {
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText || "", page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchSections(params);
		response = { ...json };
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

<Breadcrumb title="Student Admission" items={breadcrumbItems} />
<StudentForm classesWithSections={classesWithSections}/>