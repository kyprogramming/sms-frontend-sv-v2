<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
	import { formatDate } from '$lib/utils/formatDate';
	import { RefreshCw, Search } from '@lucide/svelte';

	import DataTable from '$lib/components/common/DataTable.svelte';
	import ModalDelete from '$lib/components/common/ModalDelete.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import ClassForm from './ClassForm.svelte';

	import { Pencil, Eye, Trash2, Plus } from '@lucide/svelte';

	import type { ColumnConfig } from '$lib/interfaces/table.interface';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { deleteClassById, fetchClassById, fetchClasses } from '$lib/services/class';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	// Props
	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	let { response } = $props();

	// States
	let searchText = $state('');
	// let classList: any | null = $state(null);
	let classData: any | null = $state(null);

	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let isUpdate = $state(false);

	let selectedId = $state('');
	let selectedName = $state('');

	// Column configuration
	const columns: ColumnConfig[] = [
		{ key: '_id', label: 'Id', visible: false },
		{ key: 'serialNo', label: 'Sr #', width: '80px', sortable: true, align: 'center' },
		{ key: 'name', label: 'Name', sortable: true, width: 'auto', align: 'center' },
		{
			key: 'createdAt',
			label: 'Created At',
			width: '15%',
			sortable: true,
			format: formatDate,
			align: 'center',
		},
	];

	// Actions configuration
	const actions = {
		show: true,
		iconActions: [
			{
				icon: Eye,
				class: 'view',
				show: true,
				action: (item: { _id: any }) => {
					alert(`View ${item._id}`);
				},
			},
			{
				icon: Pencil,
				class: 'edit',
				show: true,
				action: async (item: { _id: any }) => {
					isUpdate = true;
					await updateAction(item._id);
                    // await invalidateAll();
                    // console.log('Refreshing class list in edit...', page.data.data);

				},
			},
			{
				icon: Trash2,
				class: 'delete',
				show: true,
				action: (item: { _id: any; name: string }) => {
					selectedId = item._id;
					selectedName = item.name;
					isDeleteModalOpen = true;
				},
			},
		],
	};

	// Event handlers
	async function handleSearch() {
		currentPage.set(1);
		await searchAction();
	}

	async function handleRefresh() {
		searchText = '';
		currentPage.set(1);
		await refreshAction();
	}

	function handleAdd() {
		// classList = null;
		isUpdate = false;
		isModalOpen = true;
	}

	async function handleDelete() {
		await deleteAction(selectedId);
        await invalidateAll();
	}

	async function handlePaginationChange() {
		await refreshAction();
	}

	async function handlePageLimitChange() {
		await refreshAction();
	}

	// Server actions
	async function updateAction(id: string) {
		classData = null;
		const res = await fetchClassById(id);
		const { data } = res;
		classData = data;
		if (res.success) isModalOpen = true;
	}

	async function deleteAction(id: string) {
		const json = await deleteClassById(id);
		if (json.success) {
			showSnackbar({ message: `${json.message}`, type: 'success' });
			isDeleteModalOpen = false;
		} else showSnackbar({ message: `${json.message}`, type: 'error' });

		if ($totalItems % $rowsPerPage === 1 && $currentPage > 1) {
			currentPage.set($currentPage - 1);
		}
		await refreshAction();
	}

	async function searchAction() {
		// if (searchText === "") return;
		const params = new URLSearchParams({ search: searchText, page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchClasses(params);
		response = { ...json };
	}

	async function refreshAction() {
        isModalOpen = false;
		const params = new URLSearchParams({ search: searchText || '', page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchClasses(params);
        console.log('Refreshing class list...', page.data.data);
        response = { ...json };
	}
</script>

<svelte:head>
	<title>{schoolName} - Class</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<input
			name="search"
			type="text"
			placeholder="Search class..."
			bind:value={searchText}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					handleSearch();
				}
			}} />

		<button type="button" class="btn ripple" onclick={handleSearch}>
			<Search />
			<span>Search</span>
		</button>

		<button type="button" class="btn ripple btn-secondary" onclick={handleRefresh}>
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
	<Modal
		title={isUpdate ? 'Update Class' : 'Add Class'}
		size="lg"
		onClose={() => {
			isModalOpen = false;
		}}
		onCancel={() => {
			isModalOpen = false;
		}}>
		<ClassForm onRefreshPage={refreshAction} classData={classData} action={isUpdate ? 'update' : 'create'} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<ModalDelete
		title="Delete Class"
		size="md"
		selectedName={`Name:  ${selectedName}`}
		onDelete={handleDelete}
		onCancel={() => {
			isDeleteModalOpen = false;
		}} />
{/if}

<!-- prettier-ignore -->
<style>
    .search-container {display: flex; align-items: center; gap: 8px}
	.search-container input {padding: 6px 10px; font-size: 14px; flex: 1}
	input[name='search'] {width: 300px}
</style>
