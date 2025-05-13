<script lang="ts">
	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createSubject, updateSubject } from "$lib/services/subject";
	import { SUBJECT_TYPE } from "$lib/constants";

	// Props
	export let onRefreshPage: () => void;
	export let dataToUpdate: any | null = null;

	// Zod schema
	const subjectSchema = z.object({
		type: z.number().min(1, "Please select a subject type"),
		name: z.string().min(1, "Subject name is required"),
		code: z.string().optional(),
	});

	type SubjectFormData = z.infer<typeof subjectSchema>;

	// Reactive form state
	let formData: SubjectFormData = {
		name: "",
		code: "",
		type: 0,
	};
	let error = "";

	const formErrors = writable<Partial<Record<keyof SubjectFormData, string>>>({});
	const touched = writable<Partial<Record<keyof SubjectFormData, boolean>>>({});
	const submitAttempted = writable(false);

	// Prefill data if editing
	function populateFormData() {
		// console.log("dataToUpdate", dataToUpdate);
		if (dataToUpdate) {
			formData = {
				name: dataToUpdate.name,
				code: dataToUpdate.code || "",
				type: dataToUpdate.type || 0,
			};
			touched.set({ name: true, code: true, type: true });
		}
	}
	$: populateFormData();

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		submitAttempted.set(true);
        // debugger;
		const isValid = await validateForm(subjectSchema, formData, formErrors);
        // alert(isValid);
		if (!isValid) return;

		try {
			if (get(isUpdate) && dataToUpdate) {
				await updateSubject(dataToUpdate._id, formData);
				showSnackbar({ message: "Subject updated successfully", type: "success" });
			} else {
				await createSubject(formData);
				showSnackbar({ message: "Subject created successfully", type: "success" });
			}

			closeModal();
			onRefreshPage();
		} catch (err: unknown) {
			const errMsg = (err as Error)?.message ?? "Failed to save subject";
			error = errMsg;
			console.error(err);
		}
	}

	// Handle field changes
	function handleChange(field: keyof SubjectFormData, value: string | number): void {
		if (field === "name" && typeof value === "string") {
			formData.name = value;
		} else if (field === "code" && typeof value === "string") {
			formData.code = value;
		} else if (field === "type" && typeof value === "number") {
			formData.type = value;
		}

		touched.update((t) => ({ ...t, [field]: true }));

		const result = subjectSchema.safeParse(formData);

		formErrors.update(() => {
			if (!result.success) {
				const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
				const errorMap: Partial<Record<keyof SubjectFormData, string>> = {};
				for (const key in fieldErrors) {
					errorMap[key as keyof SubjectFormData] = fieldErrors[key]?.[0] ?? "";
				}
				return errorMap;
			}
			return {};
		});
	}

    function handleReset() {
	formData = {
		name: "",
		code: "",
		type: 0, // reset to default
	};
	formErrors.set({});
	touched.set({});
	submitAttempted.set(false);
}
</script>

<form on:submit={onSubmit}>
	<div class="input-wrapper">
        
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Subject Type <span class="required">*</span></label>
		<div class="radio-section" class:has-error={$formErrors.type && ($touched.type || $submitAttempted)}>
			{#each SUBJECT_TYPE as type}
				<div class="radio-item">
					<label class="radio-label">
						<input
							name="type"
							type="radio"
							class="radio-input"
							value={type.id}
							checked={formData.type === type.id}
							on:change={() => handleChange("type", type.id)}
							on:blur={() => handleChange("type", formData.type)}
						/>
						<span class="radio-custom"></span>
						<span class="radio-text">{type.name}</span>
					</label>
				</div>
			{/each}
		</div>
		{#if $formErrors.type && ($touched.type || $submitAttempted)}
			<p class="error-text">{$formErrors.type}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="name">Subject Name <span class="required">*</span></label>
		<input
			id="name"
			type="text"
			name="name"
			placeholder="Enter subject name"
			class={`w-full ${$formErrors.name && ($touched.name || $submitAttempted) ? "input-error" : ""}`}
			bind:value={formData.name}
			on:input={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
			on:blur={() => handleChange("name", formData.name)}
		/>
		{#if $formErrors.name && ($touched.name || $submitAttempted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="code">Subject Code</label>
		<input
			id="code"
			type="text"
			name="code"
			class={`w-full`}
			placeholder="Enter subject code"
			bind:value={formData.code}
			on:input={(e) => handleChange("code", (e.target as HTMLInputElement).value)}
			on:blur={() => handleChange("code", String(formData.code))}
		/>
	</div>

	<div class="flex-items-center" style="justify-content:end;">
		<button class="btn ripple" type="reset" disabled={$isLoading} style="background-color: var(--primary-light); align-self: right;" on:click={handleReset}> Clear </button>
		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update{:else}Save{/if}
		</button>
	</div>
</form>

<style>
	/* .input-wrapper {
      margin-bottom: 0.6rem;
    } */

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.required {
		color: red;
	}

	.radio-section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.radio-item {
		display: flex;
		align-items: center;
	}

	.radio-label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.radio-input {
		display: none;
	}

	.radio-custom {
		width: 1rem;
		height: 1rem;
		border: 2px solid #ccc;
		border-radius: 50%;
		margin-right: 0.5rem;
		position: relative;
	}

	.radio-input:checked + .radio-custom::after {
		content: "";
		width: 0.6rem;
		height: 0.6rem;
		background: #007bff;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.has-error .radio-custom {
		border-color: red;
	}

	.error-text {
		color: red;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
