<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';


	import { Pencil, Eye, Trash2 } from '@lucide/svelte';

	const columns = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'email', label: 'Email', sortable: true },
		{ key: 'createdAt', label: 'Created At', sortable: true, format: (val) => new Date(val).toLocaleDateString() }
	];

	const data = [
		{ id: 1, name: 'Alice', email: 'alice@example.com', createdAt: '2024-12-01T10:00:00Z' },
		{ id: 2, name: 'Bob', email: 'bob@example.com', createdAt: '2024-12-02T11:00:00Z' }
	];

	const actions = {
		show: true,
		icons: {
			show: true,
			edit: true,
			delete: true
		},
		customActions: [
			{
				icon: Pencil,
				action: (item) => {
					alert(`Edit ${item.name}`);
				}
			}
		]
	};

	let currentPage = 1;
	let rowsPerPage = 10;
</script>

<DataTable
	{data}
	{columns}
	{actions}
	{currentPage}
	{rowsPerPage}
	totalItems={data.length}
/>