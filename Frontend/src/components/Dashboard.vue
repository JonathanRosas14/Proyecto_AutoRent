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
        <router-link to="/category/SUVs" class="fleet-card">
          <img src="../assets/Car_image2.png" alt="SUVs" />
          <h3>SUVs</h3>
        </router-link>
        <!--Sedans-->
        <router-link to="/category/Sedans" class="fleet-card">
          <img src="../assets/Car_image3.png" alt="Sedans" />
          <h3>Sedans</h3>
        </router-link>
        <!--Luxury-->
        <router-link to="/category/Luxury" class="fleet-card">
          <img src="../assets/Car_image4.png" alt="Luxury" />
          <h3>Luxury</h3>
        </router-link>
        <!--Electric-->
        <router-link to="/category/Electric" class="fleet-card">
          <img src="../assets/Car_image5.png" alt="Electric" />
          <h3>Electric</h3>
        </router-link>
      </div>
    </div>
    <!-- My Reservations Section -->
    <div class="reservations-section">
      <h2>My Reservations</h2>
      
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'current' }"
          @click="activeTab = 'current'"
        >
          Current Reservations
        </button>
        <button 
          :class="{ active: activeTab === 'past' }"
          @click="activeTab = 'past'"
        >
          Past Reservations
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loadingReservations" class="loading">
        Loading reservations...
      </div>

      <!-- No reservations -->
      <div v-else-if="filteredReservations.length === 0" class="no-reservations">
        <p>No {{ activeTab }} reservations found.</p>
      </div>

      <!-- Reservations List -->
      <div v-else class="reservations-list">
        <div 
          v-for="reservation in filteredReservations" 
          :key="reservation.id_reservation"
          class="reservation-card"
        >
          <div class="car-image">
            <img :src="reservation.car_image" :alt="reservation.car_name" />
          </div>
          
          <div class="reservation-info">
            <h3>{{ reservation.car_name }}</h3>
            <p class="car-type">{{ reservation.category_name }}</p>
          </div>
          
          <div class="reservation-dates">
            <p class="dates">{{ formatDateRange(reservation) }}</p>
            <p class="location">{{ reservation.pickUp_location }}</p>
          </div>
          
          <span :class="['status', getStatusClass(reservation.status)]">
            {{ reservation.status }}
          </span>
          
          <router-link 
            :to="`/reservation-details/${reservation.id_reservation}`"
            class="view-details-btn"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<<script setup>
import { ref, onMounted, computed } from 'vue'

const user = ref({
  name: '',
  email: '',
  id: null
})
const searchQuery = ref('')
const reservations = ref([])
const loadingReservations = ref(false)
const activeTab = ref('current')

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    await fetchReservations()
  }
})

const fetchReservations = async () => {
  loadingReservations.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/reservations/user/${user.value.id}`)
    const data = await response.json()
    
    if (data.success) {
      reservations.value = data.reservations
    }
  } catch (error) {
    console.error('Error al cargar reservaciones:', error)
  } finally {
    loadingReservations.value = false
  }
}

const filteredReservations = computed(() => {
  const now = new Date()
  
  if (activeTab.value === 'current') {
    return reservations.value.filter(r => 
      r.status === 'Pending' || r.status === 'Confirmed' ||
      (new Date(r.dropOff_DateTime) >= now && r.status !== 'Cancelled')
    )
  } else {
    return reservations.value.filter(r => 
      r.status === 'Completed' || r.status === 'Cancelled' ||
      (new Date(r.dropOff_DateTime) < now && r.status !== 'Confirmed')
    )
  }
})

const formatDateRange = (reservation) => {
  const pickUp = new Date(reservation.pickUp_DateTime)
  const dropOff = new Date(reservation.dropOff_DateTime)
  
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${pickUp.toLocaleDateString('en-US', options)} - ${dropOff.toLocaleDateString('en-US', options)}`
}

const getStatusClass = (status) => {
  const classes = {
    'Pending': 'pending',
    'Confirmed': 'confirmed',
    'Completed': 'completed',
    'Cancelled': 'cancelled'
  }
  return classes[status] || 'pending'
}
</script>

<style scoped>
.dashboard-view {
  width: 100%;
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

/* ... tus estilos actuales ... */

/* Reservations Section */
.reservations-section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reservations-section h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
}

.tabs button {
  padding: 12px 24px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tabs button:hover {
  color: #1a1a1a;
}

.tabs button.active {
  color: #dc4a45;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #dc4a45;
}

.loading,
.no-reservations {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reservation-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.reservation-card:hover {
  border-color: #dc4a45;
  box-shadow: 0 4px 12px rgba(220, 74, 69, 0.1);
}

.car-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  flex-shrink: 0;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.reservation-info {
  flex: 1;
  min-width: 0;
}

.reservation-info h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.car-type {
  font-size: 14px;
  color: #6b7280;
}

.reservation-dates {
  flex: 2;
}

.dates {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-size: 14px;
}

.location {
  color: #6b7280;
  font-size: 14px;
}

.status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.confirmed {
  background: #d1fae5;
  color: #059669;
}

.status.completed {
  background: #e5e7eb;
  color: #6b7280;
}

.status.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.view-details-btn {
  padding: 10px 20px;
  background: white;
  border: 1.5px solid #dc4a45;
  color: #dc4a45;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;
}

.view-details-btn:hover {
  background: #dc4a45;
  color: white;
}

@media (max-width: 1024px) {
  .reservation-card {
    flex-wrap: wrap;
  }
  
  .view-details-btn {
    width: 100%;
    text-align: center;
  }
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
