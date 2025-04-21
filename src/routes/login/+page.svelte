<script lang="ts">
  import AuthForm from '../components/AuthForm.svelte';
  import { goto } from '$app/navigation';

  const handleLogin = async (event: CustomEvent<{ email: string; password: string }>) => {
  const { email, password } = event.detail;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
    goto('/dashboard');
  } else {
    alert(data.message);
  }
};
</script>

<main class="max-w-md mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
  <AuthForm type="login" on:submit={handleLogin} />
</main>
