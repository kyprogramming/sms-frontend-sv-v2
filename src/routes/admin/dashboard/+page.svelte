<script lang="ts">
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import Chart from '$lib/components/common/Chart.svelte';
	import FeeExpenseChart from '$lib/components/common/FeeExpenseChart.svelte';
	import { SCHOOL_NAME } from '$lib/utils/constants';

   
	const pageTitle = 'Admin Dashboard';
	const breadcrumbItems = [{ label: 'Dashboard', href: '/admin/dashboard' }];

	const chartData = {
		labels: ['Math', 'Science', 'History', 'English'],
		datasets: [
			{
				label: 'Scores',
				data: [85, 90, 78, 88],
				backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2'],
			},
		],
	};

	const chartOptions: any = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
</script>

<svelte:head>
	<title>{SCHOOL_NAME} - {pageTitle}</title>
</svelte:head>

<Breadcrumb title={pageTitle} items={breadcrumbItems} />
<div class="grid-12" style="margin:30px;">
	<div class="col-6"><FeeExpenseChart /></div>
	<div class="col-6"><Chart type="bar" data={chartData} options={chartOptions} /></div>
</div>
