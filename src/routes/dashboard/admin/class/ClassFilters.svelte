<script lang="ts">
  export let levelFilter: string;
  export let academicYearFilter: string;
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
    <input type="text"/>
  </div>
   <button type="button">Search</button>
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

select, input[type="text"] {
  padding: 0.5rem;
  border: 1px solid #d1d5db; /* Grayed-out border */
  border-radius: 6px;
  background-color: #f8f8f8; /* Slightly grayed background */
  color: #4b5563; /* Muted text color */
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

select:focus, input[type="text"]:focus {
  outline: none;
  border-color: #3b82f6; /* Vibrant blue on focus */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); /* Professional focus ring */
}

button {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); /* Vibrant button gradient */
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  margin-left: auto;
}

button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); /* Darker on hover */
}

</style>