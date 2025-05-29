<script lang="ts">
	import { run } from 'svelte/legacy';

	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createClass, updateClass } from "$lib/services/class";
	import { fetchSectionList } from "$lib/services/section";
	import { onMount } from "svelte";

	// type Section = { _id: string; name: string };
	let allSections: any = $state();
	onMount(async () => {
		allSections = await fetchSectionList();
		// console.log("allSections", allSections);
	});

	
	interface Props {
		// Props
		onRefreshPage: () => void;
		dataToUpdate?: any | null;
	}

	let { onRefreshPage, dataToUpdate = null }: Props = $props();

	// Zod schema
	const classSchema = z.object({
		name: z.string().min(1, "Class name is required"),
		sectionIds: z.array(z.string()).min(1, "Please select at least one section"),
	});

	type ClassFormData = z.infer<typeof classSchema>;

	// Reactive form state
	let formData: ClassFormData = $state({
		name: "",
		sectionIds: [], // Now this works fine
	});
	let error = "";

	const formErrors = writable<Partial<Record<keyof ClassFormData, string>>>({});
	const touched = writable<Partial<Record<keyof ClassFormData, boolean>>>({ name: false });
	const submitAttempted = writable(false);

	// Prefill data if editing
	function populateFormData() {
        // console.log("dataToUpdate:", dataToUpdate);
		if (dataToUpdate) {
			formData = {
				name: dataToUpdate.name,
				sectionIds:  dataToUpdate.sectionIds.map((section: { _id: string; }) => section._id)  || [],
			};
		}
	}
	run(() => {
		populateFormData();
	});

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		submitAttempted.set(true);

		const isValid = await validateForm(classSchema, formData, formErrors);
		if (!isValid) return;

		try {
			if (get(isUpdate) && dataToUpdate) {
				await updateClass(dataToUpdate._id, formData);
				showSnackbar({ message: "Class updated successfully", type: "success" });
			} else {
				await createClass(formData);
				showSnackbar({ message: "Class created successfully", type: "success" });
			}

			closeModal();
			onRefreshPage();
		} catch (err: unknown) {
			const errMsg = (err as Error)?.message ?? "Failed to save class";
			error = errMsg;
			console.error(err);
		}
	}

	// Handle field changes
	function handleChange(field: keyof ClassFormData, value: string | string[]): void {
		if (field === "name" && typeof value === "string") {
			formData.name = value;
		} else if (field === "sectionIds" && Array.isArray(value)) {
			formData.sectionIds = value;
		}

		touched.update((t) => ({ ...t, [field]: true }));

		const result = classSchema.safeParse(formData);

		formErrors.update(() => {
			if (!result.success) {
				const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
				const errorMap: Partial<Record<keyof ClassFormData, string>> = {};
				for (const key in fieldErrors) {
					errorMap[key as keyof ClassFormData] = fieldErrors[key]?.[0] ?? "";
				}
				return errorMap;
			}
			return {};
		});
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Name *</label>
		<input
			id="name"
			type="text"
			name="name"
			placeholder="Class name"
			class={`w-full ${$formErrors.name && ($touched.name || $submitAttempted) ? "input-error" : ""}`}
			bind:value={formData.name}
			oninput={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
			onblur={() => touched.update((t) => ({ ...t, name: true }))}
		/>
		{#if $formErrors.name && ($touched.name || $submitAttempted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Sections *</label>
		<div class="checkbox-section" class:has-error={$formErrors.sectionIds && $submitAttempted}>
			{#each allSections?.data as section}
				<div class="checkbox-item">
					<label class="checkbox-label">
						<input
							type="checkbox"
							class="checkbox-input"
							value={section._id}
							checked={formData.sectionIds.includes(section._id)}
							onchange={(e) => {
								const checked = (e.target as HTMLInputElement).checked;
								if (checked) {
									formData.sectionIds = [...formData.sectionIds, section._id];
								} else {
									formData.sectionIds = formData.sectionIds.filter((id) => id !== section._id);
								}
								handleChange("sectionIds", formData.sectionIds);
							}}
							onblur={() => handleChange("sectionIds", formData.sectionIds)}
						/>
						<span class="checkbox-custom"></span>
						<span class="checkbox-text">{section.name}</span>
					</label>
				</div>
			{/each}
		</div>
		{#if $formErrors.sectionIds && ($submitAttempted || $touched.sectionIds)}
			<p class="error-text">{$formErrors.sectionIds}</p>
		{/if}
	</div>

	<div class="flex-items-center" style="justify-content:end;">
		<button class="btn ripple" type="reset" disabled={$isLoading} style="background-color: var(--clr-pri-light); align-self: right;"> Clear </button>
		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update{:else}Save{/if}
		</button>
	</div>
</form>

<style>
	.checkbox-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
		max-height: 300px;
		overflow-y: auto;
	}

	.checkbox-item {
		display: flex;
		align-items: center;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		cursor: pointer;
		gap: 8px;
		font-size: 14px;
		color: #333;
		transition: all 0.2s ease;
	}

	.checkbox-label:hover {
		color: #0066cc;
	}

	.checkbox-input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkbox-custom {
		position: relative;
		height: 18px;
		width: 18px;
		background-color: #fff;
		border: 2px solid #ddd;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.checkbox-input:checked ~ .checkbox-custom {
		background-color: #0066cc;
		border-color: #0066cc;
	}

	.checkbox-input:checked ~ .checkbox-custom::after {
		content: "";
		position: absolute;
		left: 5px;
		top: 1px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.checkbox-text {
		margin-left: 4px;
	}
	/* Add this to your existing styles */
	.has-error {
		/* border: 1px solid #ff4444; */
		padding: 15px;
		border-radius: 4px;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
	}

	.error-text {
		color: #ff4444;
		font-size: 0.8rem;
		margin-top: 4px;     
	}
</style>
