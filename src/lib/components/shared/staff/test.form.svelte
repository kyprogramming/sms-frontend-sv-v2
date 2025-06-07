<!-- <script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { z } from 'zod';
  
    const dispatch = createEventDispatcher();
  
    const staffFormSchema = z.object({
      staffId: z.string().min(1),
      profile: z.object({
        role: z.string(),
        designation: z.string().optional(),
        department: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().optional(),
        fatherName: z.string().optional(),
        motherName: z.string().optional(),
        email: z.string().email(),
        gender: z.string(),
        dob: z.string(),
        dateOfJoining: z.string().optional(),
        contactNo: z.string().optional(),
        emergencyNo: z.string().optional(),
        maritalStatus: z.string().optional(),
        photoUrl: z.string().url().optional(),
        address: z.string().optional(),
        permanentAddress: z.string().optional(),
        qualification: z.string().optional(),
        workExperience: z.string().optional(),
        note: z.string().optional(),
        panNumber: z.string().min(1),
      }),
      payroll: z.object({
        epfNo: z.string().optional(),
        basicSalary: z.number().nonnegative().optional(),
        contractType: z.enum(['permanent', 'probation']).optional(),
        shift: z.string().optional(),
        workLocation: z.string().optional()
      }),
      leaveAllotments: z.object({
        medicalLeave: z.number().optional(),
        casualLeave: z.number().optional(),
        maternityLeave: z.number().optional(),
        sickLeave: z.number().optional(),
      }).optional(),
      bankDetails: z.object({
        accountTitle: z.string().optional(),
        bankAccountNo: z.string().optional(),
        bankName: z.string().optional(),
        ifscCode: z.string().optional(),
        bankBranch: z.string().optional(),
      }).optional(),
      socialLinks: z.object({
        facebook: z.string().url().optional(),
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
      }).optional()
    });
  
    let formData = {
      staffId: '',
      profile: {
        role: '',
        designation: '',
        department: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        motherName: '',
        email: '',
        gender: '',
        dob: '',
        dateOfJoining: '',
        contactNo: '',
        emergencyNo: '',
        maritalStatus: '',
        photoUrl: '',
        address: '',
        permanentAddress: '',
        qualification: '',
        workExperience: '',
        note: '',
        panNumber: ''
      },
      payroll: {
        epfNo: '',
        basicSalary: 0,
        contractType: 'permanent',
        shift: '',
        workLocation: ''
      },
      leaveAllotments: {},
      bankDetails: {},
      socialLinks: {}
    };
  
    const handleSubmit = () => {
      const result = staffFormSchema.safeParse(formData);
      if (result.success) {
        dispatch('submit', result.data);
      } else {
        console.error(result.error);
      }
    };
  </script>
  
  <form on:submit|preventDefault={handleSubmit}>
    <h2>Staff Profile</h2>
    <input bind:value={formData.staffId} placeholder="Staff ID" required />
    <input bind:value={formData.profile.firstName} placeholder="First Name" required />
    <input bind:value={formData.profile.lastName} placeholder="Last Name" />
    <input bind:value={formData.profile.fatherName} placeholder="Father's Name" />
    <input bind:value={formData.profile.motherName} placeholder="Mother's Name" />
    <input type="email" bind:value={formData.profile.email} placeholder="Email" required />
    <select bind:value={formData.profile.gender} required>
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    <input type="date" bind:value={formData.profile.dob} required />
    <input type="date" bind:value={formData.profile.dateOfJoining} />
    <input bind:value={formData.profile.contactNo} placeholder="Contact No" />
    <input bind:value={formData.profile.emergencyNo} placeholder="Emergency No" />
    <input bind:value={formData.profile.maritalStatus} placeholder="Marital Status" />
    <input bind:value={formData.profile.photoUrl} placeholder="Photo URL" />
    <textarea bind:value={formData.profile.address} placeholder="Address"></textarea>
    <textarea bind:value={formData.profile.permanentAddress} placeholder="Permanent Address"></textarea>
    <input bind:value={formData.profile.qualification} placeholder="Qualification" />
    <input bind:value={formData.profile.workExperience} placeholder="Work Experience" />
    <textarea bind:value={formData.profile.note} placeholder="Note"></textarea>
    <input bind:value={formData.profile.panNumber} placeholder="PAN Number" required />
  
    <h2>Payroll</h2>
    <input bind:value={formData.payroll.epfNo} placeholder="EPF No" />
    <input type="number" bind:value={formData.payroll.basicSalary} placeholder="Basic Salary" min="0" />
    <select bind:value={formData.payroll.contractType}>
      <option value="permanent">Permanent</option>
      <option value="probation">Probation</option>
    </select>
    <input bind:value={formData.payroll.shift} placeholder="Shift" />
    <input bind:value={formData.payroll.workLocation} placeholder="Work Location" />
  
    <h2>Leave Allotments</h2>
    <input type="number" bind:value={formData.leaveAllotments.medicalLeave} placeholder="Medical Leave" />
    <input type="number" bind:value={formData.leaveAllotments.casualLeave} placeholder="Casual Leave" />
    <input type="number" bind:value={formData.leaveAllotments.maternityLeave} placeholder="Maternity Leave" />
    <input type="number" bind:value={formData.leaveAllotments.sickLeave} placeholder="Sick Leave" />
  
    <h2>Bank Details</h2>
    <input bind:value={formData.bankDetails.accountTitle} placeholder="Account Title" />
    <input bind:value={formData.bankDetails.bankAccountNo} placeholder="Bank Account No" />
    <input bind:value={formData.bankDetails.bankName} placeholder="Bank Name" />
    <input bind:value={formData.bankDetails.ifscCode} placeholder="IFSC Code" />
    <input bind:value={formData.bankDetails.bankBranch} placeholder="Bank Branch" />
  
    <h2>Social Links</h2>
    <input bind:value={formData.socialLinks.facebook} placeholder="Facebook" />
    <input bind:value={formData.socialLinks.twitter} placeholder="Twitter" />
    <input bind:value={formData.socialLinks.linkedin} placeholder="LinkedIn" />
    <input bind:value={formData.socialLinks.instagram} placeholder="Instagram" />
  
    <button type="submit">Submit</button>
  </form>
  
  
{#snippet renderInput(fieldName: string, title: string, isRequired = true, type = "text", value: string, onInput: (val: string) => void, length = 100)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<input
		id={fieldName}
		{type}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? "input-error" : ""}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateStaffForm(formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"
	/>

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

{#snippet renderTextarea(fieldName: string, title: string, isRequired = true, value: string, onInput: (val: string) => void, length = 100)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<textarea
		id={fieldName}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? "input-error" : ""}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateStaffForm(formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"
	></textarea>

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

<style>
	/* Base styles */
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	/* Section styles */
	.section {
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		/* overflow: hidden; */
	}

	.section-header {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background-color: var(--clr-bg-2);
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.section-header:hover {
		background-color: var(--clr-bg-3);
	}

	.arrow-icon {
		transition: transform 0.2s ease;
	}

	.section-body {
		padding: 1rem;
		transition: all 0.2s ease;
	}

	.section-body.collapsed {
		display: none;
	}

	/* Grid layout */
	.grid-5 {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
	}

	/* Responsive styles */
	@media (max-width: 1024px) {
		.grid-5 {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.grid-5 {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.grid-5 {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}

	.card-wrapper {
		padding: 15px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: var(--shadow-sm);
		margin-bottom: 10px;
	}

	.radio-group {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
	input[type="radio"] {
		cursor: pointer;
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

	.placeholder-gray {
		color: gray;
	}
</style> -->
