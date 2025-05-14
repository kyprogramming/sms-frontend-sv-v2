<script lang="ts">
	export let value: Date | null = null;
	export let onChange: (date: Date | null) => void = () => {};
    export let defaultToday: boolean = false;

	let showCalendar = false;
	let selectedDate: Date | null = value;
	let calendarRef: HTMLDivElement;

	const today = new Date();
	let currentMonth = today.getMonth();
	let currentYear = today.getFullYear();

	function toggleCalendar() {
		showCalendar = !showCalendar;
	}

	function selectDate(date: Date) {
		selectedDate = date;
		value = date; // Update the bound value
		onChange(date); // Call the onChange callback
		showCalendar = false;
	}

	function formatDate(date: Date | null): string {
		if (!date) return "";
		const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
		return date.toLocaleDateString(undefined, options);
	}

	function getDaysInMonth(month: number, year: number): number {
		return new Date(year, month + 1, 0).getDate();
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function getFirstDayOfMonth(month: number, year: number): number {
		return new Date(year, month, 1).getDay();
	}

	// Action for click outside
	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener("click", handleClick, true);

		return {
			destroy() {
				document.removeEventListener("click", handleClick, true);
			},
		};
	}

	$: daysInMonth = getDaysInMonth(currentMonth, currentYear);
	$: firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    $: if (defaultToday && !value && !selectedDate) {
        selectedDate = new Date();
        currentMonth = selectedDate.getMonth();
        currentYear = selectedDate.getFullYear();
        onChange(selectedDate);
    }

	// Sync with external value changes
	$: if (value && (!selectedDate || value.getTime() !== selectedDate.getTime())) {
		selectedDate = value;
		currentMonth = value.getMonth();
		currentYear = value.getFullYear();
	}
</script>

<div class="datepicker-wrapper" bind:this={calendarRef} use:clickOutside={() => (showCalendar = false)}>
	<div class="input-container">
		<input type="text" readonly on:click={toggleCalendar} value={formatDate(selectedDate)} />
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="calendar-icon" type="button" on:click={toggleCalendar}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
				<line x1="16" y1="2" x2="16" y2="6"></line>
				<line x1="8" y1="2" x2="8" y2="6"></line>
				<line x1="3" y1="10" x2="21" y2="10"></line>
			</svg>
		</button>
	</div>

	{#if showCalendar}
		<div class="calendar-container">
			<div class="calendar">
				<div class="calendar-header">
					<button type="button" on:click={prevMonth}>&lt;</button>
					<strong>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</strong>
					<button type="button" on:click={nextMonth}>&gt;</button>
				</div>

				<div class="calendar-weekdays">
					{#each ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as day}
						<div class="weekday">{day}</div>
					{/each}
				</div>

				<div class="calendar-grid">
					<!-- Empty cells for days before the first of the month -->
					{#each Array(firstDayOfMonth) as _, i}
						<div class="calendar-day empty"></div>
					{/each}

					<!-- Days of the month -->
					{#each Array(daysInMonth) as _, i}
						<div
							class="calendar-day
                  {selectedDate?.getDate() === i + 1 && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear ? 'selected' : ''}
                  {new Date(currentYear, currentMonth, i + 1).toDateString() === today.toDateString() ? 'today' : ''}"
							on:click={() => selectDate(new Date(currentYear, currentMonth, i + 1))}
						>
							{i + 1}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.datepicker-wrapper {
		position: relative;
		width: 100%;
		/* max-width: 300px; */
		font-family: sans-serif;
	}

	/* .datepicker-input{
        width:100%
    } */

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.calendar-icon {
		position: absolute;
		right: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		color: #666;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.calendar-icon:hover {
		color: #333;
	}

	.calendar-icon svg {
		width: 1rem;
		height: 1rem;
	}

	.calendar-container {
		position: relative;
		z-index: 1000;
        min-width: 260px;
	}

	.calendar {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1001;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		margin-top: 0.1rem;
		width: 100%;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		animation: fadeIn 0.2s ease-out;
        min-width: 260px;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.calendar-header strong {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.calendar-header button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.calendar-header button:hover {
		background-color: #f0f0f0;
	}

	.calendar-weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.weekday {
		text-align: center;
		font-size: 0.9rem;
		font-weight: 500;
		color: #666;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
	}

	.calendar-day {
		padding: 0.5rem;
		text-align: center;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
		font-size: 0.9rem;
	}

	.calendar-day.empty {
		visibility: hidden;
	}

	.calendar-day:hover {
		background: #f0f0f0;
	}

	.calendar-day.selected {
		background: #646cff;
		color: #fff;
	}

	.calendar-day.today {
		font-weight: bold;
		color: #646cff;
	}

	.calendar-day.today.selected {
		color: #fff;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
