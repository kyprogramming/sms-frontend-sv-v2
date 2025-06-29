<script lang="ts">
	import { page } from '$app/state';

	let activeTab: string = $state('tab1');

	// const student = page.data.studentData?.data.student || null;

	const tabs = [
		{ id: 'tab1', label: 'Profile' },
		{ id: 'tab2', label: 'Fees' },
		{ id: 'tab3', label: 'Exam' },
		{ id: 'tab4', label: 'Attendance' },
		{ id: 'tab5', label: 'Documents' },
		{ id: 'tab6', label: 'Timeline' },
	];

	function selectTab(id: string) {
		activeTab = id;
	}

	let student = {
		name: 'Emmartinses Thomas Kumar Yadav',
		admissionNo: '0202',
		rollNumber: '2150',
		class: 'Class 3 (2025-26)',
		section: 'B',
		gender: 'Female',
		rte: 'No',
		barcode: '0202',
		qrCode: 'sample-qr.png',
		behaviorScore: 10,
		admissionDate: '04/05/2024',
		dob: '07/14/2016',
		category: 'General',
		mobile: '6881016512',
		caste: 'Thomas',
		religion: 'Christen',
		email: 'thomas01@gmail.com',
		medical: '',
		note: '',
		address: '56 Main Street, Suite 3, Brooklyn, NY 11210-0000',
		parentGuardian: {
			name: 'N/A',
		},
	};
</script>

<div class="tab-header">
	{#each tabs as tab}
		<button class="tab-button {activeTab === tab.id ? 'active' : ''}" onclick={() => selectTab(tab.id)}>
			{tab.label}
		</button>
	{/each}
</div>

<div class="tab-panel">
	{#if activeTab === 'tab1'}
		<div>
			<div class="section">
				<h3>Basic Information</h3>
				{@render renderInfo('Admission Date', student.admissionDate)}
				{@render renderInfo('Date of Birth', student.dob)}
				{@render renderInfo('Category', student.category)}
				{@render renderInfo('Mobile Number', student.mobile)}
				{@render renderInfo('Caste', student.caste)}
				{@render renderInfo('Religion', student.religion)}
				{@render renderInfo('Email', student.email)}
				{@render renderInfo('Medical History', student.medical)}
				{@render renderInfo('Note', student.note)}
			</div>
			<div class="section">
				<h3>Address</h3>
				{@render renderInfo('Current Address', student.address)}
				{@render renderInfo('Permanent Address', student.address)}
			</div>

			<div class="section">
				<h3>Parent Guardian Detail</h3>
				{@render renderInfo('Name', student.parentGuardian.name)}
			</div>

			<div class="section">
				<h3>Parent Guardian Detail</h3>
				{@render renderInfo('Name', student.parentGuardian.name)}
			</div>
		</div>
	{:else if activeTab === 'tab2'}
		<p>This is the Fees content.</p>
	{:else if activeTab === 'tab3'}
		<p>This is the Exam content.</p>
	{:else if activeTab === 'tab4'}
		<p>This is the Attendance content.</p>
	{:else if activeTab === 'tab5'}
		<p>This is the Documents content.</p>
	{:else if activeTab === 'tab6'}
		<p>This is the Timeline content.</p>
	{/if}
</div>

{#snippet renderInfo(label: string, value: string)}
	<div class="info-pair">
		<span class="label">{label}</span>
		<span class="colon">:</span>
		<span class="value">{value}</span>
	</div>
{/snippet}

<!-- prettier-ignore -->
<style>
	.tab-header { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 1rem; }
	.tab-button { padding: 0.75rem 1.5rem; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; font-weight: 500; color: #4a5568; }
	.tab-button.active { border-color: #3182ce; color: #2b6cb0; }
	.tab-panel { padding: 2px;  }
    .tabs {
		display: flex;
		gap: 16px;
		border-bottom: 2px solid #f0f0f0;
		margin-bottom: 20px;
	}

	.tab {
		padding: 10px;
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}

	.tab.active {
		border-bottom-color: #ffc107;
		font-weight: bold;
	}

	.section {
		margin-bottom: 20px;
	}

	.section h3 {
		font-size: 16px;
		margin-bottom: 10px;
		border-bottom: 1px solid #eee;
		padding-bottom: 5px;
        color: #696969;
	}

	.row {
		margin: 5px 0;
	}

	.info-pair {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #444;
		padding: 0.5rem 0;
	}

	.icon {
		width: 20px;
		display: inline-block;
		text-align: center;
		margin-right: 6px;
		color: #555;
	}

	.label {
		min-width: 180px;
		font-weight: 500;
        color: #747373;
	}

	.colon {
		margin: 0 15px;
	}

	.value {
		font-weight: 400;
		color: #222;
	}


</style>
