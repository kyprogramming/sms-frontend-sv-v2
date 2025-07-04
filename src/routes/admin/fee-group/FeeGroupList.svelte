<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { formatDate } from '$lib/utils/formatDate';

	import ModalDelete from '$lib/components/common/ModalDelete.svelte';
	import FeeGroupForm from './FeeGroupForm.svelte';
	import { Pencil, Eye, Trash2, Plus, Search, RefreshCw } from '@lucide/svelte';
	import type { ColumnConfig } from '$lib/interfaces/table.interface';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { deleteFeeGroupById, fetchFeeGroupById, fetchFeeGroups } from '$lib/services/fee-group';
	import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
	import DataTable from '$lib/components/common/DataTable.svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	let { response } = $props();
	let searchText = $state('');
	let feeGroupData: any | null = $state(null);
	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let isUpdate = $state(false);
	let selectedId = $state('');
	let selectedName = $state('');

	const columns: ColumnConfig[] = [
		{ key: '_id', label: 'ID', visible: false },
		{ key: 'serialNo', label: 'Sr #', width: '80px', sortable: true, align: 'center' },
		{ key: 'name', label: 'Name', width: 'auto', sortable: true, align: 'center' },
		{ key: 'code', label: 'Code', width: 'auto', sortable: true, align: 'center' },
		// { key: 'categoryId.name', label: 'Category Name', width: 'auto', sortable: true, align: 'center' },
		// { key: 'amount', label: 'Amount', width: 'auto', sortable: true, align: 'center', format: (val) => `$${val.toFixed(2)}` },
		{
			key: 'active',
			label: 'Status',
			width: '150px',
			sortable: true,
			align: 'center',
			format: (value) => {
				return value ? '<span class=active-status>Active</span>' : '<span class=inactive-status>Inactive</span>';
			},
		},
		// { key: 'createdAt', label: 'Created', width: 'auto', sortable: true, align: 'center', format: formatDate },
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
				action: (item: { _id: string; title: string }) => {
					selectedId = item._id;
					selectedName = item.title;
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
		currentPage.set(1);
		await refreshAction();
	}

	function handleAdd() {
		feeGroupData = null;
		isUpdate = false;
		isModalOpen = true;
	}

	async function handleDelete() {
		await deleteAction(selectedId);
	}

	async function updateAction(id: string) {
		feeGroupData = null;
		const res = await fetchFeeGroupById(id);
		feeGroupData = res.data;
		isModalOpen = true;
	}

	async function deleteAction(id: string) {
		const json = await deleteFeeGroupById(id);
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
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await fetchFeeGroups(params);
		response = { ...json };
	}

	async function refreshAction() {
		const params = new URLSearchParams({
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await fetchFeeGroups(params);
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
	<title>{env.PUBLIC_SCHOOL_NAME} - Fee Groups</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<input name="search" type="text" placeholder="Search fee groups..." bind:value={searchText} onkeydown={(e) => e.key === 'Enter' && handleSearch()} />
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
			<span>Add Fee Group</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
	<Modal
		title={isUpdate ? 'Update Fee Group' : 'Add Fee Group'}
		size="lg"
		onClose={() => {
			isModalOpen = false;
		}}
		onCancel={() => {
			isModalOpen = false;
		}}>
		<FeeGroupForm onRefreshPage={refreshAction} {feeGroupData} action={isUpdate ? 'update' : 'create'} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<ModalDelete title="Delete Fee Group" size="md" selectedName={`Title: ${selectedName}`} onDelete={handleDelete} onCancel={() => (isDeleteModalOpen = false)} />
{/if}

<!-- prettier-ignore -->
<style>

</style>
