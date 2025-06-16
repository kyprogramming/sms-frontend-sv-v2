<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { formatDate } from '$lib/utils/formatDate';
	import { RefreshCw, Search } from '@lucide/svelte';
	import DataTable from '$lib/components/common/DataTable.svelte';
	import ModalDelete from '$lib/components/common/ModalDelete.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import ConstantForm from './ConstantForm.svelte';
	import { Pencil, Eye, Trash2, Plus } from '@lucide/svelte';
	import type { ColumnConfig } from '$lib/interfaces/table.interface';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { deleteConstant, getConstantById, getConstantByKey, getConstants } from '$lib/services/constant';
	import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
	import { CONSTANT_CATEGORIES } from '$lib/utils/constants';

	let { response } = $props();
	let searchText = $state('');
	let constantData: any | null = $state(null);
	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let isUpdate = $state(false);
	let selectedId = $state('');
	let selectedName = $state('');
	let selectedCategory = $state('');
	let selectedType = $state('');

	const columns: ColumnConfig[] = [
		{ key: '_id', label: 'ID', visible: false },
		{ key: 'serialNo', label: 'Sr #', width: '80px', sortable: true, align: 'center' },
		{ key: 'category', label: 'Category', width: 'auto', sortable: true, align: 'center' },
		{ key: 'key', label: 'Key', width: 'auto', sortable: true, align: 'center' },
		{ key: 'value', label: 'Value', width: 'auto', format: (val) => JSON.stringify(val), align: 'center' },
		{ key: 'type', label: 'Type', width: 'auto', sortable: true, align: 'center' },
		// { key: "createdAt", label: "Created", width: "auto", sortable: true, format: formatDate },
	];

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
				action: async (item: { _id: string }) => {
					isUpdate = true;
					await updateAction(item._id);
				},
			},
			{
				icon: Trash2,
				class: 'delete',
				show: true,
				action: (item: { _id: string; key: any }) => {
					selectedId = item._id;
					selectedName = `${item.key}`;
					isDeleteModalOpen = true;
				},
			},
		],
	};

	async function handleSearch() {
		currentPage.set(1);
		await searchAction();
	}

	async function handleRefresh() {
		searchText = '';
		selectedCategory = '';
		selectedType = '';
		currentPage.set(1);
		await refreshAction();
	}

	function handleAdd() {
		constantData = null;
		isUpdate = false;
		isModalOpen = true;
	}

	async function handleDelete() {
		await deleteAction(selectedId);
	}

	async function updateAction(key: string) {
		constantData = null;
		const res = await getConstantById(key);
		constantData = res.data;
		if (res.success) isModalOpen = true;
	}

	async function deleteAction(key: string) {
		const json = await deleteConstant(key);
		if (json.success) {
			showSnackbar({ message: json.message, type: 'success' });
			isDeleteModalOpen = false;
			await refreshAction();
		} else {
			showSnackbar({ message: json.message, type: 'error' });
		}
	}

	async function searchAction() {
		const params = new URLSearchParams({
			category: selectedCategory,
			type: selectedType,
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await getConstants(params);
		response = { ...json };
	}

	async function refreshAction() {
		const params = new URLSearchParams({
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await getConstants(params);
		isModalOpen = false;
		response = { ...json };
	}

	async function handlePaginationChange() {
		await refreshAction();
	}

	async function handlePageLimitChange() {
		await refreshAction();
	}
</script>

<svelte:head>
	<title>{env.PUBLIC_SCHOOL_NAME} - Constants</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<select id="category" name="category" style="width:200px;" bind:value={selectedCategory} onchange={(e) => (selectedCategory = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select Category</option>
			{#each CONSTANT_CATEGORIES as category}
				<option value={category.name}>{category.name}</option>
			{/each}
		</select>

		<select id="type" name="type" style="width:200px;" bind:value={selectedType} onchange={(e) => (selectedType = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select Type</option>
			<option value="string">String</option>
			<option value="number">Number</option>
			<option value="boolean">Boolean</option>
			<option value="json">JSON</option>
		</select>

		<input type="text" name="search" placeholder="Search constant key..." bind:value={searchText} onkeydown={(e) => e.key === 'Enter' && handleSearch()} />

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
			<span>Add Constant</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
	<Modal
		title={isUpdate ? 'Update Constant' : 'Add Constant'}
		size="lg"
		onClose={() => (isModalOpen = false)}
		onCancel={() => {
			isModalOpen = false;
		}}>
		<ConstantForm onRefreshPage={refreshAction} {constantData} action={isUpdate ? 'update' : 'create'} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<ModalDelete title="Delete Constant" size="md" {selectedName} onDelete={handleDelete} onCancel={() => (isDeleteModalOpen = false)} />
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
	input[name='search'] {
		width: 300px;
	}
</style>
