<script lang="ts">
	import DataTable from "$lib/components/DataTable.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { openModal } from "$lib/stores/modalStore";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";

	const columns = [
		{ key: "name", label: "Name", sortable: true },
		{ key: "createdAt", label: "Created At", sortable: true, format: (val: string | number | Date) => new Date(val).toLocaleDateString() },
	];

	const data = [
		{ id: 1, name: "Alice", email: "alice@example.com", createdAt: "2024-12-01T10:00:00Z" },
		{ id: 2, name: "Bob", email: "bob@example.com", createdAt: "2024-12-02T11:00:00Z" },
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
				icon: Pencil,
				action: (item: { name: any }) => {
					alert(`Edit ${item.name}`);
				},
			},
		],
	};

	let currentPage = 1;
	let rowsPerPage = 10;
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
<Modal title="Add Section" size="md">
	<SectionForm />
</Modal>

<style>
.search-container { position: relative; width: 300px }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; z-index: 1 }
input[name="search"] { width: 100%; padding-left: 30px; box-sizing: border-box }
</style>
