<script lang="ts">
	import Breadcrumb from "$lib/components/common/Breadcrumb.svelte";
	import ClassList from "./ClassList.svelte";

	let { data } = $props();
	let response: any = $state(data.data);

	const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Classes" }];

	// async function handleSearchChange() {
	// 	if ($searchText === "") return;
	// 	isModalOpen.set(false);
	// 	loadPaginationVariables(); // Load pagination variables
	// 	const params = new URLSearchParams({ search: $searchText, page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
	// 	const json = await fetchClasses(params);
	// 	response = { ...json };
	// }

	// async function handleRefreshPage() {
	// 	isModalOpen.set(false);
	// 	loadPaginationVariables(); // Load pagination variables
	// 	const params = new URLSearchParams({ search: $searchText || "", page: String($currentPage), limit: String($rowsPerPage) }); // Build query string
	// 	const json = await fetchClasses(params);
	// 	response = { ...json };
	// }

	// async function handleUpdate(id: string) {
	// 	// console.log("id:", id);
	// 	dataToUpdate = null;
	// 	const res = await fetchClassById(id);
	// 	const { data } = res;
	// 	dataToUpdate = data;
	// 	if (res.success) openEditModal();
	// }

	// async function handleDelete(id: string) {
	// 	const json = await deleteClassById(id);
	// 	if (json.success) showSnackbar({ message: `Section ${json.message}`, type: "success" });
	// 	else showSnackbar({ message: `${json.message}`, type: "error" });
	// 	await handleRefreshPage();
	// }

</script>

<Breadcrumb title="Classes" items={breadcrumbItems} />

<ClassList {response} />
