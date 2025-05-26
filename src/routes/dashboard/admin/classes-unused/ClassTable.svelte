<script lang="ts">
	import { Eye, Edit, Trash2 } from "@lucide/svelte";
	import Pagination from "../../../../lib/components/Pagination.svelte";

	interface Class {
		id: number;
		name: string;
		level: string;
		academicYear: string;
	}

	let totalItems = 30;
	let currentPage = 1;
	interface Props {
		classes: Class[];
		rowsPerPage: number;
	}

	let { classes = $bindable(), rowsPerPage }: Props = $props();

	let sortColumn = $state("");
	let sortDirection = $state(1);

	function sortBy(column: keyof Class) {
		if (sortColumn === column) {
			sortDirection *= -1;
		} else {
			sortColumn = column;
			sortDirection = 1;
		}

		classes = [...classes].sort((a, b) => {
			const valA = a[column]?.toString().toLowerCase() || "";
			const valB = b[column]?.toString().toLowerCase() || "";
			return valA > valB ? sortDirection : valA < valB ? -sortDirection : 0;
		});
	}
</script>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th><input type="checkbox" /></th>
				<th onclick={() => sortBy("id")}>
					ID
					{#if sortColumn === "id"}
						<span>{sortDirection === 1 ? "▲" : "▼"}</span>
					{/if}
				</th>
				<th onclick={() => sortBy("name")}>
					NAME
					{#if sortColumn === "name"}
						<span>{sortDirection === 1 ? "▲" : "▼"}</span>
					{/if}
				</th>
				<th onclick={() => sortBy("level")}>
					LEVEL
					{#if sortColumn === "level"}
						<span>{sortDirection === 1 ? "▲" : "▼"}</span>
					{/if}
				</th>
				<th onclick={() => sortBy("academicYear")}>
					ACADEMIC YEAR
					{#if sortColumn === "academicYear"}
						<span>{sortDirection === 1 ? "▲" : "▼"}</span>
					{/if}
				</th>
				<th>ACTION</th>
			</tr>
		</thead>
		<tbody>
			{#each classes as cls}
				<tr>
					<td><input type="checkbox" /></td>
					<td>#{cls.id}</td>
					<td>{cls.name}</td>
					<td>{cls.level}</td>
					<td>{cls.academicYear}</td>
					<td>
						<span class="action-icons">
							<span class="icon-wrapper"><Eye size={15} /></span>
							<span class="icon-wrapper"><Edit size={15} /></span>
							<span class="icon-wrapper"><Trash2 size={15} /></span>
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="6" style="padding:3px;">
					<!-- <Pagination /> -->
				</td>
			</tr>
		</tfoot>
	</table>
</div>
