<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import DataTable, { type ColumnConfig } from "$lib/components/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/DeleteConfirmModal.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal } from "$lib/stores/modalStore";
	import { searchText } from "$lib/stores/paginationStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";

    export let response: any;
    export let onRefreshPage: () => void;
    export let onSearchChange: () => void;
    // export let onSearchChange: (value: string) => void = () => {};
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


</script>

<div class="class-container">
	<div class="search-container">
		<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="11" cy="11" r="8"></circle>
			<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
		</svg>
		<input name="search" type="text" placeholder="Search..."  bind:value={$searchText}   on:input={(e) => {
            const value = (e.target as HTMLInputElement)?.value || '';
            searchText.set(value);
            onSearchChange(); // safe call
          }}/>
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" on:click={openModal}>
			<Plus size={16} />
			<span>Add Section</span>
		</button>
	</div>
</div>
<DataTable {response} {columns} {actions} />

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
		position: relative;
		width: 300px;
	}
	.search-icon {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		z-index: 1;
	}
	input[name="search"] {
		width: 100%;
		padding-left: 30px;
		box-sizing: border-box;
	}
</style>
