<script lang="ts">
	import { writable } from "svelte/store";
	import { fade } from "svelte/transition";

	// Types
	type DatePickerView = "day" | "month" | "year";
	type DateSelection = Date | null;

	// Props
	export let id = "";
	export let title = "";
	export let required = false;
	export let errorMessage = "This field is required";
	export let defaultValue: Date | null = null;
	export let selectedDate: DateSelection = defaultValue;
	export let onDateSelect: (date: Date) => void = () => {};

	// State
	let isOpen = false;
	let showError = false;
	let inputWidth = "100%";
	let inputRef: HTMLInputElement;
	let currentView = writable<DatePickerView>("day");
	let currentDate = writable<Date>(selectedDate || new Date());
	let currentYear = writable<number>((selectedDate || new Date()).getFullYear());
	let currentMonth = writable<number>((selectedDate || new Date()).getMonth());

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

		// Fill in days from previous month
		for (let i = firstDay - 1; i >= 0; i--) {
			week.push(null);
		}

		// Current month days
		for (let day = 1; day <= daysInMonth; day++) {
			week.push(day);
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}

		// Fill in days from next month
		while (week.length < 7) {
			week.push(null);
		}
		if (week.length > 0) weeks.push(week);

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
		currentMonth.update((m) => {
			if (m === 0) {
				currentYear.update((y) => y - 1);
				return 11;
			}
			return m - 1;
		});
	}

	function nextMonth() {
		currentMonth.update((m) => {
			if (m === 11) {
				currentYear.update((y) => y + 1);
				return 0;
			}
			return m + 1;
		});
	}

	function selectDay(day: number) {
		const date = new Date($currentYear, $currentMonth, day);
		selectedDate = date;
		onDateSelect(date);
		isOpen = false;
		showError = false;
	}

	function selectMonth(month: number) {
		currentMonth.set(month);
		currentView.set("day");
	}

	function selectYear(year: number) {
		currentYear.set(year);
		currentView.set("month");
	}

	function navigateToMonthView() {
		currentView.set("month");
	}

	function navigateToYearView() {
		currentView.set("year");
	}

	function toggleDatePicker() {
		isOpen = !isOpen;
		if (isOpen) {
			// Set width to match input
			inputWidth = `${inputRef.offsetWidth}px`;

			if (selectedDate) {
				currentYear.set(selectedDate.getFullYear());
				currentMonth.set(selectedDate.getMonth());
			}
			currentView.set("day");
		}
	}

	function handleBlur() {
		if (required && !selectedDate) {
			showError = true;
		} else {
			showError = false;
		}
	}

	function formatDate(date: Date | null): string {
		if (!date) return "";
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}

	// Quick selection functions
	function selectToday() {
		const today = new Date();
		selectedDate = today;
		currentYear.set(today.getFullYear());
		currentMonth.set(today.getMonth());
		onDateSelect(today);
		isOpen = false;
		showError = false;
	}

	function selectYesterday() {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		selectedDate = yesterday;
		currentYear.set(yesterday.getFullYear());
		currentMonth.set(yesterday.getMonth());
		onDateSelect(yesterday);
		isOpen = false;
		showError = false;
	}

	function selectTomorrow() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		selectedDate = tomorrow;
		currentYear.set(tomorrow.getFullYear());
		currentMonth.set(tomorrow.getMonth());
		onDateSelect(tomorrow);
		isOpen = false;
		showError = false;
	}
</script>

<div class="date-picker-container">
	{#if title}
		<label for={id} class="title">{title}</label>
	{/if}

	<div class="input-container">
		<input {id} type="text" readonly bind:this={inputRef} value={formatDate(selectedDate)} on:click={toggleDatePicker} on:blur={handleBlur} class:error={showError} placeholder="Select date" />
		<button class="calendar-button" on:click={toggleDatePicker}>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
				<line x1="16" y1="2" x2="16" y2="6"></line>
				<line x1="8" y1="2" x2="8" y2="6"></line>
				<line x1="3" y1="10" x2="21" y2="10"></line>
			</svg>
		</button>
	</div>

	{#if showError}
		<div class="error-message">{errorMessage}</div>
	{/if}

	{#if isOpen}
		<div class="date-picker-popup" style="width: {inputWidth}" transition:fade={{ duration: 200 }}>
			<div class="date-picker">
				{#if $currentView === "day"}
					<div class="header-date">
						<button on:click={prevMonth}>‹</button>
						<div>
							<span on:click={navigateToMonthView}>{MONTHS[$currentMonth]}</span>
							<span on:click={navigateToYearView}>{$currentYear}</span>
						</div>
						<button on:click={nextMonth}>›</button>
					</div>

					<div class="day-names">
						{#each DAYS as day}
							<div>{day}</div>
						{/each}
					</div>

					<div class="days-grid">
						{#each generateMonthDays($currentYear, $currentMonth) as week}
							<div class="week">
								{#each week as day}
									<button class:current-month={day !== null} class:selected={day !== null && selectedDate?.getDate() === day && selectedDate?.getMonth() === $currentMonth && selectedDate?.getFullYear() === $currentYear} on:click={() => day !== null && selectDay(day)}>
										{day}
									</button>
								{/each}
							</div>
						{/each}
						<!-- Quick selection buttons -->
						<div class="quick-selection">
							<button on:click={selectYesterday}>Yesterday</button>
							<button on:click={selectToday}>Today</button>
							<button on:click={selectTomorrow}>Tomorrow</button>
						</div>
					</div>
				{:else if $currentView === "month"}
					<div class="header-date">
						<button on:click={() => currentYear.update((y) => y - 1)}>‹</button>
						<span on:click={navigateToYearView}>{$currentYear}</span>
						<button on:click={() => currentYear.update((y) => y + 1)}>›</button>
					</div>

					<div class="months-grid">
						{#each MONTHS as month, i}
							<button class:selected={selectedDate?.getMonth() === i && selectedDate?.getFullYear() === $currentYear} on:click={() => selectMonth(i)}>
								{month}
							</button>
						{/each}
					</div>
				{:else if $currentView === "year"}
					<div class="header-date">
						<button on:click={() => currentYear.update((y) => y - 12)}>‹</button>
						<span>{Math.floor($currentYear / 10) * 10 - 1}-{Math.floor($currentYear / 10) * 10 + 10}</span>
						<button on:click={() => currentYear.update((y) => y + 12)}>›</button>
					</div>

					<div class="years-grid">
						{#each generateYears(Math.floor($currentYear / 10) * 10) as row}
							<div class="year-row">
								{#each row as year}
									<button class:selected={selectedDate?.getFullYear() === year} on:click={() => selectYear(year)}>
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
		max-width: 300px;
		font-family: Arial, sans-serif;
		margin-bottom: 16px;
	}

	.title {
		display: block;
		margin-bottom: 8px;
		font-weight: bold;
		font-size: 14px;
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
		margin-top: 4px;
	}

	.date-picker {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		padding: 12px;
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
		grid-template-rows: repeat(6, 1fr);
		gap: 4px;
	}

	.week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 4px;
	}

	.days-grid button {
		aspect-ratio: 1;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		background: none;
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
		padding: 8px;
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
		padding: 8px;
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
		margin-top: 8px;
		gap: 8px;
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
