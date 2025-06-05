<script lang="ts">
	import { get } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createSection, updateSection } from "$lib/services/section";
	import { BrushCleaning, Save } from "@lucide/svelte";
	import { sectionFormSchema, type SectionInputType } from "$lib/utils/schemas";
	import { formErrors } from "$lib/stores/formStore";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";

	let { onRefreshPage, sectionData = null, action } = $props();

	// Reactive form state
	formErrors.set({ name: "" });
	let formData: SectionInputType = $state({ name: "" });
	let touched: Partial<Record<keyof SectionInputType, boolean>> = $state({ name: false });
	let formSubmitted: boolean = $state(false);

	if (action === "update" && sectionData) {
		formData = {
			name: sectionData.name,
		};
	}

	function resetForm() {
		if (action === "update") {
			// formData = { studentData: { ...studentData.data }, userData: { ...studentData.data.userId } };
			// classSections = studentData.data.classId ? classData.find((cls: any) => cls._id === studentData.data.classId)?.sectionIds || [] : [];
			// selectedDateOfBirth = studentData.data.profile.dob ? new Date(studentData.data.profile.dob) : null;
		} else {
			formData = { name: "" };
			// classSections = [];
			// selectedDateOfBirth = null;
		}

		formErrors.set({});
		formSubmitted = false;
		touched = { name: false };
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = await validateForm(sectionFormSchema, formData, formErrors);
		if (!isValid) return;

		try {
			if (get(isUpdate) && sectionData) {
				await updateSection(sectionData._id, formData);
				showSnackbar({ message: "Section updated successfully", type: "success" });
			} else {
				await createSection(formData);
				showSnackbar({ message: "Section created successfully", type: "success" });
			}

			closeModal();
			onRefreshPage();
		} catch (err: unknown) {
			const errMsg = (err as Error)?.message ?? "Failed to save section";
			console.error(err);
		}
	}

	// Handle field changes
	function handleChange(field: keyof SectionInputType, value: string): void {
		formData[field] = value;
		touched = { ...touched, [field]: true };

		const result = sectionFormSchema.safeParse(formData);

		formErrors.update(() => {
			if (!result.success) {
				const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
				const errorMap: Partial<Record<keyof SectionInputType, string>> = {};
				for (const key in fieldErrors) {
					errorMap[key as keyof SectionInputType] = fieldErrors[key]?.[0] ?? "";
				}
				return errorMap;
			}
			return {};
		});
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Section Name <span class="required">*</span></label>
		<input
			id="name"
			type="text"
			name="name"
			placeholder="Section name"
			class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? "input-error" : ""}`}
			bind:value={formData.name}
			oninput={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
			onblur={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
		/>
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<!-- <div class="flex-items-center" style="justify-content:end;">
		<button class="btn ripple" type="reset" disabled={$isLoading} style="background-color: var(--clr-pri-light); align-self: right;"> Clear </button>
		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update{:else}Save{/if}
		</button>
	</div> -->

	<div class="form-actions">
		<button type="button" class="btn ripple btn-secondary" onclick={resetForm} disabled={$isLoading}>
			<BrushCleaning />
			<span>Reset Form</span>
		</button>

		<button class="btn ripple" type="submit" disabled={$isLoading}>
			<LoaderIcon />
			{#if !$isLoading}
				<Save />
			{/if}
			{#if action === "update"}
				Update Section
			{:else}
				Save Section
			{/if}
		</button>
	</div>
</form>
