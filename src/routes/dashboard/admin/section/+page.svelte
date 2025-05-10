<script lang="ts">
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import { isModalOpen, openEditModal, openModal } from "$lib/stores/modalStore";
	import SectionList from "./SectionList.svelte";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { API_BASE_URL } from "$lib/constants/env.config";
	import { showSnackbar } from "$lib/components/snackbar/store";

	export let data: any;
	let response: any = data.data;
	// let refreshKey = 0; // ✅ Key that forces re-render

	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard/admin" }, { label: "Sections" }];
	console.log("server data on svelte page:", response);

	async function handleRefreshPage() {
		isModalOpen.set(false);
		// Build query string
		loadPaginationVariables();
		const params = new URLSearchParams({ search: $searchText || "", page: String($currentPage), limit: String($rowsPerPage) });

		console.log("handleSectionAdded called on page.svelte");
		const res = await fetch(`${API_BASE_URL}/section?${params.toString()}`, {
			method: "GET",
			credentials: "include",
		});
		const json = await res.json();
		response = { ...json };
		console.log("Server Response - API: ", response);
	}

	async function handleUpdate(id: string) {
		// console.log("id:", id);
		const res = await fetch(`${API_BASE_URL}/section/${id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		const json = await res.json();
        if(json.success) openEditModal();
		// console.log("GET JSON DATA BY ID:", json);
		// showSnackbar({ message: `${json.message}`, type: "success" });
	}

	async function handleDelete(id: string) {
		// debugger;
		console.log("Update section:", id);
		const res = await fetch(`${API_BASE_URL}/section/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		const json = await res.json();
		console.log("DELETE JSON:", json);
		showSnackbar({ message: `Section ${json.message}`, type: "success" });
		handleRefreshPage();
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
{#key response}
	<SectionList {response} onRefreshPage={handleRefreshPage} onSearchChange={handleRefreshPage} onDelete={handleDelete} onUpdate={handleUpdate} />
{/key}
