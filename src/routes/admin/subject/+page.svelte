<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import { isModalOpen, openEditModal } from "$lib/stores/modalStore";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { deleteSubjectById, fetchSubjectById, fetchSubjects } from "$lib/services/subject";
	import SubjectList from "./SubjectList.svelte";

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let response: any = $state(data.data);
	let dataToUpdate: any = $state();

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Subjects" }];

	async function handleSearchChange() {
		if ($searchText === "") return;
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText, page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchSubjects(params);
		response = { ...json };
	}

	async function handleRefreshPage() {
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText || "", page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchSubjects(params);
		response = { ...json };
	}

	async function handleUpdate(id: string) {
		// console.log("id:", id);
		dataToUpdate = null;
		const res = await fetchSubjectById(id);
		const { data } = res;
		dataToUpdate = data;
		if (res.success) openEditModal();
	}

	async function handleDelete(id: string) {
		const json = await deleteSubjectById(id);
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

<Breadcrumb title="Subjects" items={breadcrumbItems} />
{#key response || dataToUpdate}
	<SubjectList {response} onRefreshPage={handleRefreshPage} onSearchChange={handleSearchChange} onDelete={handleDelete} onUpdate={handleUpdate} {dataToUpdate} />
{/key}
