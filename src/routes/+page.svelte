<script>
    import { goto } from '$app/navigation';
  
    const goToLogin = () => goto('/login');
  </script>
  
  <main class="text-center p-8">
    <h1 class="text-3xl font-bold mb-4">Welcome to the Student Management System</h1>
    <p class="mb-4">Please log in to continue.</p>
    <button on:click={goToLogin} class="bg-blue-600 text-white px-4 py-2 rounded">
      Go to Login
    </button>
  </main>
  