<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    let canvas: HTMLCanvasElement;
    let chart: Chart;
  
    const labels = Array.from({ length: 30 }, (_, i) =>
      String(i + 1).padStart(2, '0')
    );
  
    const data = {
      labels,
      datasets: [
        {
          label: 'Fees Collected',
          data: [1200, 1800, 3400, 0, 0, 300, 0, 0, 0, 200, 0, 0, 0, 0, 100, 0, 0, 0, 0, 250, 0, 0, 0, 200, 0, 0, 0, 0, 0, 300],
          backgroundColor: 'rgba(144, 238, 144, 0.8)', // light green
          borderRadius: 4,
          barThickness: 10,
        },
        {
          label: 'Expenses',
          data: [0, 100, 0, 0, 0, 300, 0, 0, 0, 0, 200, 0, 0, 0, 0, 100, 0, 0, 0, 300, 0, 0, 0, 200, 0, 0, 0, 0, 0, 400],
          backgroundColor: 'rgba(255, 105, 180, 0.8)', // pink
          borderRadius: 4,
          barThickness: 10,
        }
      ]
    };
  
    const options:any = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Fees Collection & Expenses For June 2025',
          font: {
            size: 18
          }
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 4000,
          ticks: {
            stepSize: 500
          }
        }
      }
    };
  
    onMount(() => {
      chart = new Chart(canvas, {
        type: 'bar',
        data,
        options
      });
  
      return () => chart?.destroy();
    });
  </script>
  
  <canvas bind:this={canvas} class="w-full max-w-full h-[400px]"></canvas>
  