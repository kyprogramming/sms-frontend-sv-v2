<script lang="ts">
	import DataTable from "$lib/components/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/DeleteConfirmModal.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal, isUpdate, openEditModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";

	export let response: any;
	export let dataToUpdate: any;
	export let onRefreshPage: () => void;
	export let onSearchChange: () => void;
	export let onDelete: (id: string) => void;
	export let onUpdate: (id: string) => void;

	let localSearch = get(searchText);
	$: searchText.set(localSearch);

	// console.log("dataToUpdate: SectionList", dataToUpdate);

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

	const actions = {
		show: true,
		iconActions: [
			{
				icon: Eye,
				class: "view",
				show: false,
				action: (item: { _id: any }) => {
					alert(`View ${item._id}`);
				},
			},
			{
				icon: Pencil,
				class: "edit",
				show: true,
				action: (item: { _id: any }) => {
					handleUpdate(item._id);
				},
			},
			{
				icon: Trash2,
				class: "delete",
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
		onRefreshPage?.();
	}

	function handlePaginationChange() {
		onRefreshPage();
	}

	function handlePageLimitChange() {
		onRefreshPage();
	}

	function handleDelete(itemId: string) {
		openDeleteModal({ _id: itemId });
	}
	function handleAdd() {
		openModal();
		dataToUpdate = null;
	}

	async function handleUpdate(id: string) {
		onUpdate(id);
	}
</script>

<div class="class-container">
	<div class="search-container">
		<input name="search" type="text" placeholder="Search..." bind:value={$searchText} />

		<button class="icon-button" on:click={handleSearchClick} aria-label="Search">
			<span class="action-icons">
				<span class="icon-wrapper view">
					<Search />
				</span>
			</span>
		</button>

		<button class="icon-button" on:click={handleRefreshButtonClick} aria-label="Refresh">
			<span class="action-icons">
				<span class="icon-wrapper edit">
					<RefreshCw />
				</span>
			</span>
		</button>
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" on:click={handleAdd}>
			<Plus size={16} />
			<span>Add Section</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
	<Modal title={$isUpdate ? "Update Section" : "Add Section"} size="md">
		<SectionForm onRefreshPage={handleRefreshPage} {dataToUpdate} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<DeleteConfirmModal
		title="Delete Section"
		size="md"
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
