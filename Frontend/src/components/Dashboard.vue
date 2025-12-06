<template>
  <div class="conten-section">
    <div class="welcome-name">
      <h1>Welcome back, {{ user.name }}!</h1>
      <p>Manage your reservation and find your next ride.</p>
    </div>
    <div class="input-search">
      <input
        v-model="searchQuery"
        type="text"
        class="filter-input"
        placeholder="Seacrh for a specific car model or type"
      />
    </div>
    <div class="categories">
      <h2>Browsw by Category</h2>
      <div class="fleet-grid">
        <!--SUVs-->
        <router-link to="/category/suvs" class="fleet-card">
          <img src="../assets/Car_image2.png" alt="SUVs" />
          <h3>SUVs</h3>
        </router-link>
        <!--Sedans-->
        <router-link to="/category/sedans" class="fleet-card">
          <img src="../assets/Car_image3.png" alt="Sedans" />
          <h3>Sedans</h3>
        </router-link>
        <!--Luxury-->
        <router-link to="/category/luxury" class="fleet-card">
          <img src="../assets/Car_image4.png" alt="Luxury" />
          <h3>Luxury</h3>
        </router-link>
        <!--Electric-->
        <router-link to="/category/electric" class="fleet-card">
          <img src="../assets/Car_image5.png" alt="Electric" />
          <h3>Electric</h3>
        </router-link>
      </div>
    </div>
    <div class="Reservations">
      <h1>My Reservations</h1>
      <p>Aqui se mostrala las reservas de la base de datos</p>
      <!--Aque debe renderizar mi reservas que traigo de mi base datos con solo la informacion del atuo su foto y detalles de la fecha de reserva y el estado-->
    </div>
  </div>
</template>

<script setup>

  import {ref, onMounted} from 'vue'

  const user = ref({
    name: '',
    email: ''
  })

  const searchQuery = ref('')

  onMounted(()=>{
    const storedUser = localStorage.getItem('user')
    if (storedUser){
      user.value = JSON.parse(storedUser)
    }
  })
</script>

<style scoped>
.dashboard-view {
  width: 100%;
  padding: 32px;
  background: #f9fafb;
  min-height: 100vh;
}

.welcome-name {
  margin-bottom: 32px;
}

.welcome-name h1 {
  font-size: 36px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.welcome-name p {
  color: #6b7280;
  font-size: 16px;
}

.input-search {
  margin-bottom: 48px;
}

.filter-input {
  width: 95%;
  padding: 16px 20px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
}

.filter-input:focus {
  outline: none;
  border-color: #dc4a45;
}

.categories {
  margin-bottom: 48px;
}

.categories h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.fleet-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.fleet-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.fleet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.fleet-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.fleet-card h3 {
  padding: 20px;
  font-size: 18px;
  color: #1a1a1a;
  text-align: center;
}

.reservations-section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reservations-section h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.reservations-section p {
  color: #6b7280;
}

@media (max-width: 1024px) {
  .fleet-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 20px;
  }

  .fleet-grid {
    grid-template-columns: 1fr;
  }

  .welcome-name h1 {
    font-size: 28px;
  }
}
</style>
