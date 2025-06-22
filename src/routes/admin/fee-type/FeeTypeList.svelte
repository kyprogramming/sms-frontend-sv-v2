<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
	import { formatDate } from '$lib/utils/formatDate';
	import { RefreshCw, Search } from '@lucide/svelte';

	import DataTable from '$lib/components/common/DataTable.svelte';
	import ModalDelete from '$lib/components/common/ModalDelete.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import FeeTypeForm from './FeeTypeForm.svelte';

	import { Pencil, Eye, Trash2, Plus } from '@lucide/svelte';

	import type { ColumnConfig } from '$lib/interfaces/table.interface';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { deleteFeeTypeById, fetchFeeTypes, fetchFeeTypeById } from '$lib/services/fee-type.service';

	// Props
	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	let { response } = $props();

	// States
	let searchText = $state('');
	let feeTypeList: any | null = $state(null);

	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let isUpdate = $state(false);

	let selectedId = $state('');
	let selectedName = $state('');

	// Column configuration
	const columns: ColumnConfig[] = [
		{ key: '_id', label: 'Id', visible: false },
		{ key: 'serialNo', label: 'Sr #', width: '80px', sortable: true, align: 'center' },
		{ key: 'name', label: 'Name', width: 'auto', sortable: true, align: 'center' },
		{ key: 'code', label: 'Code', width: 'auto', sortable: true, align: 'center' },
		{ key: 'description', label: 'Description', width: 'auto', sortable: true, align: 'center' },
		{
			key: 'createdAt',
			label: 'Created At',
			width: 'auto',
			sortable: true,
			format: formatDate,
			align: 'center',
		},
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
				action: async (item: { _id: any }) => {
					isUpdate = true;
					await updateAction(item._id);
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
		feeTypeList = null;
		isUpdate = false;
		isModalOpen = true;
	}

	async function handleDelete() {
		await deleteAction(selectedId);
	}

	async function handlePaginationChange() {
		await refreshAction();
	}

	async function handlePageLimitChange() {
		await refreshAction();
	}

	// Server actions
	async function updateAction(id: string) {
		feeTypeList = null;
		const res = await fetchFeeTypeById(id);
		const { data } = res;
		feeTypeList = data;
		if (res.success) isModalOpen = true;
	}

	async function deleteAction(id: string) {
		const json = await deleteFeeTypeById(id);
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
		const params = new URLSearchParams({
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await fetchFeeTypes(params);
		response = { ...json };
	}

	async function refreshAction() {
		const params = new URLSearchParams({
			search: searchText || '',
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await fetchFeeTypes(params);
		isModalOpen = false;
		response = { ...json };
	}
</script>

<svelte:head>
	<title>{schoolName} - Fee Categories</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<input
			name="search"
			type="text"
			placeholder="Search fee categories..."
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
			<span>Add Fee Type</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
	<Modal
		title={isUpdate ? 'Update Fee Type' : 'Add Fee Type'}
		size="lg"
		onClose={() => {
			isModalOpen = false;
		}}
		onCancel={() => {
			isModalOpen = false;
		}}>
		<FeeTypeForm onRefreshPage={refreshAction} {feeTypeList} action={isUpdate ? 'update' : 'create'} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<ModalDelete
		title="Delete Fee Type"
		size="md"
		selectedName={`Name: ${selectedName}`}
		onDelete={handleDelete}
		onCancel={() => {
			isDeleteModalOpen = false;
		}} />
{/if}
