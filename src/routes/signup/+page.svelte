<script lang="ts">
    import { goto } from '$app/navigation';
  
    let name = '';
    let email = '';
    let password = '';
  
    const handleSignup = async () => {
      const res = await fetch('/api/user/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await res.json();
  
      if (data.success) {
        localStorage.setItem('token', data.token);
        goto('/dashboard/');
      } else {
        alert(data.message);
      }
    };
  </script>
  
  <main class="signup-page">
    <div class="signup-container">
      <h1 class="title">
        <span class="enroll-text">Enroll</span><span class="ease-text"></span>Ease
      </h1>
      <p class="subtitle">Please sign up to continue.</p>
  
      <form on:submit|preventDefault={handleSignup} class="signup-form">
        <div class="input-wrapper">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <path fill="currentColor" d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56"/>
          </svg>
          <input type="text" placeholder="username" bind:value={name} required class="input-field" />
        </div>
      
        <div class="input-wrapper">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
            <path fill="currentColor" d="M14.5 13h-13C.67 13 0 12.33 0 11.5v-9C0 1.67.67 1 1.5 1h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5M1.5 2c-.28 0-.5.22-.5.5v9c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-9c0-.28-.22-.5-.5-.5z"/><path fill="currentColor" d="M8 8.96c-.7 0-1.34-.28-1.82-.79L.93 2.59c-.19-.2-.18-.52.02-.71s.52-.18.71.02l5.25 5.58c.57.61 1.61.61 2.18 0l5.25-5.57c.19-.2.51-.21.71-.02s.21.51.02.71L9.82 8.18c-.48.51-1.12.79-1.82.79Z"/>
          </svg>
          <input type="email" placeholder="email" bind:value={email} required class="input-field" />
        </div>
      
        <div class="input-wrapper">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z"/><path stroke-linecap="round" d="M6 10V8a6 6 0 1 1 12 0v2"/></g>
          </svg>
          <input type="password" placeholder="password" bind:value={password} required class="input-field" />
        </div>
      
        <button type="submit" class="submit-button">Sign Up</button>
  
        <p class="redirect-text">
          Already have an account?
          <button type="button" on:click={() => goto('/login/')} class="login-button">Login</button>
        </p>
  
      </form>
      
    </div>
  </main>
  
  <style>
    .signup-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1rem;
      background-color: #f3f4f6;
    }
    .signup-container {
      width: 100%;
      max-width: 400px;
      background: white;
      background-color: #f3f4f6;
      padding: 2rem;
    }
    .title {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      font-family: 'Montserrat', sans-serif;
    }
    .enroll-text {
      color: #22c55e;
    }
    .ease-text {
      color: #000000; 
    }
    .subtitle {
      text-align: center;
      font-size: 1rem;
      margin-bottom: 1.5rem;
      font-family: 'Montserrat', sans-serif;
      color: #6B6B6B;
    }
  
    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .input-wrapper {
      position: relative;
     }
    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #a8a8a8;
    }
    .input-field {
      width: 100%;
      padding: 0.75rem 0.75rem 0.75rem 2.5rem; 
      border: 1px solid #ccc;
      border-radius: 9px;
      font-size: 1rem;
      outline: none;
      font-family: 'Montserrat', sans-serif;
      box-sizing: border-box;
  }
  
    .input-field::placeholder {
      color: #CCC;
      font-size: 0.95rem;
      font-family: 'Montserrat', sans-serif;
    }
    .input-field:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }
  
    .submit-button {
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
      font-family: 'Montserrat', sans-serif;
    }
    .submit-button:hover {
      background-color: #1d4ed8;
    }
    .redirect-text {
      border-top: 1px solid #CCCCCC;
      text-align: center;
      margin-top: 1rem;
      padding-top: 1rem;
      font-size: 0.9rem;
      font-family: 'Montserrat', sans-serif;
      color: #6B6B6B;
    }
  
    .login-button {
      background: none;
      border: none;
      color: #2563eb;
      font-weight: bold;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      margin-left: 1px;
    }
  
    .login-button:hover {
      text-decoration: underline;
    }
  
  </style>
  