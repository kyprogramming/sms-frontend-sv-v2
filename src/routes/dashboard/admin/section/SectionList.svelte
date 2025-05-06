<script lang="ts">
	import ExportToolbar from "$lib/components/ExportToolbar.svelte";
	import ClassForm from "$lib/components/forms/ClassForm.svelte";
	import SectionForm from "$lib/components/forms/SectionForm.svelte";
	import Modal, { type ModalSize } from "$lib/components/Modal.svelte";
	import { isModalOpen, openModal } from "$lib/stores/modalStore";
	import ClassFilters from "../class/ClassFilters.svelte";
	import ClassTable from "../class/ClassTable.svelte";
	import { Search, Download, Plus } from "@lucide/svelte";

	let totalClasses = 120;
	let totalLevels = 5;
	let totalAcademicYears = 3;
	let rowsPerPage = 30; // Changed to match the image's default
	let currentPage = 1;
	let levelFilter = "1";
	let academicYearFilter = "2023-2024";
	let currentSize: ModalSize = "sm";
	let classes = [
		{ id: 1, name: "Mathematics 101", level: 1, academicYear: "2023-2024" },
		{ id: 2, name: "Science 201", level: 2, academicYear: "2023-2024" },
		{ id: 3, name: "History 101", level: 1, academicYear: "2024-2025" },
		{ id: 4, name: "Literature 301", level: 3, academicYear: "2022-2023" },
		{ id: 5, name: "Physics 201", level: 2, academicYear: "2023-2024" },
		// { id: 6, name: "Chemistry 301", level: 3, academicYear: "2024-2025" },
		// { id: 7, name: "Geography 101", level: 1, academicYear: "2022-2023" },
		// { id: 8, name: "Biology 201", level: 2, academicYear: "2023-2024" },
		// { id: 9, name: "Art 301", level: 3, academicYear: "2024-2025" },
		// { id: 10, name: "Music 101", level: 1, academicYear: "2022-2023" },
		// Simulate more data for pagination
		// ...Array.from({ length: 50 }, (_, i) => ({
		// 	id: i + 11,
		// 	name: `Class ${i + 11}`,
		// 	level: (i % 3) + 1,
		// 	academicYear: ["2022-2023", "2023-2024", "2024-2025"][i % 3],
		// })),
	];

	// Filter and paginate classes
	$: filteredClasses = classes
		.filter((cls) => levelFilter === "" || cls.level.toString() === levelFilter)
		.filter(
			(cls) =>
				academicYearFilter === "" || cls.academicYear === academicYearFilter,
		);

	$: totalItems = filteredClasses.length;

	$: paginatedClasses = filteredClasses.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage,
	);

	// Reset currentPage to 1 when rowsPerPage changes
	$: if (rowsPerPage) {
		currentPage = 1;
	}
</script>

<div class="class-container">
	<div class="search-container">
		<svg
			class="search-icon"
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="11" cy="11" r="8"></circle>
			<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
		</svg>
		<input name="search" type="text" placeholder="Search..." />
	</div>
	<div class="action-buttons">
		<!-- <button type="button" class="btn ripple">
			<span>Search</span>
		</button>

		<button type="button" class="btn ripple">
			<Download size={16} />
			<span>Download</span>
		</button> -->

		<button type="button" class="btn ripple" on:click={openModal}>
			<Plus size={16} />
			<span>Add Section</span>
		</button>
	</div>
</div>
<ClassTable {classes} {rowsPerPage} />

<Modal title="Add Section" size="md">
	<SectionForm />
</Modal>

<!-- <div class="form-container">
	<div class="form-container-left">
        <SectionForm/>
    </div>
	<div class="form-container-right">
        <h2>SECTION LIST</h2>
        <ExportToolbar/>
		<ClassFilters bind:levelFilter bind:academicYearFilter />
		<ClassTable {classes} {rowsPerPage} />
	</div>
</div> -->

<style>
	.filter-group input {
		border: 0px;
		border-bottom: 1px solid --gray5;
		border-radius: 0px;
	}
	.filter-group input:focus {
		outline: none;
		box-shadow: none;
	}

	.search-container {
		position: relative;
		width: 300px; /* adjust as needed */
	}

	.search-icon {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none; /* so input remains clickable/focusable */
		z-index: 1;
	}

	input[name="search"] {
		width: 100%;
		padding-left: 30px; /* make space for the icon */
		box-sizing: border-box;
	}
</style>
