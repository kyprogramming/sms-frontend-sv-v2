<!-- <script lang="ts">
	import { fly } from "svelte/transition";

    let isOpen = $state(false);
    let selectedOption = $state<string | null>(null);
    let options = $state([
      "Select an option",
      "Premium Feature 1",
      "Premium Feature 2",
      "VIP Package",
      "Custom Plan"
    ]);
  
    function toggleDropdown() {
      isOpen = !isOpen;
    }
  
    function selectOption(option: string) {
      selectedOption = option;
      isOpen = false;
    }
  </script>
  
  <div class="dropdown-container">
    <button
      class="dropdown-trigger"
      on:click={toggleDropdown}
      on:keydown={(e) => e.key === 'Enter' && toggleDropdown()}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <span class="selected-value">
        {selectedOption || options[0]}
      </span>
      <svg
        class="dropdown-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  
    {#if isOpen}
      <ul
        class="dropdown-menu"
        role="listbox"
        transition:fly={{ y: -10, duration: 200 }}
        in:fly={{ y: -10, duration: 200 }}
        out:fly={{ y: -10, duration: 150 }}
      >
        {#each options as option, i}
          <li
            class="dropdown-item"
            class:selected={selectedOption === option}
            on:click={() => selectOption(option)}
            on:keydown={(e) => e.key === 'Enter' && selectOption(option)}
            role="option"
            tabindex="0"
          >
            {option}
            {#if selectedOption === option}
              <svg
                class="checkmark"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <style>
    :global(:root) {
      --parrot-green: #3CD070;
      --parrot-green-dark: #30B360;
      --dropdown-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
  
    .dropdown-container {
      position: relative;
      width: 100%;
      max-width: 280px;
      font-family: 'Inter', -apple-system, sans-serif;
    }
  
    .dropdown-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
  
    .dropdown-trigger:hover {
      border-color: #CBD5E0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
  
    .dropdown-trigger:focus {
      outline: none;
      border-color: var(--parrot-green);
      box-shadow: 0 0 0 3px rgba(60, 208, 112, 0.2);
    }
  
    .selected-value {
      font-size: 0.9375rem;
      color: #2D3748;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  
    .dropdown-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: #64748B;
      transition: transform 0.3s ease;
    }
  
    .dropdown-trigger[aria-expanded="true"] .dropdown-icon {
      transform: rotate(180deg);
      color: var(--parrot-green);
    }
  
    .dropdown-menu {
      position: absolute;
      width: 100%;
      margin-top: 0.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: var(--dropdown-shadow);
      overflow: hidden;
      z-index: 10;
      border: 1px solid #EDF2F7;
      padding: 0.5rem 0;
      list-style: none;
      max-height: 300px;
      overflow-y: auto;
    }
  
    .dropdown-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9375rem;
      color: #4A5568;
      transition: all 0.2s ease;
    }
  
    .dropdown-item:hover {
      background: #F8FAFC;
      color: var(--parrot-green-dark);
    }
  
    .dropdown-item.selected {
      color: var(--parrot-green-dark);
      font-weight: 500;
      background: #F0FDF4;
    }
  
    .checkmark {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--parrot-green);
    }
  
    /* Custom scrollbar */
    .dropdown-menu::-webkit-scrollbar {
      width: 6px;
    }
  
    .dropdown-menu::-webkit-scrollbar-track {
      background: #F1F5F9;
      border-radius: 3px;
    }
  
    .dropdown-menu::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 3px;
    }
  
    .dropdown-menu::-webkit-scrollbar-thumb:hover {
      background: #94A3B8;
    }
  </style> -->