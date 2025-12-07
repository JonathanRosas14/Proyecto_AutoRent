<template>
  <div class="settings-view">
    <div class="settings-header">
      <h1>Profile Settings</h1>
    </div>

    <!-- Sección de perfil -->
    <div class="profile-section">
      <div class="profile-avatar-container">
        <div class="perfil-avatar">
          <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
          <div v-else class="avatar-placeholder">
            {{ user.name ? user.name.charAt(0).toUpperCase() : "U" }}
          </div>
        </div>
      </div>
      
      <div class="profile-info">
        <p class="profile-name">{{ user.name || "Usuario" }}</p>
        <p class="profile-member"> {{ formatDate(user.creation_date) }}</p>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleUpdate" class="settings-form">
      <h2>Personal Information</h2>
      
      <div class="form-row">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            :placeholder="user.name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :placeholder="user.email"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phoneNumber"
            :placeholder="user.phoneNumber || 'Add phone number'"
          />
        </div>
      </div>

      <h2>Change Password</h2>
      
      <div class="form-row">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            v-model="formData.currentPassword"
            placeholder="Enter current password"
          />
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            v-model="formData.newPassword"
            placeholder="Enter new password"
          />
        </div>
      </div>

      <!-- Botones -->
      <div class="form-actions">
        <button type="button" @click="cancelChanges" class="cancel-btn">
          Cancel
        </button>
        <button type="submit" :disabled="loading" class="save-btn">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const formData = reactive({
  name: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: ''
})

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  } else {
    router.push('/login')
  }
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.getFullYear()
}

const handleUpdate = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  // Construir objeto solo con campos que tienen valores
  const updateData = {}
  
  if (formData.name) updateData.name = formData.name
  if (formData.email) updateData.email = formData.email
  if (formData.phoneNumber) updateData.phoneNumber = formData.phoneNumber
  if (formData.newPassword) {
    updateData.newPassword = formData.newPassword
    updateData.currentPassword = formData.currentPassword
  }

  // Validar que al menos un campo esté lleno
  if (Object.keys(updateData).length === 0) {
    errorMessage.value = 'Por favor, modifica al menos un campo'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/user/${user.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'Perfil actualizado correctamente'
      
      // Actualizar localStorage con los nuevos datos
      localStorage.setItem('user', JSON.stringify(data.user))
      user.value = data.user
      
      // Limpiar formulario
      formData.name = ''
      formData.email = ''
      formData.phoneNumber = ''
      formData.currentPassword = ''
      formData.newPassword = ''
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
      
    } else {
      errorMessage.value = data.message
    }

  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    errorMessage.value = 'Error al conectar con el servidor'
  } finally {
    loading.value = false
  }
}

const cancelChanges = () => {
  formData.name = ''
  formData.email = ''
  formData.phoneNumber = ''
  formData.currentPassword = ''
  formData.newPassword = ''
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<style scoped>
.settings-view {
  width: 100%;
  background: #f9fafb;
  min-height: 100vh;
  
}

.settings-header h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 32px;
}

/* Profile Section */
.profile-section {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 22px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.perfil-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.perfil-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000000, #ff6b6b);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.profile-member {
  font-size: 14px;
  color: #6b7280;
}

/* Messages */
.success-message {
  background: #d1fae5;
  color: #059669;
  padding: 14px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #a7f3d0;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 14px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #fecaca;
}

/* Form */
.settings-form {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-form h2 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input {
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #dc4a45;
}

.form-group input::placeholder {
  color: #9ca3af;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 12px 24px;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
}

.save-btn {
  padding: 12px 24px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #c23e39;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-view {
    padding: 14px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>