<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	// Types
	type DatePickerView = 'day' | 'month' | 'year';

	interface Props {
		id?: string;
		title?: string;
		value?: string | null;
		defaultToday?: boolean;
		onDateSelect?: (dateString: string) => void;
		onBlur?: (isOpen: boolean) => void;
		cls?: string;
	}

	let { id = '', title = '', value = $bindable(null), onBlur, onDateSelect, defaultToday = false, cls = '' }: Props = $props();

	// State
	let isOpen = $state(false);
	let inputWidth = $state('100%');
	let inputRef: HTMLInputElement | null = $state(null);
	let calendarRef = $state<HTMLDivElement>();

	// Convert value to Date for internal use
	let dateValue = $derived(toDate(value));

	// Reactive state using the converted dateValue
	let currentView = $state<DatePickerView>('day');
	let currentYear = $derived(dateValue?.getFullYear() ?? new Date().getFullYear());
	let currentMonth = $derived(dateValue?.getMonth() ?? new Date().getMonth());

	// Constants
	const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	onMount(() => {
		if (defaultToday && !value) {
			selectToday();
		}
	});

	// Helper functions
	function toDate(dateString: string | null): Date | null {
		if (!dateString) return null;
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date;
	}

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

	function formatDate(date: Date | string | null): string {
		if (!date) return '';
		// If date is a string, convert to Date object first
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		// Handle invalid dates
		if (isNaN(dateObj.getTime())) return '';
		const day = dateObj.getDate();
		const month = MONTHS[dateObj.getMonth()];
		const year = dateObj.getFullYear();
		return `${day} ${month} ${year}`;
	}

	function formatDateForStorage(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// Navigation functions
	function prevMonth(event: MouseEvent) {
		currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		if (currentMonth === 11) {
			currentYear -= 1;
		}
	}

	function nextMonth(event: MouseEvent) {
		currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
		if (currentMonth === 0) {
			currentYear += 1;
		}
	}

	function selectMonth(month: number) {
		currentMonth = month;
		currentView = 'day';
	}

	function selectYear(year: number) {
		currentYear = year;
		currentView = 'month';
	}

	function navigateToMonthView() {
		currentView = 'month';
	}

	function navigateToYearView() {
		currentView = 'year';
	}

	// Update selection functions similarly
	function selectDay(day: number, event: MouseEvent) {
		const date = new Date(currentYear, currentMonth, day);
		const dateString = formatDateForStorage(date); // Use local date formatting
		value = dateString;
		onDateSelect?.(dateString);
		isOpen = false;
		onBlur?.(isOpen);
	}

	function selectToday() {
		const today = new Date();
		const dateString = formatDateForStorage(today);
		value = dateString;
		onDateSelect?.(dateString);
		currentYear = today.getFullYear();
		currentMonth = today.getMonth();
		isOpen = false;
	}

	function selectYesterday() {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const dateString = formatDateForStorage(yesterday);
		value = dateString;
		currentYear = yesterday.getFullYear();
		currentMonth = yesterday.getMonth();
		onDateSelect?.(dateString);
		isOpen = false;
	}

	function selectTomorrow() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const dateString = formatDateForStorage(tomorrow);
		value = dateString;
		currentYear = tomorrow.getFullYear();
		currentMonth = tomorrow.getMonth();
		onDateSelect?.(dateString);
		isOpen = false;
		onBlur?.(isOpen);
	}

	// Update toggle date picker

	function toggleDatePicker() {
		isOpen = !isOpen;
		if (isOpen && inputRef) {
			inputWidth = `${inputRef.offsetWidth}px`;
			if (value) {
				// Convert string to Date if needed
				const dateValue = typeof value === 'string' ? new Date(value) : value;
				// Check if valid date
				if (!isNaN(dateValue.getTime())) {
					currentYear = dateValue.getFullYear();
					currentMonth = dateValue.getMonth();
				}
			}
			currentView = 'day';
		}
	}

	// Handler action for click outside
	function handleMonthKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			navigateToMonthView();
		}
	}

	function handleYearKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			navigateToYearView();
		}
	}

	function handleClickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				if (isOpen) {
					callback();
					// Trigger validation when picker closes
					onBlur?.(isOpen);
				}
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			},
		};
	}
</script>

<div class="date-picker-container" bind:this={calendarRef} use:handleClickOutside={() => (isOpen = false)}>
	<div class="input-container">
		<input
			{id}
			type="text"
			readonly
			bind:this={inputRef}
			value={formatDate(value)}
			onclick={toggleDatePicker}
			onblur={() => {
				onBlur?.(isOpen);
			}}
			class={cls}
			placeholder={title ? `Select ${title}` : 'Select date'}
			aria-label={title ? `${title} date picker` : 'Date picker'}
		/>
		<button type="button" class="calendar-button" onclick={toggleDatePicker} aria-label="Open calendar">
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
				{#if currentView === 'day'}
					<div class="header-date">
						<button type="button" class="navigate" onclick={prevMonth}>‹</button>
						<div>
							<!-- <span onclick={navigateToMonthView}>{MONTHS[currentMonth]}</span>
							<span onclick={navigateToYearView}>{currentYear}</span> -->
							<button type="button" class="date-navigation-button" onclick={navigateToMonthView} onkeydown={handleMonthKeyDown} aria-label={`Change month view, current month: ${MONTHS[currentMonth]}`}>
								{MONTHS[currentMonth]}
							</button>

							<button type="button" class="date-navigation-button" onclick={navigateToYearView} onkeydown={handleYearKeyDown} aria-label={`Change year view, current year: ${currentYear}`}>
								{currentYear}
							</button>
						</div>
						<button type="button" class="navigate" onclick={nextMonth}>›</button>
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
										<button type="button" class:current-month={day !== null} class:selected={day !== null && dateValue?.getDate() === day && dateValue?.getMonth() === currentMonth && dateValue?.getFullYear() === currentYear} onclick={(e) => day !== null && selectDay(day, e)}>
											{day}
										</button>
									{/each}
								</div>
							{/each}
						</div>
						<div class="quick-selection">
							<button type="button" onclick={selectYesterday}>Yesterday</button>
							<button type="button" onclick={selectToday}>Today</button>
							<button type="button" onclick={selectTomorrow}>Tomorrow</button>
						</div>
					</div>
				{:else if currentView === 'month'}
					<div class="header-date">
						<button type="button" onclick={() => (currentYear -= 1)}>‹</button>
						<button type="button" class="date-navigation-button" onclick={navigateToYearView} onkeydown={handleYearKeyDown} aria-label={`Change year view, current year: ${currentYear}`}>
							{currentYear}
						</button>
						<button type="button" onclick={() => (currentYear += 1)}>›</button>
					</div>

					<div class="months-grid">
						{#each MONTHS as month, i}
							<button type="button" class:selected={dateValue?.getMonth() === i && dateValue?.getFullYear() === currentYear} onclick={() => selectMonth(i)}>
								{month}
							</button>
						{/each}
					</div>
				{:else if currentView === 'year'}
					<div class="header-date">
						<button type="button" onclick={() => (currentYear -= 12)}>‹</button>
						<span>{Math.floor(currentYear / 10) * 10 - 1}-{Math.floor(currentYear / 10) * 10 + 10}</span>
						<button type="button" onclick={() => (currentYear += 12)}>›</button>
					</div>

					<div class="years-grid">
						{#each generateYears(Math.floor(currentYear / 10) * 10) as row}
							<div class="year-row">
								{#each row as year}
									<button type="button" class:selected={dateValue?.getFullYear() === year} onclick={(e) => selectYear(year)}>
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

<!-- Your existing styles remain exactly the same -->
<!-- prettier-ignore -->
<style>
	.date-picker-container { position: relative; width: 100%; /* min-width: 300px; */ font-family: Arial, sans-serif; }
	.calendar-container { display: flex; flex-direction: column; gap: 8px; }
	.input-container { position: relative; display: flex; align-items: center; }
	input { width: 100%; padding: 10px 40px 10px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; cursor: pointer; }
	input.error { border-color: #ff4444; }
	.calendar-button { position: absolute; right: 8px; background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px; color: #666; }
	.error-message { color: #ff4444; font-size: 12px; margin-top: 4px; }
	.date-picker-popup { position: absolute; z-index: 1000; margin-top: 2px; }
	.date-picker { background: white; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 12px; padding-top: 0; width: 100%; }
	.header-date { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; margin-bottom: 6px; }
	.header-date > div { display: flex; /* gap: px; */ }
	.header-date span { cursor: pointer; font-weight: bold; /* margin-right: 10px; */ }
	.header-date button { background: none; border: none; cursor: pointer; font-size: 16px; padding: 0px 10px; }
	.header-date button.navigate { border: none; cursor: pointer; font-size: 25px; border-radius: 8px; }
	.header-date button.navigate:hover { background-color: #f0f0f0; outline: none; }
	.day-names { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; font-size: 12px; margin-bottom: 8px; }
	.days-grid { display: grid; grid-template-rows: repeat(4, 1fr); gap: 4px; }
	.week { display: grid; grid-template-columns: repeat(7, 0.5fr); gap: 1px; }
	.days-grid button { /* aspect-ratio: 1; */ border: none; border-radius: 4px; cursor: pointer; background: none; padding: 6px; }
	.days-grid button.current-month { background: white; }
	.days-grid button:not(.current-month) { color: #ccc; }
	.days-grid button:hover { background: #f0f0f0; }
	.days-grid button.selected { background: #3b82f6; color: white; }
	.months-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
	.months-grid button { padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; background: white; }
	.months-grid button:hover { background: #f0f0f0; }
	.months-grid button.selected { background: #3b82f6; color: white; }
	.years-grid { display: grid; grid-template-rows: repeat(3, 1fr); gap: 8px; }
	.year-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
	.years-grid button { padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; background: white; }
	.years-grid button:hover { background: #f0f0f0; }
	.years-grid button.selected { background: #3b82f6; color: white; }
	.quick-selection { display: flex; justify-content: space-between; gap: 8px; margin-top: 8px; }
	.quick-selection button { flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; font-size: 12px; aspect-ratio: 0; }
	.quick-selection button:hover { background: #f0f0f0; }
	.date-navigation-button { background: none; border: none; padding: 6px 0.5rem !important; cursor: pointer; font: inherit; color: inherit; font-size: 14px !important; font-weight: bold; border-radius: 4px; }
	.date-navigation-button:hover,
	.date-navigation-button:focus { background-color: #f0f0f0; outline: none; }
	.date-navigation-button:active { background-color: #e0e0e0; }
</style>
