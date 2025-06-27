<script lang="ts">
    import { env } from '$env/dynamic/public';
    import ModalDelete from '$lib/components/common/ModalDelete.svelte';
    import { Pencil, Eye, Trash2, Plus, Search, RefreshCw } from '@lucide/svelte';
    import type { ColumnConfig } from '$lib/interfaces/table.interface';
    import { showSnackbar } from '$lib/components/snackbar/store';
    import { deleteFeeAssignmentById, fetchFeeAssignmentById, fetchFeeAssignments } from '$lib/services/fee-assignment';
    import { currentPage, rowsPerPage, totalItems, totalPages } from '$lib/stores/paginationStore';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import Modal from '$lib/components/common/Modal.svelte';
    import FeeAssignmentForm from './FeeAssignmentForm.svelte';
    import { page } from '$app/state';

    let { response } = $props();
    let searchText = $state('');
    let assignmentData: any | null = $state(null);
    let isModalOpen = $state(false);
    let isDeleteModalOpen = $state(false);
    let isUpdate = $state(false);
    let selectedId = $state('');
    let selectedName = $state('');
    let selectedStudent = $state('');
    let selectedFeeMaster = $state('');

    let students = page.data?.students?.data || [];
    let feeMasters = page.data?.feeMasters?.data || [];

    // console.log("FeeAssignmentList.svelte - Students:", response);

    const columns: ColumnConfig[] = [
        { key: '_id', label: 'ID', visible: true },
        { key: 'serialNo', label: 'Sr #', width: '80px', sortable: true },
        // { key: 'studentId.firstName', label: 'Student', format: (val, row) => `${row.studentId?.firstName} ${row.studentId?.lastName}`, sortable: true },
        { key: 'feeMasterId.feeTypeId.name', label: 'Fee Type', sortable: true },
        { key: 'amount', label: 'Amount', format: (val) => `₹ ${val.toFixed(2)}`, sortable: true },
        { key: 'dueDate', label: 'Due Date', format: (val) => new Date(val).toLocaleDateString(), sortable: true },
        { 
            key: 'isPaid', 
            label: 'Status', 
            width: '150px',
            format: (value) => value ? '<span class="paid-status">Paid</span>' : '<span class="unpaid-status">Unpaid</span>',
            sortable: true 
        },
        { key: 'academicYear', label: 'Academic Year', sortable: true },
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
                action: (item:any) => {
                    selectedId = item._id;
                    selectedName = `${item.studentId?.firstName} ${item.studentId?.lastName}`;
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
        assignmentData = null;
        isUpdate = false;
        isModalOpen = true;
    }

    async function handleDelete() {
        await deleteAction(selectedId);
    }

    async function updateAction(id: string) {
        assignmentData = null;
        const res = await fetchFeeAssignmentById(id);
        assignmentData = res.data;
        isModalOpen = true;
    }

    async function deleteAction(id: string) {
        const json = await deleteFeeAssignmentById(id);
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
            studentId: selectedStudent,
            feeMasterId: selectedFeeMaster,
            search: searchText,
            page: String($currentPage),
            limit: String($rowsPerPage),
        });
        const json = await fetchFeeAssignments(params);
        response = { ...json };
    }

    async function refreshAction() {
        const params = new URLSearchParams({
            search: searchText,
            page: String($currentPage),
            limit: String($rowsPerPage),
        });
        const json = await fetchFeeAssignments(params);
        isModalOpen = false;
        selectedName = selectedStudent = selectedFeeMaster = '';
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
    <title>{env.PUBLIC_SCHOOL_NAME} - Fee Assignment</title>
</svelte:head>

<div class="class-container">
    <div class="search-container">
        <select 
            id="student" 
            style="width:200px;" 
            bind:value={selectedStudent} 
            onchange={(e) => (selectedStudent = (e.target as HTMLSelectElement).value || '')}>
            <option value="" selected>Select student</option>
            {#each students as student}
                <option value={student._id}>
                    {student.firstName} {student.lastName}
                </option>
            {/each}
        </select>

        <select 
            id="feeMaster" 
            style="width:200px;" 
            bind:value={selectedFeeMaster} 
            onchange={(e) => (selectedFeeMaster = (e.target as HTMLSelectElement).value || '')}>
            <option value="" selected>Select fee master</option>
            {#each feeMasters as feeMaster}
                <option value={feeMaster._id}>
                    {feeMaster.feeTypeId?.name}
                </option>
            {/each}
        </select>

        <input 
            name="search" 
            type="text" 
            placeholder="Search assignments..." 
            bind:value={searchText} 
            onkeydown={(e) => e.key === 'Enter' && handleSearch()} />
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
            <span>Add Assignment</span>
        </button>
    </div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isModalOpen}
    <Modal
        title={isUpdate ? 'Update Assignment' : 'Add Assignment'}
        size="lg"
        onClose={() => {
            isModalOpen = false;
        }}
        onCancel={() => {
            isModalOpen = false;
        }}>
        <FeeAssignmentForm onRefreshPage={refreshAction} {assignmentData} action={isUpdate ? 'update' : 'create'} />
    </Modal>
{/if}

{#if isDeleteModalOpen}
    <ModalDelete 
        title="Delete Assignment" 
        size="md" 
        selectedName={`Student: ${selectedName}`} 
        onDelete={handleDelete} 
        onCancel={() => (isDeleteModalOpen = false)} />
{/if}

<style>
    .paid-status {
        color: var(--success-color);
        font-weight: 500;
    }
    .unpaid-status {
        color: var(--danger-color);
        font-weight: 500;
    }
</style>