<script lang="ts">
	export let levelFilter: string;
	export let academicYearFilter: string;
	import { Search, Download, Plus } from "@lucide/svelte";
</script>

<div class="filters">
	<div class="filter-group">
		<label for="academicYear">ACADEMIC YEAR</label>
		<select bind:value={academicYearFilter} id="academicYear">
			<option value="2024-2025">2024-2025</option>
			<option value="2022-2023">2022-2023</option>
			<option value="2023-2024">2023-2024</option>
		</select>
	</div>
	<div class="filter-group">
		<label for="name">NAME</label>
		<input type="text" />
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple">
			<Search size={16} />
			<span>Search</span>
		</button>

		<button type="button" class="btn ripple">
			<Download size={16} />
			<span>Download</span>
		</button>

		<button type="button" class="btn ripple">
			<Plus size={16} />
			<span>Add Class</span>
		</button>
	</div>
</div>

<style>
	.filters {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 0.5rem;
		padding: 0.1rem;
		border-radius: 8px;
		width: 100%;
		gap: 3rem;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 6px;
		transition: transform 0.2s ease;
	}

	label {
		font-weight: 600;
		color: #2d3748; /* Darker, professional color */
		font-size: 0.9rem;
		text-transform: uppercase;
	}

	select,
	input[type="text"] {
		padding: 0.5rem;
		border: 1px solid #d1d5db; /* Grayed-out border */
		border-radius: 6px;
		background-color: #f8f8f8; /* Slightly grayed background */
		color: #4b5563; /* Muted text color */
		font-size: 0.9rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	select:focus,
	input[type="text"]:focus {
		outline: none;
		border-color: #3b82f6; /* Vibrant blue on focus */
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); /* Professional focus ring */
	}

	button {
		padding: 0.5rem 1.5rem;
		background: linear-gradient(
			135deg,
			#3b82f6 0%,
			#2563eb 100%
		); /* Vibrant button gradient */
		color: white;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background 0.2s ease,
			transform 0.2s ease;
		margin-left: auto;
	}

	button:hover {
		background: linear-gradient(
			0deg,
			#2563eb 0%,
			#1e40af 100%
		); /* Darker on hover */
	}

     .action-buttons {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }


    .ripple {
    position: relative;
    overflow: hidden;
  }

  .ripple:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  .ripple:focus:not(:active)::after {
    animation: ripple 0.6s ease-out;
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background-color: #4a6cf7;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .btn:hover {
    background-color: #3a5ce4;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  .btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  }
  
  /* Individual button colors */
  .btn:nth-child(2) {
    background-color: #10b981;
  }
  
  .btn:nth-child(2):hover {
    background-color: #0eaa74;
  }
  
  .btn:nth-child(3) {
    background-color: #f59e0b;
  }
  
  .btn:nth-child(3):hover {
    background-color: #e69009;
  }
</style>
