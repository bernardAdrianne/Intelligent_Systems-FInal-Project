<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let type: 'login' | 'signup'; 

  let email = '';
  let password = '';

  const handleSubmit = () => {
    dispatch('submit', { email, password });
  };
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <input
    type="email"
    placeholder="Email"
    bind:value={email}
    required
    class="w-full p-2 border rounded"
  />
  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
    class="w-full p-2 border rounded"
  />
  <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">
    {type === 'signup' ? 'Sign Up' : 'Login'}
  </button>
</form>
