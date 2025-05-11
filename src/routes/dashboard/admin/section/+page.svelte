<script lang="ts">
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import { isModalOpen, openEditModal, openModal } from "$lib/stores/modalStore";
	import SectionList from "./SectionList.svelte";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { API_BASE_URL } from "$lib/constants/env.config";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { deleteSectionById, fetchSectionById, fetchSections } from "$lib/services/section";
	import type { any } from "zod";

	export let data: any;
	let response: any = data.data;
	let dataToUpdate: any;

	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard/admin" }, { label: "Sections" }];

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

<Breadcrumb title="Sections" items={breadcrumbItems} />
{#key response || dataToUpdate}
	<SectionList {response} onRefreshPage={handleRefreshPage} onSearchChange={handleSearchChange} onDelete={handleDelete} onUpdate={handleUpdate} {dataToUpdate} />
{/key}
