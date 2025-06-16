<script lang="ts">
	// Imports
	import { env } from '$env/dynamic/public';
	import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
	import { deleteSectionById, fetchSectionById, fetchSections } from '$lib/services/section';
	import { formatDate, formatLocalDate } from '$lib/utils/formatDate';

	import DataTable from '$lib/components/common/DataTable.svelte';
	import ModalDelete from '$lib/components/common/ModalDelete.svelte';

	import { Eye, Pencil, Trash2, Plus, RefreshCw, Search } from '@lucide/svelte';

	import type { ColumnConfig } from '$lib/interfaces/table.interface';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fetchStaffList } from '$lib/services/staff';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { STAFF_DEPARTMENTS, STAFF_DESIGNATIONS, STAFF_ROLES } from '$lib/utils/constants';

	// Props
	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	let { response } = $props();

	// States
	let searchText = $state('');
	let sectionData: any | null = $state(null);

	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);

	let selectedId = $state('');
	let selectedName = $state('');

	let classData = page.data?.classData || [];
	let classSections: { _id: string; name: string }[] = $state([]);
	let selectedRole = $state('');
	let selectedDepartment = $state('');
	let selectedDesignation = $state('');
	let formattedStaff = $state(formattedStaffs(response));

	// Column configuration
	const columns: ColumnConfig[] = [
		{ key: '_id', label: 'Id', visible: false },
		{ key: 'serialNo', label: 'Sr #', width: '80px', sortable: true, align: 'center' },
		{ key: 'profile.fullName', label: 'Name', width: '15%', sortable: true, align: 'center' },
		{ key: 'profile.role', label: 'Role', width: '10%', sortable: true, align: 'center' },
		{ key: 'profile.department', label: 'Department', width: '10%', sortable: true, align: 'center' },
		{ key: 'profile.designation', label: 'Designation', width: '10%', sortable: true, align: 'center' },
		{ key: 'profile.dateOfJoining', label: 'DOJ', width: '10%', sortable: true, align: 'center', format: formatDate },
		{ key: 'profile.gender', label: 'Gender', width: '10%', sortable: true, align: 'center' },
		{ key: 'profile.dob', label: 'DOB', width: '10%', sortable: true, align: 'center', format: formatDate },
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
					handleUpdate(item._id);
				},
			},
			{
				icon: Trash2,
				class: 'delete',
				show: true,
				action: (item: any) => {
					selectedId = item._id;
					selectedName = item.profile.fullName;
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

	async function handlePaginationChange() {
		await refreshAction();
	}

	async function handlePageLimitChange() {
		await refreshAction();
	}

	async function handleAdd() {
		await goto('/admin/staff/create');
	}

	async function handleUpdate(id: string) {
		await goto(`/admin/staff/update?id=${id}`);
	}

	function handleRoleChange(e: Event) {
		selectedRole = (e.target as HTMLSelectElement).value || '';
	}

	async function handleDelete() {
		await deleteAction(selectedId);
	}

	function formattedStaffs(response: any) {
		const formattedStaffList = response.data.data.map((staff: any) => {
			const foundClass = classData.find((cls: any) => cls._id === staff.classId);
			const className = foundClass?.name || null;

			const foundSection = foundClass?.sectionIds.find((sec: any) => sec._id === staff.sectionId);
			const sectionName = foundSection?.name || null;

			return {
				...staff,
				className,
				sectionName,
			};
		});

		// Return full formatted response with pagination
		return {
			success: response.success,
			message: response.message,
			data: {
				data: formattedStaffList,
				pagination: response.data.pagination,
			},
		};
	}

	async function searchAction() {
		// if (selectedRole == "" && selectedDepartment == "" && searchText === "") return;
		const params = new URLSearchParams({ role: selectedRole, department: selectedDepartment, designation: selectedDesignation, search: searchText, page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchStaffList(params);
		response = { ...json };
		formattedStaff = formattedStaffs(response);
	}

	async function refreshAction() {
		selectedRole = selectedDepartment = selectedDesignation = searchText = '';
		const params = new URLSearchParams({ role: selectedRole, department: selectedDepartment, designation: selectedDesignation, search: searchText, page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchStaffList(params);
		response = { ...json };
		formattedStaff = formattedStaffs(response);
	}

	async function updateAction(id: string) {
		sectionData = null;
		const res = await fetchSectionById(id);
		const { data } = res;
		sectionData = data;
		if (res.success) isModalOpen = true;
	}

	async function deleteAction(id: string) {
		const json = await deleteSectionById(id);
		if (json.success) {
			showSnackbar({ message: `Section ${json.message}`, type: 'success' });
			isDeleteModalOpen = false;
		} else showSnackbar({ message: `${json.message}`, type: 'error' });

		if ($totalItems % $rowsPerPage === 1 && $currentPage > 1) {
			currentPage.set($currentPage - 1);
		}
		await refreshAction();
	}
</script>

<svelte:head>
	<title>{schoolName} - Staff List</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<select id="role" style="width:150px;" bind:value={selectedRole} onchange={(e) => (selectedRole = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select Role</option>
			{#each STAFF_ROLES as role}
				<option value={role.name}>{role.name}</option>
			{/each}
		</select>

		<select id="department" style="width:150px;" bind:value={selectedDepartment} onchange={(e) => (selectedDepartment = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select Department</option>
			{#each STAFF_DEPARTMENTS as department}
				<option value={department.name}>{department.name}</option>
			{/each}
		</select>

		<select id="designation" style="width:150px;" bind:value={selectedDesignation} onchange={(e) => (selectedDesignation = (e.target as HTMLSelectElement).value || '')}>
			<option value="" selected>Select Designation</option>
			{#each STAFF_DESIGNATIONS as designation}
				<option value={designation.name}>{designation.name}</option>
			{/each}
		</select>

		<input
			name="search"
			type="text"
			placeholder="Search staff..."
			bind:value={searchText}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					handleSearch();
				}
			}}
		/>

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
			<span>Register Staff</span>
		</button>
	</div>
</div>

{#key formattedStaff || response}
	<DataTable response={formattedStaff} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />
{/key}

{#if isDeleteModalOpen}
	<ModalDelete
		title="Delete Staff"
		size="md"
		selectedName={`Name:  ${selectedName}`}
		onDelete={handleDelete}
		onCancel={() => {
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

	input[name='search'] {
		width: 300px;
	}
</style>
