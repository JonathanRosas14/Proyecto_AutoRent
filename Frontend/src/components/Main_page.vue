<template>
  <div class="dashboard-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-screen">
      <p>Cargando...</p>
    </div>

    <!-- Dashboard content -->
    <template v-else>
      <!-- Navegación lateral fija -->
      <nav class="sidebar">
        <!-- Logo -->
        <div class="logo">
          <div class="logo-icon">
            <img src="../assets/logo.png" alt="Logo" />
          </div>
          <span>AutoRent</span>
        </div>

        <!-- Perfil del usuario -->
        <div class="perfil">
          <div class="perfil-avatar">
            <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
            <div v-else class="avatar-placeholder">
              {{ user.name ? user.name.charAt(0).toUpperCase() : "U" }}
            </div>
          </div>

          <div class="perfil-info">
            <p class="perfil-name">{{ user.name || "Usuario" }}</p>
            <p class="perfil-email">{{ user.email || "email@example.com" }}</p>
          </div>
        </div>

        <!-- Links de navegación -->
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">
            <img src="../assets_main/dashboard.png" alt="">
            Dashboard
          </router-link>
          <router-link to="/reservation" class="nav-link">
            <img src="../assets_main/calendar.png" alt="">
            My Reservations
          </router-link>
          <router-link to="/settings" class="nav-link">
            <img src="../assets_main/settings.png" alt="settings">
            Profile Settings
          </router-link>
          <router-link to="/support" class="nav-link">
            <img src="../assets_main/headphones.png" alt="headphones">
            Support
          </router-link>
        </div>

        <!-- Botón Log Out -->
        <div class="log-out">
          <button @click="handleLogout" class="logout-btn">
            <img src="../assets_main/log-out.png" alt="log-out">
            Log Out
          </button>
        </div>
      </nav>

      <!-- Contenido principal -->
      <section class="main-content">
        <router-view />
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const user = ref({});
const loading = ref(true);
const router = useRouter();

onMounted(() => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    router.push("/login");
    return;
  }

  user.value = JSON.parse(savedUser);
  loading.value = false;
});

const handleLogout = () => {
  localStorage.clear();
  router.push("/login");
};
</script>

<style scoped>
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #6b7280;
}

.dashboard-container {
  display: flex;
  overflow: hidden;
}

/* SIDEBAR - Navegación lateral fija */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 100%;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 8px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
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

/* Contenedor perfil alargado */
.perfil {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 14px 18px;
  gap: 14px;
  margin-bottom: 24px;
}

/* Avatar circular */
.perfil-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.perfil-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Inicial si no tiene avatar */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000000, #ff6b6b);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
}

/* Info del perfil */
.perfil-info {
  display: flex;
  flex-direction: column;
}

.perfil-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.perfil-email {
  font-size: 13px;
  color: #6b7280;
  margin: 2px 0 0;
}


/* Links de navegación */
.nav-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  width: 85%;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #fee2e2;
  color: #1a1a1a;
}

.nav-link img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

/* Log Out */
.log-out {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.logout-btn {
  width: 95%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: transparent;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
}

.logout-btn:hover {
  background: #fee2e2;
}

.logout-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

.main-content{
  margin-left: 280px;
  padding: 0 40px;
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
  background: #f9fafb;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }

  .main-content {
    margin-left: 240px;
    padding: 20px;
  }
}
</style>
