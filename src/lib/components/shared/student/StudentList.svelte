<script lang="ts">
	// Imports
	import { env } from "$env/dynamic/public";
	import { currentPage, rowsPerPage, totalItems, totalPages } from "$lib/stores/paginationStore";
	import { deleteSectionById, fetchSectionById, fetchSections } from "$lib/services/section";
	import { formatDate, formatLocalDate } from "$lib/utils/formatDate";

	import DataTable from "$lib/components/common/DataTable.svelte";
	import ModalDelete from "$lib/components/common/ModalDelete.svelte";

	import { Eye, Pencil, Trash2, Plus, RefreshCw, Search } from "@lucide/svelte";

	import type { ColumnConfig } from "$lib/interfaces/table.interface";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { fetchStudentList } from "$lib/services/student";
	import { showSnackbar } from "$lib/components/snackbar/store";

	// Props
	const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
	let { response } = $props();

	// States
	let searchText = $state("");
	let sectionData: any | null = $state(null);

	let isModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);

	let selectedId = $state("");
	let selectedName = $state("");

	let classData = page.data?.classData || [];
	let classSections: { _id: string; name: string }[] = $state([]);
	let selectedClassId = $state("");
	let selectedSectionId = $state("");
	let formattedStudent = $state(formattedStudents(response));

	// Column configuration
	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr #", width: "80px", sortable: true, align: "center" },
		{ key: "profile.fullName", label: "Name", width: "25%", sortable: true, align: "center" },
		{ key: "className", label: "Class", width: "auto", sortable: true, align: "center" },
		{ key: "sectionName", label: "Section", width: "auto", sortable: true, align: "center" },
		{ key: "admissionDate", label: "Admission Date", width: "auto", sortable: true, align: "center", format: formatDate },
		{ key: "profile.gender", label: "Gender", width: "auto", sortable: true, align: "center" },
		{ key: "profile.dob", label: "DOB", width: "auto", sortable: true, align: "center", format: formatDate },
		// { key: "academicYear", label: "Academic Year", width: "auto", sortable: true, align: "center" },
	];

	// Actions configuration
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
				action: async (item: { _id: any }) => {
					handleUpdate(item._id);
				},
			},
			{
				icon: Trash2,
				class: "delete",
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
		searchText = "";
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

	async function handleDelete() {
		await deleteAction(selectedId);
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

	async function searchAction() {
		// if (selectedClassId == "" && selectedSectionId == "" && searchText === "") return;
		const params = new URLSearchParams({ classId: selectedClassId, sectionId: selectedSectionId, search: searchText, page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchStudentList(params);
		response = { ...json };
		formattedStudent = formattedStudents(response);
	}

	async function refreshAction() {
		selectedClassId = selectedSectionId = searchText = "";
		const params = new URLSearchParams({ classId: selectedClassId, sectionId: selectedSectionId, search: searchText, page: String($currentPage), limit: String($rowsPerPage) });
		const json = await fetchStudentList(params);
		response = { ...json };
		formattedStudent = formattedStudents(response);
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
			showSnackbar({ message: `Section ${json.message}`, type: "success" });
			isDeleteModalOpen = false;
		} else showSnackbar({ message: `${json.message}`, type: "error" });

		if ($totalItems % $rowsPerPage === 1 && $currentPage > 1) {
			currentPage.set($currentPage - 1);
		}
		await refreshAction();
	}
</script>

<svelte:head>
	<title>{schoolName} - Student List</title>
</svelte:head>

<div class="class-container">
	<div class="search-container">
		<select id="classId" style="width:150px;" bind:value={selectedClassId} onchange={handleClassChange}>
			<option value="" selected>Select Class</option>
			{#each classData as cls}
				<option value={cls._id}>{cls.name}</option>
			{/each}
		</select>

		<select id="sectionId" style="width:150px;" bind:value={selectedSectionId} disabled={selectedClassId === ""}>
			<option value="" disabled selected>Select Section</option>
			{#each classSections as section}
				<option value={section._id}>{section.name}</option>
			{/each}
		</select>

		<input
			name="search"
			type="text"
			placeholder="Search student..."
			bind:value={searchText}
			onkeydown={(e) => {
				if (e.key === "Enter") {
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
			<span>Register Student</span>
		</button>
	</div>
</div>

{#key formattedStudent || response}
	<DataTable response={formattedStudent} {columns} {actions} onPaginationChange={handlePaginationChange} onPageLimitChange={handlePageLimitChange} />
{/key}

{#if isDeleteModalOpen}
	<ModalDelete
		title="Delete Student"
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

	input[name="search"] {
		width: 300px;
	}
</style>
