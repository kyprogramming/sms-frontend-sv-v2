<script lang="ts">
        	import { env } from "$env/dynamic/public";
	import DataTable from "$lib/components/common/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/common/DeleteConfirmModal.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal, isUpdate, openEditModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus, BrushCleaning } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";
	import { goto, invalidateAll } from "$app/navigation";
	import { page } from "$app/state";
	import { fetchStudentList } from "$lib/services/student";

    const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";

	let {
		response,
		onRefreshPage,
		onDelete,
	} = $props();

	let localSearch = get(searchText);
	$effect.pre(() => {
		searchText.set(localSearch);
	});

	let classData = page.data?.classData || [];
	let classSections: { _id: string; name: string }[] = $state([]);
	let selectedClassId = $state("");
	let selectedSectionId = $state("");
	let formattedStudent = $state(formattedStudents(response));

	// console.log("formattedStudent",formattedStudent);

	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr #", width: "80px", sortable: true, align: "center" },
		{ key: "profile.fullName", label: "Name", width: "25%", sortable: true, align: "center" },
		{ key: "className", label: "Class", width: "auto", sortable: true, align: "center" },
		{ key: "sectionName", label: "Section", width: "auto", sortable: true, align: "center" },
		{ key: "profile.dob", label: "DOB", width: "auto", sortable: true, align: "center", format: formatDate },
		// { key: "academicYear", label: "Academic Year", width: "auto", sortable: true, align: "center" },
		{ key: "admissionDate", label: "Admission Date", width: "auto", sortable: true, align: "center", format: formatDate },
		{ key: "profile.gender", label: "Gender", width: "auto", sortable: true, align: "center" },
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

	async function handleSearchClick() {
		currentPage.set(1);
		loadPaginationVariables();
		const params = new URLSearchParams({ classId: selectedClassId, sectionId: selectedSectionId, search: $searchText, page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchStudentList(params);
		response = { ...json };
		formattedStudent = formattedStudents(response);
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

	async function handleAdd() {
		await goto("/admin/student/create");
	}

	async function handleUpdate(id: string) {
		await goto(`/admin/student/update?id=${id}`);
	}

	function handleClassChange(e: Event) {
		selectedSectionId = "";
		const selected = (e.target as HTMLSelectElement).value || "";
		const selectedClass = classData.find((cls: any) => cls._id === selected);
		classSections = selectedClass?.sectionIds || [];
	}

	function loadPaginationVariables() {
		$searchText = get(searchText);
		$currentPage = get(currentPage);
		$rowsPerPage = get(rowsPerPage);
		$totalPages = get(totalPages);
		$totalItems = get(totalItems);
	}

    function formattedStudents(response: any) {
	const formattedStudentList = response.data.data.map((student: any) => {
		const foundClass = classData.find((cls: any) => cls._id === student.classId);
		const className = foundClass?.name || null;

		const foundSection = foundClass?.sectionIds.find((sec: any) => sec._id === student.sectionId);
		const sectionName = foundSection?.name || null;

		return {
			...student,
			className,
			sectionName,
		};
	});

	// Return full formatted response with pagination
	return {
		success: response.success,
		message: response.message,
		data: {
			data: formattedStudentList,
			pagination: response.data.pagination,
		},
	};
}
</script>

<svelte:head>
  <title>{schoolName} - Student</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<select id="classId" style="width:150px;" bind:value={selectedClassId} onchange={handleClassChange}>
			<option value="" disabled selected>Select Class</option>
			{#each classData as cls}
				<option value={cls._id}>{cls.name}</option>
			{/each}
		</select>

		<select id="sectionId" style="width:150px;" bind:value={selectedSectionId} disabled={!classSections.length}>
			<option value="" disabled selected>Select Section</option>
			{#each classSections as section}
				<option value={section._id}>{section.name}</option>
			{/each}
		</select>

		<input name="search" type="text" placeholder="Search student..." bind:value={$searchText} />

		<button type="button" class="btn ripple" onclick={handleSearchClick}>
			<Search />
			<span>Search</span>
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

{#key formattedStudent || response}
	<DataTable response={formattedStudent} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />
{/key}

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

	input[name="search"] {
        width: 300px;
	}

</style>
