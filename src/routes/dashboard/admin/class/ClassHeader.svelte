<script>
  export let totalClasses;
  export let totalLevels;
  export let totalAcademicYears;
</script>

<div class="header">
  <h1>School Class List</h1>
  <div class="stats">
    <div class="stat blue">{totalClasses} <span>Total Classes</span></div>
    <div class="stat green">{totalLevels} <span>Total Levels</span></div>
    <div class="stat purple">{totalAcademicYears} <span>Total Academic Years</span></div>
  </div>

</div>

<style>
  .header {
    margin-bottom: 1rem;
    width: 100%;
  }
  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  .stats {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
  }
  .stat {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    color: white;
    font-weight: bold;
  }
  .blue { background-color: #007bff; }
  .green { background-color: #28a745; }
  .purple { background-color: #9b59b6; }
  .stat span {
    display: block;
    font-size: 0.8rem;
    font-weight: normal;
  }
  .breadcrumb {
    font-size: 0.9rem;
    color: #666;
  }
  .breadcrumb a {
    color: #1e90ff;
    text-decoration: none;
  }
  .breadcrumb a:hover {
    text-decoration: underline;
  }
  .breadcrumb span {
    color: #333;
  }
</style>