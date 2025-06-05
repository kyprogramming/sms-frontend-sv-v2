<script lang="ts">
	import { env } from "$env/dynamic/public";
	import DataTable from "$lib/components/common/DataTable.svelte";
	import ModalDelete from "$lib/components/common/ModalDelete.svelte";
	import SectionForm from "./SectionForm.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { modalData, openDeleteModal, openModal, openEditModal, closeModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { currentPage, rowsPerPage, totalItems, totalPages } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";
	import { deleteSectionById, fetchSectionById, fetchSections } from "$lib/services/section";
	import { showSnackbar } from "$lib/components/snackbar/store";

	const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
	
    let { response } = $props();

	let isDeleteModalOpen = $state(false);
	let isModalOpen = $state(false);
	let isUpdate = $state(false);
	let dataId = $state("");
	let itemName = $state("");
	let sectionData: any = $state(null);
	let searchText = $state("");


	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr #", width: "80px", sortable: true, align: "center" },
		{ key: "name", label: "Name", sortable: true, align: "center" },
		{
			key: "createdAt",
			label: "Created At",
			sortable: true,
			format: formatDate,
			width: "250px",
			align: "center",
		},
	];

	const actions = {
		show: true,
		iconActions: [
			{
				icon: Eye,
				class: "view",
				show: true,
				action: (item: { _id: any }) => {
					alert(`View ${item._id}`);
				},
			},
			{
				icon: Pencil,
				class: "edit",
				show: true,
				action: async (item: { _id: any }) => {
					isUpdate = true;
					await updateAction(item._id);
				},
			},
			{
				icon: Trash2,
				class: "delete",
				show: true,
				action: (item: { _id: any; name: string }) => {
					dataId = item._id;
					itemName = item.name;
					isDeleteModalOpen = true;
				},
			},
		],
	};

	async function handleSearchClick() {
		currentPage.set(1);
		handleSearchChange();
	}

	function handleRefreshButtonClick() {
		searchText = "";
		currentPage.set(1);
        handleRefreshPage();

	}

	function handlePaginationChange() {
        loadPaginationVariables();
        handleRefreshPage();
	}

	function handlePageLimitChange() {
        loadPaginationVariables();
        handleRefreshPage();
	}

	async function handleDelete(itemId: string) {
		await deleteAction(dataId);
	}

	function handleAdd() {
        sectionData = null;
		isModalOpen = true;
	}

	async function updateAction(id: string) {
		sectionData = null;
		const res = await fetchSectionById(id);
		const { data } = res;
		sectionData = data;
		if (res.success) isModalOpen = true;
	}

	async function deleteAction(id: string) {
		const json = await deleteSectionById(id);
		if (json.success) {
			showSnackbar({ message: `Section ${json.message}`, type: "success" });
			isDeleteModalOpen = false;
		} else showSnackbar({ message: `${json.message}`, type: "error" });
		await handleRefreshPage();
	}

    async function handleSearchChange() {
		if (searchText === "") return;
		loadPaginationVariables();
		const params = new URLSearchParams({ search: searchText, page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchSections(params);
		response = { ...json };
	}

	async function handleRefreshPage() {
		loadPaginationVariables();
		const params = new URLSearchParams({ search: searchText || "", page: String($currentPage), limit: String($rowsPerPage) });
        console.log("Params:", params.toString() , $currentPage, $rowsPerPage, $totalPages, $totalItems);
		const json = await fetchSections(params);
        isModalOpen = false;
		response = { ...json };
	}

	function closeModel() {
		isModalOpen = false;
		isDeleteModalOpen = false;
		modalData.set(null);
	}
    function loadPaginationVariables() {
		// $searchText = get(searchText);
		$currentPage = get(currentPage);
		$rowsPerPage = get(rowsPerPage);
		$totalPages = get(totalPages);
		$totalItems = get(totalItems);
        if($totalPages === 1) {
            currentPage.set(1);
        }
	}
</script>

<svelte:head>
	<title>{schoolName} - Section</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<input name="search" type="text" placeholder="Search section..." bind:value={searchText} />

		<button type="button" class="btn ripple" onclick={handleSearchClick}>
			<Search />
			<span>Search</span>
		</button>

		<button type="button" class="btn ripple btn-secondary" onclick={handleRefreshButtonClick}>
			<RefreshCw />
			<span>Refresh</span>
		</button>
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" onclick={handleAdd}>
			<Plus size={16} color="white" />
			<span>Add Section</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
	<Modal
		title={isUpdate ? "Update Section" : "Add Section"}
		size="md"
		onClose={closeModel}
		onDelete={() => {
			isDeleteModalOpen = true;
		}}
		onCancel={closeModel}
	>
		<SectionForm onRefreshPage={handleRefreshPage} {sectionData} action={isUpdate ? "update" : "add"} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<ModalDelete
		title="Delete Section"
		size="md"
		itemName={`Name:  ${itemName}`}
		onDelete={handleDelete}
		onCancel={() => {
			isDeleteModalOpen = false;
		}}
	/>
{/if}

<style>
	.search-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.search-container input {
		padding: 6px 10px;
		font-size: 14px;
		flex: 1;
	}

	input[name="search"] {
		width: 300px;
	}
</style>
