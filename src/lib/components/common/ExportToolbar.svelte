<script lang="ts">
	let searchQuery = '';

	function handleSearch(e: Event) {
		const input = e.target as HTMLInputElement;
		searchQuery = input.value;
		// console.log("Searching:", searchQuery);
	}

	function copyData() {
		// console.log("Copy clicked");
	}

	function exportExcel() {
		// console.log("Export Excel");
	}

	function exportCSV() {
		// console.log("Export CSV");
	}

	function exportPDF() {
		// console.log("Export PDF");
	}
</script>

<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white">
	<!-- Search -->
	<input type="text" placeholder="Search..." class="border px-4 py-2 rounded-md w-full md:w-1/3" oninput={handleSearch} />

	<!-- Action Buttons -->
	<div class="flex flex-wrap gap-2">
		<button onclick={copyData} class="btn-export">Copy</button>
		<button onclick={exportExcel} class="btn-export">Excel</button>
		<button onclick={exportCSV} class="btn-export">CSV</button>
		<button onclick={exportPDF} class="btn-export">PDF</button>
	</div>
</div>
<!-- prettier-ignore -->
<style>
	 .btn-export { @apply bg-blue-500 hover: bg-blue-600 text-white text-sm px-4 py-2 rounded transition; }
</style>
