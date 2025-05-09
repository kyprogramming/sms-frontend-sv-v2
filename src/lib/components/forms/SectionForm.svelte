<script lang="ts">
	import { writable } from "svelte/store";
	import { z } from "zod";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal } from "$lib/stores/modalStore";
	import { createSection } from "$lib/api/section";
	import { goto, invalidate } from "$app/navigation";

	export let onSectionAdded: () => void;

	const sectionSchema = z.object({
		name: z.string().min(1, "Section name is required"),
	});

	type SectionFormData = z.infer<typeof sectionSchema>;
	let formData: SectionFormData = {
		name: "",
	};

	let error = "";
	const formErrors = writable<Partial<Record<keyof SectionFormData, string>>>({});
	const touched = writable<Partial<Record<keyof SectionFormData, boolean>>>({
		name: false,
	});
	export const submitAttempted = writable(false);

	async function onSubmit(e: Event) {
		e.preventDefault();
		submitAttempted.set(true);
		const isValid = await validateForm(sectionSchema, formData, formErrors);
		if (!isValid) return;
		isLoading.set(true);
		try {
			// console.log("formData:", formData);
			const res = await createSection(formData);
			// console.log("SAVE SECTION RESPONSE", res)
			closeModal();
			onSectionAdded();
			showSnackbar({ message: "Class created successfully", type: "success" });
			// await goto('/dashboard/admin/section', { invalidateAll: true });
		} catch (err: any) {
			error = err.message || "Failed to create class";
		} finally {
			isLoading.set(false);
		}
	}

	function handleChange(field: keyof SectionFormData, value: string): void {
		formData[field] = value;

		touched.update((t) => ({ ...t, [field]: true }));

		const result = sectionSchema.safeParse(formData);

		formErrors.update(() => {
			if (!result.success) {
				const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
				const errorMap: Record<string, string | undefined> = {};

				for (const key in fieldErrors) {
					errorMap[key] = fieldErrors[key]?.[0];
				}

				return errorMap;
			}
			return {};
		});
	}
</script>

<!-- <div class="form-wrapper"> -->
<form on:submit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Name *</label>
		<input
			type="text"
			name="name"
			placeholder="Section name"
			bind:value={formData.name}
			class={`w-full ${$formErrors.name && ($touched.name || $submitAttempted) ? "input-error" : ""}`}
			on:input={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
			on:blur={() => touched.update((t) => ({ ...t, name: true }))}
		/>
		{#if $formErrors.name && ($touched.name || $submitAttempted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="flex-items-center" style="justify-content:end;">
		<button class="btn ripple" style="background-color: var(--primary-light); align-self: right;" type="reset" disabled={$isLoading}> Clear </button>
		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}Saving...{:else}Save{/if}
		</button>
	</div>
</form>

<!-- </div> -->

<style>
	.form-wrapper {
		background: #fff;
		padding: 6px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
		width: 100%;
	}

	h2 {
		/* font-size: 1.2rem; */
		margin-bottom: 1rem;
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
