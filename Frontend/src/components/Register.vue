<template>
  <div class="register-container">
    <header>
      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <img src="../assets/logo.png" alt="Logo" />
        </div>
        <span>AutoRent</span>
      </div>
      <div class="header-right">
        <p class="login-text">
          Already have an account? <router-link to="/login">Log In</router-link> 
        </p>
      </div>
    </header>

    <div class="form-wrapper">
      <!-- Título -->
      <h2>Create an Account</h2>
      <p class="subtitle">Join us and start your journey on the road.</p>

      <!-- Formulario -->
      <form @submit.prevent="handleRegister">
        <!-- Name -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            type="text"
            id="name"
            v-model="name"
            placeholder="Enter your full name"
            required
          >
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email address"
            required
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter a strong password"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
          />
        </div>

        <!-- Botón -->
        <button type="submit" class="register-btn">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden')
    return
  }
  
  console.log('Register:', {
    name: name.value,
    email: email.value,
    password: password.value
  })
  
  alert('Registrando usuario...')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb 0%, #e5e7eb 100%);
  padding: 20px;
}

/* HEADER */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;

}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo span {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
}

.login-text {
  color: #6b7280;
  font-size: 15px;
}

.login-text a {
  color: white;
  background: #dc4a45;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-left: 10px;
  display: inline-block;
}

.login-text a:hover {
  background: #c23e39;
}

/* FORMULARIO */
.form-wrapper {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 50px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 35px;
  text-align: center;
  font-size: 16px;
}

/* Formulario */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 93%;
  padding: 14px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #dc4a45;
}

input::placeholder {
  color: #9ca3af;
}

/* Botón Register */
.register-btn {
  width: 100%;
  padding: 14px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.register-btn:hover {
  background: #c23e39;
}

/* Responsive */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .form-wrapper {
    padding: 40px 25px;
  }
  
  h2 {
    font-size: 28px;
  }
}
</style>