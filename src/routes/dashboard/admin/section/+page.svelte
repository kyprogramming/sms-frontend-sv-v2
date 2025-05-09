<script lang="ts">
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import { isModalOpen } from "$lib/stores/modalStore";
	import SectionList from "./SectionList.svelte";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";

	export let data: any;
	let response: any = data.data;
	// let refreshKey = 0; // ✅ Key that forces re-render

	const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard/admin" }, { label: "Sections" }];
	console.log("server data on svelte page:", response);

	async function handleRefreshPage() {
		isModalOpen.set(false);
		// Build query string
		$searchText = get(searchText);
		$currentPage = get(currentPage);
		$rowsPerPage = get(rowsPerPage);
		$totalPages = get(totalPages);
		$totalItems = get(totalItems);

		const params = new URLSearchParams({
			search: $searchText || "",
			page: String($currentPage),
			limit: String($rowsPerPage),
		});

		console.log("handleSectionAdded called on page.svelte");
		const res = await fetch(`http://localhost:5000/api/section?${params.toString()}`, {
			method: "GET",
			credentials: "include",
		});
		const json = await res.json();
		response = { ...json };
		console.log("Server Response - API: ", response);
	}

</script>

<Breadcrumb title="Sections" items={breadcrumbItems} />
{#key response}
	<SectionList {response} onRefreshPage={handleRefreshPage} onSearchChange={handleRefreshPage} />
{/key}
