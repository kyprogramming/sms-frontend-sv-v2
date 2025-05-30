<script lang="ts">
	import { run } from "svelte/legacy";

	import DataTable from "$lib/components/common/DataTable.svelte";
	import DeleteConfirmModal from "$lib/components/common/DeleteConfirmModal.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import { isDeleteModalOpen, isModalOpen, modalData, openDeleteModal, openModal, isUpdate, openEditModal } from "$lib/stores/modalStore";
	import { formatDate } from "$lib/utils/formatDate";
	import { Pencil, Eye, Trash2, Plus } from "@lucide/svelte";
	import { get } from "svelte/store";
	import { RefreshCw, Search } from "@lucide/svelte";
	import { searchText, currentPage } from "$lib/stores/paginationStore";
	import type { ColumnConfig } from "$lib/interfaces/table.interface";

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
	let availableSections: { _id: string; name: string }[] = $state([]);

	// console.log("dataToUpdate: SectionList", dataToUpdate);

	const columns: ColumnConfig[] = [
		{ key: "_id", label: "Id", visible: false },
		{ key: "serialNo", label: "Sr #", width: "80px", sortable: true, align: "center" },
		{ key: "academicYear", label: "Academic Year", width: "10%", sortable: true, align: "center" },
		{ key: "profile.firstName", label: "First Name", width: "auto", sortable: true, align: "center" },
		{
			key: "createdAt",
			label: "Created At",
			sortable: true,
			format: formatDate,
			width: "250px",
			align: "center",
		},
	];

	const actions = {
		show: true,
		iconActions: [
			{
				icon: Eye,
				class: "view",
				show: false,
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
		openModal();
		dataToUpdate = null;
	}

	async function handleUpdate(id: string) {
		onUpdate(id);
	}
</script>

<div class="class-container">
	<div class="search-container">
		<div>
			<select id="classId" style="width:200px;">
				<option value="" disabled selected>Select Class</option>
				<!-- {#each classesWithSections as cls}
                    <option value={cls._id}>{cls.name}</option>
                {/each} -->
			</select>
		</div>
		<div>
			<select id="sectionId" style="width:200px;" disabled={!availableSections.length}>
				<option value="" disabled selected>Select Section</option>
				{#each availableSections as section}
					<option value={section._id}>{section.name}</option>
				{/each}
			</select>
		</div>
		<input name="search" type="text" placeholder="Search section..." bind:value={$searchText} />

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
			<span>Add Section</span>
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
