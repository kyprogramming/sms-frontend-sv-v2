<script lang="ts">
	import { slide } from "svelte/transition";

	// Types
	type DatePickerView = "day" | "month" | "year";
	type DateSelection = Date | null;

	interface Props {
		id?: string;
		title?: string;
        value?: Date | string | null;
		defaultValue?: Date | null;
		selectedDate?: DateSelection;
		onDateSelect?: (date: Date) => void;
        onBlur?: () => void;
        onClear?: (date: Date | null) => void;
        cls?: string;
	}

	// Props with defaults
	let {
		id = "",
		title = "",
        value = $bindable(null),
		defaultValue = null,
		selectedDate = defaultValue,
        onBlur = () => {},
		onDateSelect = (() => {}) as (date: Date) => void,
        onClear = () => {},
        cls = ""
	}:Props = $props();

	// State
	let isOpen = $state(false);
	let showError = $state(false);
	let inputWidth = $state("100%");
	let inputRef: HTMLInputElement | null = $state(null);
	let calendarRef = $state<HTMLDivElement>();

	// Reactive state
	let currentView = $state<DatePickerView>("day");
	let currentDate = $state<Date>(selectedDate || new Date());
	let currentYear = $state<number>((selectedDate || new Date()).getFullYear());
	let currentMonth = $state<number>((selectedDate || new Date()).getMonth());

	// Constants
	const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// Helper functions
	function getDaysInMonth(year: number, month: number): number {
		return new Date(year, month + 1, 0).getDate();
	}

	function getFirstDayOfMonth(year: number, month: number): number {
		return new Date(year, month, 1).getDay();
	}

	function generateMonthDays(year: number, month: number): (number | null)[][] {
		const daysInMonth = getDaysInMonth(year, month);
		const firstDay = getFirstDayOfMonth(year, month);
		const weeks: (number | null)[][] = [];
		let week: (number | null)[] = [];

		// Fill initial empty days
		for (let i = 0; i < firstDay; i++) {
			week.push(null);
		}

		// Add days of month
		for (let day = 1; day <= daysInMonth; day++) {
			week.push(day);
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}

		// Only add a final partial week if needed
		if (week.length > 0) {
			weeks.push(week);
		}

		return weeks;
	}

	function generateYears(startYear: number): number[][] {
		const years: number[][] = [];
		let row: number[] = [];

		for (let year = startYear - 1; year <= startYear + 10; year++) {
			row.push(year);
			if (row.length === 4) {
				years.push(row);
				row = [];
			}
		}

		return years;
	}

	// Navigation functions
	function prevMonth() {
		currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		if (currentMonth === 11) {
			currentYear -= 1;
		}
	}

	function nextMonth() {
		currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
		if (currentMonth === 0) {
			currentYear += 1;
		}
	}

    function selectDay(day: number) {
        const date = new Date(currentYear, currentMonth, day);
        selectedDate = date;
        value = date; // Make sure to update the bound value
        onDateSelect(date);
        isOpen = false;
        showError = false;
        onBlur(); // Trigger blur handler to validate
    }


	function selectMonth(month: number) {
		currentMonth = month;
		currentView = "day";
	}

	function selectYear(year: number) {
		currentYear = year;
		currentView = "month";
	}

	function navigateToMonthView() {
		currentView = "month";
	}

	function navigateToYearView() {
		currentView = "year";
	}

	function toggleDatePicker() {
		isOpen = !isOpen;
		if (isOpen && inputRef) {
			inputWidth = `${inputRef.offsetWidth}px`;
			if (selectedDate) {
				currentYear = selectedDate.getFullYear();
				currentMonth = selectedDate.getMonth();
			}
			currentView = "day";
		}
	}

	function formatDate(date: Date | null): string {
		if (!date) return "";
		const day = date.getDate();
		const month = MONTHS[date.getMonth()];
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}

	// Quick selection functions
	function selectToday() {
		const today = new Date();
		selectedDate = today;
        value = today; // Update bound value
		currentYear = today.getFullYear();
		currentMonth = today.getMonth();
		onDateSelect(today);
		isOpen = false;
		showError = false;
        onBlur(); // Trigger validation
	}

	function selectYesterday() {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		selectedDate = yesterday;
		value = yesterday;
		currentYear = yesterday.getFullYear();
		currentMonth = yesterday.getMonth();
		onDateSelect(yesterday);
		isOpen = false;
		showError = false;
        onBlur(); // Trigger validation
	}

	function selectTomorrow() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		selectedDate = tomorrow;
		value = tomorrow;
		currentYear = tomorrow.getFullYear();
		currentMonth = tomorrow.getMonth();
		onDateSelect(tomorrow);
		isOpen = false;
		showError = false;
        onBlur(); // Trigger validation
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
</script>

<div class="date-picker-container" use:clickOutside={() => (isOpen = false)} >
	<div class="input-container">
		<input {id} type="text" readonly bind:this={inputRef} value={formatDate(selectedDate)} onclick={toggleDatePicker} onblur={onBlur}  class={cls} placeholder={title ? `Select ${title}` : "Select date"} aria-label={title ? `${title} date picker` : "Date picker"} />
		<button class="calendar-button" onclick={toggleDatePicker} aria-label="Open calendar">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
				<line x1="16" y1="2" x2="16" y2="6"></line>
				<line x1="8" y1="2" x2="8" y2="6"></line>
				<line x1="3" y1="10" x2="21" y2="10"></line>
			</svg>
		</button>
	</div>

	{#if isOpen}
		<div class="date-picker-popup" style="width: {inputWidth}" transition:slide={{ duration: 70 }} bind:this={calendarRef}>
			<div class="date-picker">
				{#if currentView === "day"}
					<div class="header-date">
						<button onclick={prevMonth}>‹</button>
						<div>
							<span onclick={navigateToMonthView}>{MONTHS[currentMonth]}</span>
							<span onclick={navigateToYearView}>{currentYear}</span>
						</div>
						<button onclick={nextMonth}>›</button>
					</div>

					<div class="day-names">
						{#each DAYS as day}
							<div>{day}</div>
						{/each}
					</div>

					<div class="calendar-container">
						<div class="days-grid">
							{#each generateMonthDays(currentYear, currentMonth) as week}
								<div class="week">
									{#each week as day}
										<button class:current-month={day !== null} class:selected={day !== null && selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear} onclick={() => day !== null && selectDay(day)}>
											{day}
										</button>
									{/each}
								</div>
							{/each}
						</div>
						<div class="quick-selection">
							<button onclick={selectYesterday}>Yesterday</button>
							<button onclick={selectToday}>Today</button>
							<button onclick={selectTomorrow}>Tomorrow</button>
						</div>
					</div>
				{:else if currentView === "month"}
					<div class="header-date">
						<button onclick={() => (currentYear -= 1)}>‹</button>
						<span onclick={navigateToYearView}>{currentYear}</span>
						<button onclick={() => (currentYear += 1)}>›</button>
					</div>

					<div class="months-grid">
						{#each MONTHS as month, i}
							<button class:selected={selectedDate?.getMonth() === i && selectedDate?.getFullYear() === currentYear} onclick={() => selectMonth(i)}>
								{month}
							</button>
						{/each}
					</div>
				{:else if currentView === "year"}
					<div class="header-date">
						<button onclick={() => (currentYear -= 12)}>‹</button>
						<span>{Math.floor(currentYear / 10) * 10 - 1}-{Math.floor(currentYear / 10) * 10 + 10}</span>
						<button onclick={() => (currentYear += 12)}>›</button>
					</div>

					<div class="years-grid">
						{#each generateYears(Math.floor(currentYear / 10) * 10) as row}
							<div class="year-row">
								{#each row as year}
									<button class:selected={selectedDate?.getFullYear() === year} onclick={() => selectYear(year)}>
										{year}
									</button>
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.date-picker-container {
		position: relative;
		width: 100%;
		min-width: 300px;
		font-family: Arial, sans-serif;
	}

	.calendar-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
  
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		width: 100%;
		padding: 10px 40px 10px 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		cursor: pointer;
	}

	input.error {
		border-color: #ff4444;
	}

	.calendar-button {
		position: absolute;
		right: 8px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		padding: 4px;
		color: #666;
	}

	.error-message {
		color: #ff4444;
		font-size: 12px;
		margin-top: 4px;
	}

	.date-picker-popup {
		position: absolute;
		z-index: 1000;
		margin-top: 2px;
	}

	.date-picker {
		background: white;
		border-radius: 8px;
        border: 1px solid #ddd;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		padding: 12px;
		padding-top: 0;
		width: 100%;
	}

	.header-date {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		margin-bottom: 12px;
	}

	.header-date > div {
		display: flex;
		gap: 8px;
	}

	.header-date span {
		cursor: pointer;
		font-weight: bold;
		margin-right: 10px;
	}

	.header-date button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		padding: 4px 8px;
	}

	.day-names {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		font-weight: bold;
		font-size: 12px;
		margin-bottom: 8px;
	}

	.days-grid {
		display: grid;
		grid-template-rows: repeat(4, 1fr);
		gap: 4px;
	}

	.week {
		display: grid;
		grid-template-columns: repeat(7, 0.5fr);
		gap: 2px;
	}

	.days-grid button {
		/* aspect-ratio: 1; */
		border: none;
		border-radius: 4px;
		cursor: pointer;
		background: none;
        padding: 10px;
	}

	.days-grid button.current-month {
		background: white;
	}

	.days-grid button:not(.current-month) {
		color: #ccc;
	}

	.days-grid button:hover {
		background: #f0f0f0;
	}

	.days-grid button.selected {
		background: #3b82f6;
		color: white;
	}

	.months-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}

	.months-grid button {
		padding: 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		background: white;
	}

	.months-grid button:hover {
		background: #f0f0f0;
	}

	.months-grid button.selected {
		background: #3b82f6;
		color: white;
	}

	.years-grid {
		display: grid;
		grid-template-rows: repeat(3, 1fr);
		gap: 8px;
	}

	.year-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}

	.years-grid button {
		padding: 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		background: white;
	}

	.years-grid button:hover {
		background: #f0f0f0;
	}

	.years-grid button.selected {
		background: #3b82f6;
		color: white;
	}

	.quick-selection {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-top: 8px;
	}

	.quick-selection button {
		flex: 1;
		padding: 6px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		font-size: 12px;
		aspect-ratio: 0;
	}

	.quick-selection button:hover {
		background: #f0f0f0;
	}
</style>
