<script lang="ts">
	import { run } from 'svelte/legacy';

	import DataTable from "$lib/components/common/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/common/DeleteConfirmModal.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal, isUpdate, openEditModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";
	import ClassForm from "./ClassForm.svelte";

	interface Props {
		response: any;
		dataToUpdate: any;
		onRefreshPage: () => void;
		onSearchChange: () => void;
		onDelete: (id: string) => void;
		onUpdate: (id: string) => void;
	}

	let {
		response,
		dataToUpdate = $bindable(),
		onRefreshPage,
		onSearchChange,
		onDelete,
		onUpdate
	}: Props = $props();

	let localSearch = get(searchText);
	run(() => {
		searchText.set(localSearch);
	});

	// console.log("dataToUpdate: ClassList", dataToUpdate);

	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr No", width: "10%", sortable: true, align: "center" },
		{ key: "name", label: "Name", sortable: true, width: "60%", align: "center" },
		{
			key: "createdAt",
			label: "Created At",
            width: "15%",
			sortable: true,
			format: formatDate,
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
		<input name="search" type="text" placeholder="Search class..." bind:value={$searchText} />

		<button class="icon-button" onclick={handleSearchClick} aria-label="Search">
			<span class="action-icons">
				<span class="icon-wrapper view">
					<Search />
				</span>
			</span>
		</button>

		<button class="icon-button" onclick={handleRefreshButtonClick} aria-label="Refresh">
			<span class="action-icons">
				<span class="icon-wrapper edit">
					<RefreshCw />
				</span>
			</span>
		</button>
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" onclick={handleAdd}>
			<Plus size={16} />
			<span>Add Class</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
	<Modal title={$isUpdate ? "Update Class" : "Add Class"} size="lg">
		<ClassForm onRefreshPage={handleRefreshPage} {dataToUpdate} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<DeleteConfirmModal
		title="Delete Class"
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
