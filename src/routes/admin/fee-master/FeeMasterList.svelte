<script lang="ts">
	import { env } from '$env/dynamic/public';
	import ModalDelete from '$lib/components/common/ModalDelete.svelte';
	import { Pencil, Eye, Trash2, Plus, Search, RefreshCw } from '@lucide/svelte';
	import type { ColumnConfig } from '$lib/interfaces/table.interface';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { deleteFeeMasterById, fetchFeeMasterById, fetchFeeMasters } from '$lib/services/fee-master';
	import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
	import DataTable from '$lib/components/common/DataTable.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import FeeMasterForm from './FeeMasterForm.svelte';
	import { page } from '$app/state';
	import ToggleSwitch from '$lib/components/common/ToggleSwitch.svelte';

	let { response } = $props();
	// console.log("response", response);

	let searchText = $state('');
	let feeMasterData: any | null = $state(null);
	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);
	let isUpdate = $state(false);
	let selectedId = $state('');
	let selectedName = $state('');
	let selectedFeeGroup = $state('');
	let selectedFeeType = $state('');

	let feeGroups = page.data?.feeGroups?.data || [];
	let feeTypes = page.data?.feeTypes?.data || [];
	// let feeMasters = page.data?.feeMasters || [];
	// console.log(feeMasters, feeGroups, feeTypes);
	const columns: ColumnConfig[] = [
		{ key: '_id', label: 'ID', visible: false },
		{ key: 'serialNo', label: 'Sr #', width: '80px', sortable: true },
		{ key: 'feeGroupId.name', label: 'Fee Group', sortable: true },
		{ key: 'feeTypeId.name', label: 'Fee Type', sortable: true },
		{ key: 'amount', label: 'Amount', format: (val) => `₹ ${val.toFixed(2)}`, sortable: true },
		{ key: 'dueDate', label: 'Due Date', format: (val) => new Date(val).toLocaleDateString(), sortable: true },
		{ key: 'fineType', label: 'Fine Type', sortable: true },
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
				action: async (item: { _id: string }) => {
					isUpdate = true;
					await updateAction(item._id);
				},
			},
			{
				icon: Trash2,
				class: 'delete',
				show: true,
				action: (item: { _id: string }) => {
					selectedId = item._id;
					selectedName = selectedId;
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
		feeMasterData = null;
		isUpdate = false;
		isModalOpen = true;
	}

	async function handleDelete() {
		await deleteAction(selectedId);
	}

	async function updateAction(id: string) {
		feeMasterData = null;
		const res = await fetchFeeMasterById(id);
		feeMasterData = res.data;
		isModalOpen = true;
	}

	async function deleteAction(id: string) {
		const json = await deleteFeeMasterById(id);
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
			feeGroupId: selectedFeeGroup,
			feeTypeId: selectedFeeType,
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await fetchFeeMasters(params);
		response = { ...json };
	}

	async function refreshAction() {
		const params = new URLSearchParams({
			search: searchText,
			page: String($currentPage),
			limit: String($rowsPerPage),
		});
		const json = await fetchFeeMasters(params);
		isModalOpen = false;
		selectedName = selectedFeeGroup = selectedFeeType = '';
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
	<title>{env.PUBLIC_SCHOOL_NAME} - Fee Master</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<select id="role" style="width:200px;" bind:value={selectedFeeGroup} onchange={(e) => (selectedFeeGroup = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select fee group</option>
			{#each feeGroups as group}
				<option value={group._id}>{group.name}</option>
			{/each}
		</select>

		<select id="role" style="width:200px;" bind:value={selectedFeeType} onchange={(e) => (selectedFeeType = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select fee type</option>
			{#each feeTypes as type}
				<option value={type._id}>{type.name}</option>
			{/each}
		</select>

		<input name="search" type="text" placeholder="Search fee masters..." bind:value={searchText} onkeydown={(e) => e.key === 'Enter' && handleSearch()} />
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
			<span>Add Master</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />



{#if isModalOpen}
	<Modal
		title={isUpdate ? 'Update Fee Master' : 'Add Fee Master'}
		size="lg"
		onClose={() => {
			isModalOpen = false;
		}}
		onCancel={() => {
			isModalOpen = false;
		}}>
		<FeeMasterForm onRefreshPage={refreshAction} {feeMasterData} action={isUpdate ? 'update' : 'create'} />
	</Modal>
{/if}

{#if isDeleteModalOpen}
	<ModalDelete title="Delete Fee Master" size="md" selectedName={`Name: ${selectedName}`} onDelete={handleDelete} onCancel={() => (isDeleteModalOpen = false)} />
{/if}

<!-- Add modal for create/edit as needed -->
