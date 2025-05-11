<script lang="ts">
	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createSection, updateSection } from "$lib/services/section";

	// Props
	export let onRefreshPage: () => void;
	export let dataToUpdate: { _id: string; name: string } | null = null;

	// Zod schema
	const sectionSchema = z.object({
		name: z.string().min(1, "Section name is required"),
	});

	type SectionFormData = z.infer<typeof sectionSchema>;

	// Reactive form state
	let formData: SectionFormData = { name: "" };
	let error = "";

	const formErrors = writable<Partial<Record<keyof SectionFormData, string>>>({});
	const touched = writable<Partial<Record<keyof SectionFormData, boolean>>>({ name: false });
	const submitAttempted = writable(false);

	// Prefill data if editing
	function populateFormData() {
		if (dataToUpdate) {
			formData = {
				name: dataToUpdate.name,
			};
		}
	}
	$: populateFormData();

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		submitAttempted.set(true);

		const isValid = await validateForm(sectionSchema, formData, formErrors);
		if (!isValid) return;

		try {
			if (get(isUpdate) && dataToUpdate) {
				await updateSection(dataToUpdate._id, formData);
				showSnackbar({ message: "Section updated successfully", type: "success" });
			} else {
				await createSection(formData);
				showSnackbar({ message: "Section created successfully", type: "success" });
			}

			closeModal();
			onRefreshPage();
		} catch (err: unknown) {
			const errMsg = (err as Error)?.message ?? "Failed to save section";
			error = errMsg;
			console.error(err);
		}
	}

	// Handle field changes
	function handleChange(field: keyof SectionFormData, value: string): void {
		formData[field] = value;
		touched.update((t) => ({ ...t, [field]: true }));

		const result = sectionSchema.safeParse(formData);

		formErrors.update(() => {
			if (!result.success) {
				const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
				const errorMap: Partial<Record<keyof SectionFormData, string>> = {};
				for (const key in fieldErrors) {
					errorMap[key as keyof SectionFormData] = fieldErrors[key]?.[0] ?? "";
				}
				return errorMap;
			}
			return {};
		});
	}
</script>

<form on:submit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Name *</label>
		<input
			id="name"
			type="text"
			name="name"
			placeholder="Section name"
			class={`w-full ${$formErrors.name && ($touched.name || $submitAttempted) ? "input-error" : ""}`}
			bind:value={formData.name}
			on:input={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
			on:blur={() => touched.update((t) => ({ ...t, name: true }))}
		/>
		{#if $formErrors.name && ($touched.name || $submitAttempted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="flex-items-center" style="justify-content:end;">
		<button class="btn ripple" type="reset" disabled={$isLoading} style="background-color: var(--primary-light); align-self: right;"> Clear </button>
		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update{:else}Save{/if}
		</button>
	</div>
</form>
