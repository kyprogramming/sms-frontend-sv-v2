<script>
	import ClassHeader from "./ClassHeader.svelte";
	import ClassFilters from "./ClassFilters.svelte";
	import ClassTable from "./ClassTable.svelte";
	import Pagination from "./Pagination.svelte";

	let totalClasses = 120;
	let totalLevels = 5;
	let totalAcademicYears = 3;
	let rowsPerPage = 30; // Changed to match the image's default
	let currentPage = 1;
	let levelFilter = "1";
	let academicYearFilter = "2023-2024";
	let classes = [
		{ id: 1, name: "Mathematics 101", level: 1, academicYear: "2023-2024" },
		{ id: 2, name: "Science 201", level: 2, academicYear: "2023-2024" },
		{ id: 3, name: "History 101", level: 1, academicYear: "2024-2025" },
		{ id: 4, name: "Literature 301", level: 3, academicYear: "2022-2023" },
		{ id: 5, name: "Physics 201", level: 2, academicYear: "2023-2024" },
		{ id: 6, name: "Chemistry 301", level: 3, academicYear: "2024-2025" },
		{ id: 7, name: "Geography 101", level: 1, academicYear: "2022-2023" },
		{ id: 8, name: "Biology 201", level: 2, academicYear: "2023-2024" },
		{ id: 9, name: "Art 301", level: 3, academicYear: "2024-2025" },
		{ id: 10, name: "Music 101", level: 1, academicYear: "2022-2023" },
		// Simulate more data for pagination
		...Array.from({ length: 50 }, (_, i) => ({
			id: i + 11,
			name: `Class ${i + 11}`,
			level: (i % 3) + 1,
			academicYear: ["2022-2023", "2023-2024", "2024-2025"][i % 3],
		})),
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
	<!-- <ClassHeader {totalClasses} {totalLevels} {totalAcademicYears} />
  <ClassFilters bind:rowsPerPage bind:levelFilter bind:academicYearFilter /> -->
	<ClassTable {classes} {rowsPerPage} />
	<Pagination {totalItems} bind:rowsPerPage bind:currentPage />
</div>

<style>
	.class-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: var(--shadow-sm);
		margin-top: 15px;
	}
</style>
