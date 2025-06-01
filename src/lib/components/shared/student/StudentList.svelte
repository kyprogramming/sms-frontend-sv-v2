<script lang="ts">
	import { run } from "svelte/legacy";

	import DataTable from "$lib/components/common/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/common/DeleteConfirmModal.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal, isUpdate, openEditModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus, BrushCleaning } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";
	import { goto } from "$app/navigation";
    import { page } from '$app/state';

	// interface Props {
	// 	response: any;
	// 	dataToUpdate: any;
	// 	onRefreshPage: () => void;
	// 	onSearchChange: () => void;
	// 	onDelete: (id: string) => void;
	// 	onUpdate: (id: string) => void;
	// }

	let {
		response,
		dataToUpdate = $bindable(),
		onRefreshPage,
		onSearchChange,
		onDelete,
		onUpdate,
		// classesWithSections
	} = $props();

	let localSearch = get(searchText);
	$effect.pre(() => {
		searchText.set(localSearch);
	});
	
    let classData = page.data?.classData || [];
    let classSections: { _id: string; name: string }[] = $state([]);
    let selectedClassId = $state("");
    let selectedSectionId = $state("");

	console.log("Data: Response", response);

	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr #", width: "80px", sortable: true, align: "center" },
		{ key: "profile.fullName", label: "Name", width: "25%", sortable: true, align: "center" },
		{ key: "classId", label: "Class", width: "auto", sortable: true, align: "center"},
		{ key: "sectionId", label: "Section", width: "auto", sortable: true, align: "center"},
		{ key: "profile.dob", label: "DOB", width: "auto", sortable: true, align: "center",format: formatDate },
		// { key: "academicYear", label: "Academic Year", width: "auto", sortable: true, align: "center" },
		{ key: "admissionDate", label: "Admission Date", width: "auto", sortable: true, align: "center" ,format: formatDate},
		{ key: "profile.gender", label: "Gender", width: "auto", sortable: true, align: "center" },
		// {
		// 	key: "createdAt",
		// 	label: "Created At",
		// 	sortable: true,
		// 	format: formatDate,
		// 	width: "250px",
		// 	align: "center",
		// },
	];

	const actions = {
		show: true,
		iconActions: [
			{
				icon: Eye,
				class: "view",
				show: true,
				action: (item: { _id: any }) => {
					alert(`View ${item._id}`);
				},
			},
			{
				icon: Pencil,
				class: "edit",
				show: true,
				action: (item: { _id: any }) => {
					handleUpdate(item._id);
				},
			},
			{
				icon: Trash2,
				class: "delete",
				show: true,
				action: (item: { _id: any }) => {
					handleDelete(item._id);
				},
			},
		],
	};

	async function handleRefreshPage() {
		onRefreshPage();
	}

	function handleSearchClick() {
		currentPage.set(1);
		onSearchChange?.();
	}

	function handleRefreshButtonClick() {
		searchText.set("");
		currentPage.set(1);
		onRefreshPage?.();
	}

	function handlePaginationChange() {
		onRefreshPage();
	}

	function handlePageLimitChange() {
		onRefreshPage();
	}

	function handleDelete(itemId: string) {
		openDeleteModal({ _id: itemId });
	}

	function handleAdd() {
        goto('/admin/student/register');
		dataToUpdate = null;
	}

	async function handleUpdate(id: string) {
		onUpdate(id);
	}

    function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value || "";
		const selectedClass = classData.find((cls: any) => cls._id === selected);
		classSections = selectedClass?.sectionIds || [];
	}
    function handleClearSearch() {
		searchText.set("");
        selectedClassId = "";
        selectedSectionId = "";
        classSections = [];
	}
</script>

<div class="class-container">
	<div class="search-container">
		<div>
			<select id="classId" style="width:200px;"  bind:value={selectedClassId} onchange={handleClassChange}>
				<option value="" disabled selected>Select Class</option>
				{#each classData as cls}
                    <option value={cls._id}>{cls.name}</option>
                {/each}
			</select>
		</div>
		<div>
			<select id="sectionId" style="width:200px;"  bind:value={selectedSectionId} disabled={!classSections.length}>
				<option value="" disabled selected>Select Section</option>
				{#each classSections as section}
					<option value={section._id}>{section.name}</option>
				{/each}
			</select>
		</div>
		<input name="search" type="text" placeholder="Search student..." bind:value={$searchText} />

		<button type="button" class="btn ripple" onclick={handleSearchClick}>
			<Search />
			<span>Search</span>
		</button>

        <button type="button" class="btn ripple btn-secondary" onclick={handleClearSearch}>
			<BrushCleaning  />
			<span>Clear</span>
		</button>

		<button type="button" class="btn ripple btn-secondary" onclick={handleRefreshButtonClick}>
			<RefreshCw />
			<span>Refresh</span>
		</button>
	</div>

	<div class="action-buttons">
		<button type="button" class="btn ripple" onclick={handleAdd}>
			<Plus size={16} />
			<span>Register Student</span>
		</button>
	</div>
</div>

<DataTable {response} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />

{#if isDeleteModalOpen}
	<DeleteConfirmModal
		title="Delete Section"
		size="md"
		onDelete={() => {
			onDelete($modalData._id);
		}}
		onCancel={() => {
			modalData.set(null);
		}}
	/>
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

	.icon-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
	}
	input[name="search"] {
		width: 300px;
	}
</style>
