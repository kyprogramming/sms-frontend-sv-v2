<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import DataTable, { type ColumnConfig } from "$lib/components/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/DeleteConfirmModal.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal ,isUpdate } from "$lib/stores/modalStore";

	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";

	export let response: any;
	export let onRefreshPage: () => void;
	export let onSearchChange: () => void;
	export let onDelete: (id: string) => void;
	export let onUpdate: (id: string) => void;

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
			show: false,
			edit: true,
			delete: true,
		},
		customActions: [
			{
				icon: Eye,
				show: false,
				action: (item: { _id: any }) => {
					alert(`View ${item._id}`);
				},
			},
			{
				icon: Pencil,
				show: true,
				action: (item: { _id: any }) => {
					// alert(`Edit ${item._id}`);
					handleUpdate(item._id);
				},
			},
			{
				icon: Trash2,
				show: true,
				action: (item: { _id: any }) => {
					handleDelete(item._id);
				},
			},
		],
	};

	async function handleRefreshPage() {
		onRefreshPage();
	}

	function handleSearchClick() {
		currentPage.set(1);
		onSearchChange?.();
	}

	function handleRefreshButtonClick() {
		searchText.set("");
		currentPage.set(1);
		onSearchChange?.();
	}

	function handlePaginationChange() {
		// searchText.set('');
		onRefreshPage();
	}

	function handlePageLimitChange() {
		onRefreshPage();
	}

	function handleDelete(itemId: string) {
		openDeleteModal({ _id: itemId });
	}

	function handleUpdate(itemId: string) {
		onUpdate(itemId);
	}
</script>

<div class="class-container">
	<div class="search-container">
		<input name="search" type="text" placeholder="Search..." bind:value={$searchText} />

		<button class="icon-button" on:click={handleSearchClick} aria-label="Search">
			<Search />
		</button>

		<button class="icon-button" on:click={handleRefreshButtonClick} aria-label="Refresh">
			<RefreshCw />
		</button>
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" on:click={openModal}>
			<Plus size={16} />
			<span>Add Section</span>
		</button>
	</div>
</div>
<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />
isUpdate - {$isUpdate}
{#if isModalOpen}
	<!-- <Modal title="Add Section" size="md">
		<SectionForm onRefreshPage={handleRefreshPage} {onUpdate} />
	</Modal> -->
    <Modal title={$isUpdate ? "Update Section" : "Add Section" } size="md">
		<SectionForm onRefreshPage={handleRefreshPage} {onUpdate} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<DeleteConfirmModal
		title="Delete Section"
		size="sm"
		onDelete={() => {
			onDelete($modalData._id);
		}}
		onCancel={() => {
			modalData.set(null);
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
	input[name="search"] {
		width: 300px;
	}
</style>
