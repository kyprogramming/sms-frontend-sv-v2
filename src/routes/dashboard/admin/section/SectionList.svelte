<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import DataTable, { type ColumnConfig } from "$lib/components/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/DeleteConfirmModal.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal } from "$lib/stores/modalStore";

	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";

	export let response: any;
	export let onRefreshPage: () => void;
	export let onSearchChange: () => void;

	let localSearch = get(searchText);
	$: searchText.set(localSearch);

	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr No", width: "100px", sortable: true, align: "center" },
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

	console.log("Response at sectionList:", response);

	const actions = {
		show: true,
		icons: {
			show: true,
			edit: true,
			delete: true,
		},
		customActions: [
			{
				icon: Eye,
				action: (item: { _id: any }) => {
					alert(`View ${item._id}`);
				},
			},
			{
				icon: Pencil,
				action: (item: { _id: any }) => {
					alert(`Edit ${item._id}`);
				},
			},
			{
				icon: Trash2,
				action: (item: { _id: any }) => {
					handleDeleteClick(item._id);
				},
			},
		],
	};

	function handleDeleteClick(itemId: string) {
		openDeleteModal({ _id: itemId });
	}

	function deleteItem() {
		// Perform deletion using the ID
		// console.log("Deleting item with ID:");
		// your actual delete logic here (API call, store update, etc.)
	}

	async function handleRefreshPage() {
		onRefreshPage();
	}

	function handleSearchClick() {
		onSearchChange?.();
	}

	function handleRefreshButtonClick() {
		searchText.set('');
		currentPage.set(1);		
		onSearchChange?.();
	}

	function handlePageChange() {
		onRefreshPage();
	}

	function setDefaultPagination() {
		$currentPage = get(currentPage);
		$rowsPerPage = get(rowsPerPage);
		$totalPages = get(totalPages);
		$totalItems = get(totalItems);
	}
</script>

<div class="class-container">
	<div class="search-container">
		<input name="search" type="text" placeholder="Search..." bind:value={$searchText} />

		<button class="icon-button" on:click={handleSearchClick} aria-label="Search">
			<Search size={20} />
		</button>

		<button class="icon-button" on:click={handleRefreshButtonClick} aria-label="Refresh">
			<RefreshCw size={20} />
		</button>
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" on:click={openModal}>
			<Plus size={16} />
			<span>Add Section</span>
		</button>
	</div>
</div>
<DataTable {response} {columns} {actions} onPageChange={handlePageChange} />

<!-- {#if isModalOpen} -->
<Modal title="Add Section" size="md">
	<SectionForm onRefreshPage={handleRefreshPage} />
</Modal>
<!-- {/if} -->

{#if isDeleteModalOpen}
	<DeleteConfirmModal
		title="Delete Section"
		size="sm"
		onDelete={() => {
			alert(JSON.stringify($modalData));
			// TODO: implement delete functionality
		}}
		onCancel={() => {
			modalData.set(null);
			// alert("Cancelled");
			// TODO: implement delete functionality
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

	.icon-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
	}
</style>
