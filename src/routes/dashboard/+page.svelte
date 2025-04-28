  <script>
    // Nav logic if needed
  </script>

  <div class="layout">
    <aside class="sidebar">
      <h2 class="sidebar-title">
        <span class="enroll-text">Enroll</span><span class="ease-text">Ease</span>
      </h2>
      <ul class="nav-links">
        <li><a href="/activities">Activities</a></li>
        <li><a href="/course">Course</a></li>
      </ul>
    </aside>
    <div class="main-area">
      <nav class="top-nav">
      </nav>

      <main class="main-content">
        <p>Welcome to the dashboard!</p>
      </main>
    </div>
  </div>


  <style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body), :global(html) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 220px;
    background-color: #1E293B;
    padding: 2rem 0 ;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    min-height: 100vh; 
    position: sticky;
    top: 0;
  }

  .sidebar-title {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .enroll-text {
    color: #FFFFFF;
  }

  .ease-text {
    color: #2563eb;
  }

  .nav-links {
    list-style: none;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%; 
  }

  .nav-links li {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .nav-links a {
    text-decoration: none;
    color: #FFFFFF;
    font-weight: 500;
    padding: 0.75rem 1rem; 
    transition: background-color 0.3s, color 0.3s;
    font-family: 'Montserrat', sans-serif;
    display: block;
    width: 100%;
    text-align: center;
  }

  .nav-links a:hover {
    background-color: #CCCCCC; 
    color: #000000;
    padding: 0.75rem 1rem; 
    transition: background-color 0.3s, color 0.3s;
  }

  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .top-nav {
    background-color: #E5E7EB;
    padding: 2.5rem 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.40);
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'Montserrat', sans-serif;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    background-color: #fff;
    font-family: 'Montserrat', sans-serif;
    overflow-y: auto;
  }
  </style>