<script lang="ts">
    	import { env } from "$env/dynamic/public";
	import DataTable from "$lib/components/common/DataTable.svelte";
	import ModalDelete from "$lib/components/common/ModalDelete.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { modalData, openDeleteModal, openModal, isUpdate, openEditModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";
	import ClassForm from "./ClassForm.svelte";

    const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";

    let isDeleteModalOpen = $state(false);
    const isModalOpen = $state(false);

	interface Props {
		response: any;
		dataToUpdate: any;
		onRefreshPage: () => void;
		onSearchChange: () => void;
		onDelete: (id: string) => void;
		onUpdate: (id: string) => void;
	}

	let { response, dataToUpdate = $bindable(), onRefreshPage, onSearchChange, onDelete, onUpdate }: Props = $props();

	let localSearch = get(searchText);

	$effect.pre(() => {
		searchText.set(localSearch);
	});

	// console.log("dataToUpdate: ClassList", dataToUpdate);

	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr #", width: "80px", sortable: true, align: "center" },
		{ key: "name", label: "Name", sortable: true, width: "auto", align: "center" },
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
        isDeleteModalOpen = true;
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

<svelte:head>
  <title>{schoolName} - Class</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<input name="search" type="text" placeholder="Search class..." bind:value={$searchText} />

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
	<ModalDelete
		title="Delete Class"
		size="md"
		onDelete={() => {
			onDelete($modalData._id);
		}}
		onCancel={() => {
			modalData.set(null);
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
