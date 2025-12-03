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
        <!--Mensaje de error-->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <!--Mensaje de exito-->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Enter your full name"
            required
          />
        </div>

        <!--correo-->
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
        <!--Contraseña-->
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
        <!--Confirmacion de contraseña-->
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
        <!--Boton-->
        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? 'Registando...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref ('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () =>{
  errorMessage.value = ''
  successMessage.value = ''

  // Validar que las contraseñas coinceidan
  if (password.value !== confirmPassword.value){
    errorMessage.value = 'las contraseñas no coinceden'
    return
  }
  if (password.value.length < 6){
    errorMessage.value = 'la contraseña debe tener al menos 6 caracteres'
    return
  }


  loading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      })
    })

    const data = await response.json()

    if (data.success){
      successMessage.value = 'Registro exitoso! Regirigiendo al login'
      setTimeout(()=>{
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = data.message
    }

  } catch (error){
    console.error('Error al registrar:', error)
    errorMessage.value = 'Error al conectar con el servidor'
  } finally {
    loading.value = false
  }
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

.error-message {
  background: #fee2e2;
  color:  #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  border:  1px solid #fecaca;
  margin-bottom:  20px;
}

.success-message {
  background: #d1fae5;
  color: #059669;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #a7f3d0;
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
  transition: all 0.2s;
}

.register-btn:hover {
  background: #c23e39;
}
.register-btn:disabled {
  opacity: 0.6;
  cursor:  not-allowed;
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
