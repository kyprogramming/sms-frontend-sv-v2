<script lang="ts">
	import DataTable from "$lib/components/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/DeleteConfirmModal.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, openDeleteModal, openModal } from "$lib/stores/modalStore";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";

	const columns = [
		{ key: "id", label: "Id", sortable: true, align: "center", visible: false },
		{ key: "name", label: "Name", sortable: true, align: "center" },
		{ key: "createdAt", label: "Created At", sortable: true, format: (val: string | number | Date) => new Date(val).toLocaleDateString(), width: "250px", align: "center" },
	];

	const data = [
		{ id: 1, name: "Alice", createdAt: "2024-12-01T10:00:00Z" },
		{ id: 2, name: "Bob", createdAt: "2024-12-02T11:00:00Z" },
	];

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
				action: (item: { id: any }) => {
					alert(`View ${item.id}`);
				},
			},
			{
				icon: Pencil,
				action: (item: { id: any }) => {
					alert(`Edit ${item.id}`);
				},
			},
			{
				icon: Trash2,
				action: (item: { id: any }) => {
					handleDeleteClick(item.id);
				},
			},
		],
	};

	let currentPage = 1;
	let rowsPerPage = 10;

	function handleDeleteClick(itemId: string) {
		openDeleteModal({ id: itemId });
	}

	function deleteItem() {
		// Perform deletion using the ID
		console.log("Deleting item with ID:");
		// your actual delete logic here (API call, store update, etc.)
	}
</script>

<div class="class-container">
	<div class="search-container">
		<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="11" cy="11" r="8"></circle>
			<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
		</svg>
		<input name="search" type="text" placeholder="Search..." />
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple" on:click={openModal}>
			<Plus size={16} />
			<span>Add Section</span>
		</button>
	</div>
</div>
<DataTable {data} {columns} {actions} {currentPage} {rowsPerPage} totalItems={data.length} />

{#if isModalOpen}
	<Modal title="Add Section" size="md">
		<SectionForm />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<DeleteConfirmModal
		title="Delete Section"
		size="sm"
		onDelete={() => {
			// alert("Deleted"); 
            // TODO: implement delete functionality 
		}}
		onCancel={() => {
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
