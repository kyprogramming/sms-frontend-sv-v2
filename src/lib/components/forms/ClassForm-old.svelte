<script lang="ts">
	import { writable } from "svelte/store";
	import { z } from "zod";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";

	const classSchema = z.object({
		name: z.string().min(1, "Class name is required"),
		level: z.number({ invalid_type_error: "Level must be a number" }),
		academicYear: z.string().min(4, "Year must be valid"),
	});

	type ClassFormData = z.infer<typeof classSchema>;

	let formData: ClassFormData = $state({
		name: "",
		level: 1,
		academicYear: "",
	});

	const formErrors = writable<Partial<Record<keyof ClassFormData, string>>>({});
	let error = $state("");

	async function onSubmit(e: Event) {
		e.preventDefault();
		const isValid = await validateForm(classSchema, formData, formErrors);
		if (!isValid) return;

		isLoading.set(true);
		try {
			// Replace with API call
			await new Promise((res) => setTimeout(res, 1000));
			showSnackbar({ message: "Class created successfully", type: "success" });
		} catch (err: any) {
			error = err?.message || "Failed to create class";
		} finally {
			isLoading.set(false);
		}
	}
</script>

<div class="form-wrapper">
	<h2>Basic Information</h2>
	<form onsubmit={onSubmit}>
		<div class="form-grid">
			<div class="form-group">
				<label for="name">Class Name</label>
				<input id="name" placeholder="type here" bind:value={formData.name} />
			</div>

			<div class="form-group">
				<label for="level">Level</label>
				<input id="level" type="number" placeholder="type here" bind:value={formData.level} />
			</div>

			<div class="form-group">
				<label for="academicYear">Academic Year</label>
				<input id="academicYear" placeholder="e.g. 2024-2025" bind:value={formData.academicYear} />
			</div>
		</div>

		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}Saving...{:else}Create Class{/if}
		</button>
		{#if error}<p class="error-text">{error}</p>{/if}
	</form>
</div>

<style>
	.form-wrapper {
		background: #fff;
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
		max-width: 700px;
		margin: auto;
	}

	h2 {
		/* font-size: 1.2rem; */
		margin-bottom: 1.5rem;
		color: #2c3e50;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
