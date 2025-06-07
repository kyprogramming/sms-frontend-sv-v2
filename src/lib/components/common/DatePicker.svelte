<script lang="ts">
	import { run } from "svelte/legacy";

	import { formatDateToLocalYYYYMMDD } from "$lib/utils/utils";


	interface Props {
		id?: string;
		value?: Date | string | null;
		onChange?: (date: Date | null) => void;
		onClear?: (date: Date | null) => void;
		defaultToday?: boolean;
		cls?: string;
	}

	let { id = "", value = $bindable(null), onChange = () => {}, onClear = () => {}, defaultToday = false, cls = "" }: Props = $props();

	let showCalendar = $state(false);
	let selectedDate: Date | null = $state(value instanceof Date ? value : value ? new Date(value) : null);
	let calendarRef: HTMLDivElement | undefined = $state();

	const today = new Date();
	let currentMonth = $derived(selectedDate ? selectedDate.getMonth() : today.getMonth());
	let currentYear = $derived(selectedDate ? selectedDate.getFullYear() : today.getFullYear());

	// Helper function to safely parse dates
	function safeDateParse(date: Date | string | null): Date | null {
		if (!date) return null;
		if (date instanceof Date) return date;
		const parsed = new Date(date);
		return isNaN(parsed.getTime()) ? null : parsed;
	}

	run(() => {
		if (value === null && selectedDate !== null) {
			selectedDate = null;
			onClear(null);
		}
	});

	// Month and year dropdown options
	const months = Array.from({ length: 12 }, (_, i) => ({
		value: i,
		name: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
	}));

	const years = Array.from({ length: 27 }, (_, i) => today.getFullYear() - 25 + i);

	function toggleCalendar() {
		showCalendar = !showCalendar;
		if (showCalendar) {
			if (selectedDate) {
				currentMonth = selectedDate.getMonth();
				currentYear = selectedDate.getFullYear();
			} else {
				const parsedValue = safeDateParse(value);
				if (parsedValue) {
					currentMonth = parsedValue.getMonth();
					currentYear = parsedValue.getFullYear();
				}
			}
		}
	}

	function selectDate(date: Date) {
		selectedDate = date;
		value = formatDateToLocalYYYYMMDD(date); // This will update the bound value
		onChange(date);
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

	function changeMonth(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target) {
			currentMonth = parseInt(target.value);
		}
	}

	function changeYear(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target) {
			currentYear = parseInt(target.value);
		}
	}

	function handleDayClick(day: number, e: MouseEvent | KeyboardEvent) {
		if (e.target instanceof HTMLElement) {
			selectDate(new Date(currentYear, currentMonth, day));
		}
	}

	function selectToday() {
		const today = new Date();
		selectDate(today);
		currentMonth = today.getMonth();
		currentYear = today.getFullYear();
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

	let daysInMonth = $derived(getDaysInMonth(currentMonth, currentYear));
	let firstDayOfMonth = $derived(getFirstDayOfMonth(currentMonth, currentYear));

	run(() => {
		if (defaultToday && !value && !selectedDate) {
			selectToday();
		}
	});

	// Sync with external value changes
	run(() => {
		const parsedValue = safeDateParse(value);
		if (parsedValue !== selectedDate) {
			if (parsedValue === null) {
				selectedDate = null;
			} else if (!selectedDate || parsedValue.getTime() !== selectedDate.getTime()) {
				selectedDate = parsedValue;
				currentMonth = parsedValue.getMonth();
				currentYear = parsedValue.getFullYear();
			}
		}
	});
</script>

<div class="datepicker-wrapper" bind:this={calendarRef} use:clickOutside={() => (showCalendar = false)}>
	<div class="input-container">
		<input {id} type="text" readonly onclick={toggleCalendar} value={formatDate(selectedDate)} class={cls} placeholder="Select date" />
		<button class="calendar-icon" type="button" onclick={toggleCalendar}  aria-label="Toggle calendar">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
					<div class="month-year-selectors">
						<select class="month-selector" value={currentMonth} onchange={changeMonth}>
							{#each months as month}
								<option value={month.value}>{month.name}</option>
							{/each}
						</select>
						<select class="year-selector" value={currentYear} onchange={changeYear}>
							{#each years as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="calendar-weekdays">
					{#each ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as day}
						<div class="weekday">{day}</div>
					{/each}
				</div>

				<div class="calendar-grid">
					<!-- Empty cells for days before the first day of the month -->
					{#each Array(firstDayOfMonth) as _, i}
						<div class="calendar-day empty"></div>
					{/each}

					<!-- Days of the month -->
					{#each Array(daysInMonth) as _, i}
						<div
							role="button"
							tabindex="0"
							class="calendar-day {selectedDate?.getDate() === i + 1 && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear ? 'selected' : ''}"
							onclick={(e) => handleDayClick(i + 1, e)}
							onkeydown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleDayClick(i + 1, e);
								}
							}}
						>
							{i + 1}
						</div>
					{/each}
				</div>

				<div class="calendar-footer">
					<button
						class="today-button"
						onclick={(e) => {
							e.preventDefault();
							selectToday();
						}}
					>
						Today
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.datepicker-wrapper {
		position: relative;
		width: 100%;
		font-family: sans-serif;
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-container input {
		width: 100%;
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.875rem;
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
		justify-content: center;
		margin-bottom: 1rem;
	}

	.month-year-selectors {
		display: flex;
		gap: 0.5rem;
	}

	.month-selector,
	.year-selector {
		padding: 0.25rem 0.5rem;
		border: 1px solid #ddd;
		width: 120px;
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.calendar-weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.weekday {
		text-align: center;
		font-size: 0.8rem;
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
		font-size: 0.8rem;
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

	.calendar-footer {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}

	.today-button {
		width: 100%;
		background: #f0f0f0;
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 0.8rem;
		transition: background-color 0.2s;
	}

	.today-button:hover {
		background: #e0e0e0;
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
