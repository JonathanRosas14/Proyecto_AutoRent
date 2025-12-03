<template>
  <div class="login-container">
    <!-- Lado izquierdo - Imagen -->
    <div class="left-side">
      <img src="../assets/login-card.png" alt="Auto en carretera">
      <div class="text-overlay">
        <h1>Welcome Back</h1>
        <p>Log in to manage your car rental reservations and hit the road on your next adventure.</p>
      </div>
    </div>

    <!-- Lado derecho - Formulario -->
    <div class="right-side">
      <div class="form-box">
        <!-- Logo -->
        <div class="logo">
          <div class="logo-icon"> 
            <img src="../assets/logo.png" alt="Logo">
          </div>
          <span>AutoRent</span>
        </div>

        <!-- Título -->
        <h2>Log in to your account</h2>
        <p class="subtitle">Manage your bookings and explore new cars.</p>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              v-model="email"
              placeholder="Enter your email"
              required
            >
          </div>

          <!-- Password -->
          <div class="form-group">
            <div class="label-row">
              <label>Password</label>
              <a href="#" class="forgot">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              v-model="password"
              placeholder="Enter your password"
              required
            >
          </div>

          <!-- Botón -->
          <button type="submit" class="login-btn">Login</button>
        </form>

        <!-- Link registro -->
        <p class="signup-text">
          Don't have an account? <router-link to="/register">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Login:', email.value, password.value)
  alert('Iniciando sesión...')
}
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
}

/* LADO IZQUIERDO */
.left-side {
  flex: 1;
  position: relative;
  background: #1a1a1a;
}

.left-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-overlay {
  position: absolute;
  bottom: 60px;
  left: 60px;
  color: white;
  max-width: 500px;
}

.text-overlay h1 {
  font-size: 48px;
  margin-bottom: 15px;
}

.text-overlay p {
  font-size: 18px;
  line-height: 1.6;
}

/* LADO DERECHO */
.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  padding: 40px;
}

.form-box {
  width: 100%;
  max-width: 450px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
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

/* Título */
h2 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 30px;
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
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.forgot {
  color: #dc4a45;
  text-decoration: none;
  font-size: 14px;
}

.forgot:hover {
  text-decoration: underline;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
}

input:focus {
  outline: none;
  border-color: #dc4a45;
}

input::placeholder {
  color: #9ca3af;
}

/* Botón Login */
.login-btn {
  width: 100%;
  padding: 14px;
  background: #d53833;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.login-btn:hover {
  background: #ca0f09;
}

/* Texto de registro */
.signup-text {
  text-align: center;
  margin-top: 20px;
  color: #6b7280;
}

.signup-text a {
  color: #dc4a45;
  text-decoration: none;
  font-weight: 600;
}

.signup-text a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .left-side {
    display: none;
  }
  
  .right-side {
    flex: 1;
  }
}
</style>