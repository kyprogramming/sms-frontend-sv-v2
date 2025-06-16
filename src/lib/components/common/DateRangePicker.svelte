<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import moment from 'moment'; // Runtime import
	import type { Moment } from 'moment'; // Type-only import

	export let startDate: Moment = moment().startOf('day');
	export let endDate: Moment = moment().endOf('day'); // Make endDate nullable
	export let minDate: Moment | null = null;
	export let maxDate: Moment | null = null;
	export let dateLimit: moment.DurationInputArg1 | false = false;
	export let autoApply = false;
	export let singleDatePicker = false;
	export let showDropdowns = false;
	export let showWeekNumbers = false;
	export let showISOWeekNumbers = false;
	export let showCustomRangeLabel = true;
	export let timePicker = false;
	export let timePicker24Hour = false;
	export let timePickerIncrement = 1;
	export let timePickerSeconds = false;
	export let linkedCalendars = true;
	export let autoUpdateInput = true;
	export let alwaysShowCalendars = false;
	export let opens: 'left' | 'right' | 'center' = 'right';
	export let drops: 'up' | 'down' = 'down';
	export let buttonClasses = 'btn btn-sm';
	export let applyClass = 'btn-success';
	export let cancelClass = 'btn-default';

	export let locale: {
		direction: 'ltr' | 'rtl';
		format: string;
		separator: string;
		applyLabel: string;
		cancelLabel: string;
		weekLabel: string;
		customRangeLabel: string;
		daysOfWeek: string[];
		monthNames: string[];
		firstDay: number;
	} = {
		direction: 'ltr',
		format: moment.localeData().longDateFormat('L'),
		separator: ' - ',
		applyLabel: 'Apply',
		cancelLabel: 'Cancel',
		weekLabel: 'W',
		customRangeLabel: 'Custom Range',
		daysOfWeek: moment.weekdaysMin(),
		monthNames: moment.monthsShort(),
		firstDay: moment.localeData().firstDayOfWeek(),
	};

	// Default ranges built into the component
	export let ranges: Record<string, [Moment, Moment]> = {
		Today: [moment(), moment()],
		Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
	};

	let isShowing = false;
	let container: HTMLDivElement;
	let element: HTMLDivElement;
	let oldStartDate: Moment;
	let oldEndDate: Moment;
	let previousRightTime: Moment;
	let chosenLabel = '';
	let showYearPicker = false;
	let currentYear = moment().year();

	interface Calendar {
		month: Moment;
		calendar?: Moment[][];
	}

	let leftCalendar: Calendar = { month: moment() };
	let rightCalendar: Calendar = { month: moment().add(1, 'month') };

	const months = Array.from({ length: 12 }, (_, i) => ({
		value: i,
		name: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
	}));

	onMount(() => {
		updateMonthsInView();
		updateCalendars();

		document.addEventListener('click', handleOutsideClick);
		document.addEventListener('touchend', handleOutsideClick);
		window.addEventListener('resize', move);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
			document.removeEventListener('touchend', handleOutsideClick);
			window.removeEventListener('resize', move);
		};
	});

	function toggle(): void {
		if (isShowing) {
			hide();
		} else {
			show();
		}
	}

	function show(): void {
		if (isShowing) return;

		oldStartDate = startDate.clone();
		oldEndDate = endDate.clone();
		previousRightTime = endDate.clone();

		updateView();
		isShowing = true;
		move();
	}

	function hide(): void {
		if (!isShowing) return;

		if (!endDate) {
			startDate = oldStartDate.clone();
			endDate = oldEndDate.clone();
		}

		isShowing = false;
	}

	function handleOutsideClick(e: MouseEvent | TouchEvent): void {
		if (!isShowing) return;

		const target = e.target as HTMLElement;
		if (element.contains(target) || container.contains(target) || target.closest('.calendar-table')) return;

		hide();
	}

	function setStartDate(date: string | Moment | Date): void {
		if (typeof date === 'string') {
			startDate = moment(date, locale.format);
		} else {
			startDate = moment(date);
		}

		if (!timePicker) {
			startDate = startDate.startOf('day');
		}

		if (timePicker && timePickerIncrement) {
			startDate.minute(Math.round(startDate.minute() / timePickerIncrement) * timePickerIncrement);
		}

		if (minDate && startDate.isBefore(minDate)) {
			startDate = minDate.clone();
			if (timePicker && timePickerIncrement) {
				startDate.minute(Math.round(startDate.minute() / timePickerIncrement) * timePickerIncrement);
			}
		}

		if (maxDate && startDate.isAfter(maxDate)) {
			startDate = maxDate.clone();
			if (timePicker && timePickerIncrement) {
				startDate.minute(Math.floor(startDate.minute() / timePickerIncrement) * timePickerIncrement);
			}
		}

		updateMonthsInView();
	}

	function setEndDate(date: string | Moment | Date): void {
		if (typeof date === 'string') {
			endDate = moment(date, locale.format);
		} else {
			endDate = moment(date);
		}

		if (!timePicker) {
			endDate = endDate.endOf('day');
		}

		if (timePicker && timePickerIncrement) {
			endDate.minute(Math.round(endDate.minute() / timePickerIncrement) * timePickerIncrement);
		}

		if (endDate.isBefore(startDate)) {
			endDate = startDate.clone();
		}

		if (maxDate && endDate.isAfter(maxDate)) {
			endDate = maxDate.clone();
		}

		if (dateLimit && startDate.clone().add(dateLimit).isBefore(endDate)) {
			endDate = startDate.clone().add(dateLimit);
		}

		previousRightTime = endDate.clone();
		updateMonthsInView();
	}

	function updateView(): void {
		updateMonthsInView();
		updateCalendars();
		updateFormInputs();
	}

	function updateMonthsInView(): void {
		if (endDate) {
			leftCalendar.month = startDate.clone().date(2);
			if (!linkedCalendars && (endDate.month() !== startDate.month() || endDate.year() !== startDate.year())) {
				rightCalendar.month = endDate.clone().date(2);
			} else {
				rightCalendar.month = startDate.clone().date(2).add(1, 'month');
			}
		} else {
			if (leftCalendar.month.format('YYYY-MM') !== startDate.format('YYYY-MM') && rightCalendar.month.format('YYYY-MM') !== startDate.format('YYYY-MM')) {
				leftCalendar.month = startDate.clone().date(2);
				rightCalendar.month = startDate.clone().date(2).add(1, 'month');
			}
		}

		if (maxDate && linkedCalendars && !singleDatePicker && rightCalendar.month > maxDate) {
			rightCalendar.month = maxDate.clone().date(2);
			leftCalendar.month = maxDate.clone().date(2).subtract(1, 'month');
		}
	}

	function updateCalendars(): void {
		renderCalendar('left');
		renderCalendar('right');
		calculateChosenLabel();
	}

	function renderCalendar(side: 'left' | 'right'): void {
		// Calendar rendering logic would go here
	}

	function updateFormInputs(): void {
		// Update the input fields with the current dates
	}

	function move(): void {
		if (!isShowing) return;
		// Position the calendar dropdown
	}

	function clickPrev(side: 'left' | 'right'): void {
		if (side === 'left') {
			leftCalendar.month.subtract(1, 'month');
			if (linkedCalendars) {
				rightCalendar.month.subtract(1, 'month');
			}
		} else {
			rightCalendar.month.subtract(1, 'month');
		}
		updateCalendars();
	}

	function clickNext(side: 'left' | 'right'): void {
		if (side === 'left') {
			leftCalendar.month.add(1, 'month');
		} else {
			rightCalendar.month.add(1, 'month');
			if (linkedCalendars) {
				leftCalendar.month.add(1, 'month');
			}
		}
		updateCalendars();
	}

	function clickDate(date: Moment, side: 'left' | 'right'): void {
		if (!date || !date.isValid()) return;

		if (!endDate || date.isBefore(startDate, 'day')) {
			endDate = moment().endOf('day');
			setStartDate(date.clone());
		} else if (!endDate && date.isBefore(startDate)) {
			setEndDate(startDate.clone());
		} else {
			setEndDate(date.clone());
			if (autoApply) {
				calculateChosenLabel();
				clickApply();
			}
		}

		if (singleDatePicker) {
			setEndDate(startDate);
			if (!timePicker) {
				clickApply();
			}
		}

		updateView();
	}

	function clickApply(): void {
		hide();
	}

	function clickCancel(): void {
		startDate = oldStartDate;
		endDate = oldEndDate;
		hide();
	}

	function calculateChosenLabel(): void {
		for (const [label, range] of Object.entries(ranges)) {
			if (timePicker) {
				if (startDate.isSame(range[0]) && endDate.isSame(range[1])) {
					chosenLabel = label;
					break;
				}
			} else {
				if (startDate.format('YYYY-MM-DD') === range[0].format('YYYY-MM-DD') && endDate.format('YYYY-MM-DD') === range[1].format('YYYY-MM-DD')) {
					chosenLabel = label;
					break;
				}
			}
		}
	}

	function selectRange(label: string): void {
		if (label === locale.customRangeLabel) {
			return;
		}

		const range = ranges[label];
		if (range) {
			startDate = range[0].clone();
			endDate = range[1].clone();

			if (!timePicker) {
				startDate.startOf('day');
				endDate.endOf('day');
			}

			if (!alwaysShowCalendars) {
				hide();
			}
			clickApply();
		}
	}

	function selectToday(): void {
		const today = moment();
		clickDate(today, 'left');
		if (singleDatePicker) {
			clickApply();
		}
	}
</script>

<div class="daterangepicker" bind:this={element}>
	<input type="text" class="daterangepicker-input" value={startDate.format(locale.format) + (singleDatePicker ? '' : locale.separator + endDate.format(locale.format))} on:click={toggle} readonly />

	{#if isShowing}
		<div class="daterangepicker-dropdown" bind:this={container}>
			<div class="calendar-container">
				<!-- Left Calendar -->
				<div class="calendar left">
					<div class="calendar-header">
						<button class="prev" on:click={() => clickPrev('left')}>‹</button>
						<div class="month-year">
							{leftCalendar.month.format('MMMM YYYY')}
						</div>
						<button class="next" on:click={() => clickNext('left')}>›</button>
					</div>
					<div class="calendar-table">
						<!-- Calendar grid would be rendered here -->
					</div>
				</div>

				<!-- Right Calendar (only shown for range picker) -->
				{#if !singleDatePicker}
					<div class="calendar right">
						<div class="calendar-header">
							<button class="prev" on:click={() => clickPrev('right')}>‹</button>
							<div class="month-year">
								{rightCalendar.month.format('MMMM YYYY')}
							</div>
							<button class="next" on:click={() => clickNext('right')}>›</button>
						</div>
						<div class="calendar-table">
							<!-- Calendar grid would be rendered here -->
						</div>
					</div>
				{/if}
			</div>

			<div class="ranges">
				<ul>
					{#each Object.entries(ranges) as [label], i}
						<li class:active={chosenLabel === label} on:click={() => selectRange(label)}>
							{label}
						</li>
					{/each}
					{#if showCustomRangeLabel}
						<li class:active={chosenLabel === locale.customRangeLabel} on:click={() => (chosenLabel = locale.customRangeLabel)}>
							{locale.customRangeLabel}
						</li>
					{/if}
				</ul>
			</div>

			<div class="buttons">
				<button class="cancel {cancelClass}" on:click={clickCancel}>
					{locale.cancelLabel}
				</button>
				<button class="apply {applyClass}" on:click={clickApply}>
					{locale.applyLabel}
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- prettier-ignore -->
<style>
	.daterangepicker { position: relative; display: inline-block; font-family: inherit; }
	.daterangepicker-input { padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; width: 100%; box-sizing: border-box; }
	.daterangepicker-dropdown { position: absolute; z-index: 3001; background: #fff; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175); padding: 10px; margin-top: 5px; display: flex; flex-direction: column; }
	.calendar-container { display: flex; gap: 20px; }
	.calendar { margin: 0; }
	.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
	.month-year { font-weight: bold; text-align: center; flex-grow: 1; }
	.calendar-table { /* Calendar grid styles */ }
	.ranges { margin: 10px 0; }
	.ranges ul { list-style: none; padding: 0; margin: 0; }
	.ranges li { padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-bottom: 2px; }
	.ranges li:hover { background-color: #f5f5f5; }
	.ranges li.active { background-color: #428bca; color: white; }
	.buttons { display: flex; justify-content: flex-end; margin-top: 10px; gap: 5px; }
	.buttons button { padding: 6px 12px; border-radius: 4px; cursor: pointer; border: 1px solid transparent; }
	.buttons .cancel { background-color: #fff; border-color: #ccc; }
	.buttons .apply { color: #fff; background-color: #5cb85c; border-color: #4cae4c; }
</style>
