<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let type: string = 'bar'; // bar, line, pie, etc.
	export let data: any;
	export let options: any;

	let canvas: HTMLCanvasElement;
	let chart: Chart;

    options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Income June 2025',
          font: {
            size: 18
          }
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      
    };

	onMount(() => {
		if (canvas) {
			chart = new Chart(canvas, {
				type: 'bar',
				data,
				options,
			});
		}

		return () => chart?.destroy();
	});
</script>

<canvas bind:this={canvas} class="w-full max-w-full h-[400px]"></canvas>
