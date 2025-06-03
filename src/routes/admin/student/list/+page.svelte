<script lang="ts">

	import { isModalOpen, openEditModal, openModal } from "$lib/stores/modalStore";

	import { searchText, currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import {  fetchStudentList } from "$lib/services/student";
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import StudentList from "$lib/components/shared/student/StudentList.svelte";

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let response: any = $state(data.data);
	let dataToUpdate: any;

	const breadcrumbItems = [ { label: "Dashboard", href: "/admin/dashboard" }, { label: "Student List" }];

	async function handleSearchChange() {
		if ($searchText === "") return;
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText, page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchStudentList(params);
		response = { ...json };
	}

	async function handleRefreshPage() {
		isModalOpen.set(false);
		loadPaginationVariables(); // Load pagination variables
		const params = new URLSearchParams({ search: $searchText || "", page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
		const json = await fetchStudentList(params);
		response = { ...json };
	}

	// async function handleUpdate(id: string) {
	// 	// console.log("id:", id);
	// 	dataToUpdate = null;
	// 	const res = await fetchStudentById(id);
	// 	const { data } = res;
	// 	dataToUpdate = data;
	// 	if (res.success) openEditModal();
	// }

	// async function handleDelete(id: string) {
	// 	const json = await deleteStudentById(id);
	// 	if (json.success) showSnackbar({ message: `Student ${json.message}`, type: "success" });
	// 	else showSnackbar({ message: `${json.message}`, type: "error" });
	// 	await handleRefreshPage();
	// }

	function loadPaginationVariables() {
		$searchText = get(searchText);
		$currentPage = get(currentPage);
		$rowsPerPage = get(rowsPerPage);
		$totalPages = get(totalPages);
		$totalItems = get(totalItems);
	}

    // console.log("response::",  $state.snapshot(response));
</script>

<Breadcrumb title="Student List" items={breadcrumbItems} />
{#key response || dataToUpdate}
	<StudentList {response} onRefreshPage={handleRefreshPage} onDelete={()=>{}} />
{/key}
