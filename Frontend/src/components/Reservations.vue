<template>
  <div class="reservations-page">
    <div class="page-header">
      <h1>My Reservations</h1>
      <p>View and manage all your car rental reservations</p>
    </div>

    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'upcoming' }"
        @click="activeTab = 'upcoming'"
      >
        Upcoming
      </button>
      <button 
        :class="{ active: activeTab === 'current' }"
        @click="activeTab = 'current'"
      >
        Current
      </button>
      <button 
        :class="{ active: activeTab === 'past' }"
        @click="activeTab = 'past'"
      >
        Past
      </button>
      <button 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        All
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <p>Loading reservations...</p>
    </div>

    <!-- No reservations -->
    <div v-else-if="filteredReservations.length === 0" class="no-data">
      <p>No {{ activeTab }} reservations found.</p>
      <router-link to="/dashboard" class="back-btn">
        Browse Available Cars
      </router-link>
    </div>

    <!-- Reservations List -->
    <div v-else class="reservations-grid">
      <div 
        v-for="reservation in filteredReservations" 
        :key="reservation.id_reservation"
        class="reservation-card"
      >
        <div class="card-header">
          <span :class="['status-badge', getStatusClass(reservation.status)]">
            Status: {{ reservation.status }}
          </span>
        </div>

        <div class="card-content">
          <div class="car-image">
            <img :src="reservation.car_image" :alt="reservation.car_name" />
          </div>

          <div class="car-details">
            <h3>{{ reservation.car_name }}</h3>
            
            <div class="details-row">
              <div class="detail-item">
                <span class="label">Pickup:</span>
                <span class="value">{{ formatDateTime(reservation.pickUp_DateTime) }}</span>
                <span class="location">{{ reservation.pickUp_location }}</span>
              </div>

              <div class="detail-item">
                <span class="label">Drop-off:</span>
                <span class="value">{{ formatDateTime(reservation.dropOff_DateTime) }}</span>
                <span class="location">{{ reservation.dropOff_location }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <router-link 
            :to="`/reservation-details/${reservation.id_reservation}`"
            class="view-btn"
          >
            View Details
          </router-link>
          
          <button 
            v-if="canModify(reservation)"
            @click="modifyReservation(reservation.id_reservation)"
            class="modify-btn"
          >
            Modify
          </button>
          
          <button 
            v-if="canCancel(reservation)"
            @click="cancelReservation(reservation.id_reservation)"
            class="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const reservations = ref([])
const loading = ref(true)
const activeTab = ref('upcoming')

onMounted(async () => {
  await fetchReservations()
})

const fetchReservations = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (!user || !user.id) {
      router.push('/login')
      return
    }

    const response = await fetch(`http://localhost:3000/api/reservations/user/${user.id}`)
    const data = await response.json()
    
    if (data.success) {
      reservations.value = data.reservations
    }
  } catch (error) {
    console.error('Error al cargar reservaciones:', error)
  } finally {
    loading.value = false
  }
}

const filteredReservations = computed(() => {
  const now = new Date()
  
  if (activeTab.value === 'all') {
    return reservations.value
  }
  
  return reservations.value.filter(r => {
    const pickUp = new Date(r.pickUp_DateTime)
    const dropOff = new Date(r.dropOff_DateTime)
    
    switch(activeTab.value) {
      case 'upcoming':
        return pickUp > now && (r.status === 'Pending' || r.status === 'Confirmed')
      case 'current':
        return pickUp <= now && dropOff >= now && r.status === 'Confirmed'
      case 'past':
        return dropOff < now || r.status === 'Completed' || r.status === 'Cancelled'
      default:
        return true
    }
  })
})

const formatDateTime = (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
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

const canModify = (reservation) => {
  const pickUp = new Date(reservation.pickUp_DateTime)
  const now = new Date()
  return pickUp > now && reservation.status === 'Confirmed'
}

const canCancel = (reservation) => {
  const pickUp = new Date(reservation.pickUp_DateTime)
  const now = new Date()
  return pickUp > now && (reservation.status === 'Pending' || reservation.status === 'Confirmed')
}

const modifyReservation = (id) => {
  alert('Modify functionality coming soon!')
}

const cancelReservation = async (id) => {
  if (!confirm('Are you sure you want to cancel this reservation?')) return
  
  // Aquí implementarías la lógica de cancelación
  alert('Cancellation functionality coming soon!')
}
</script>

<style scoped>
.reservations-page {
  padding: 48px 80px;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-header p {
  color: #6b7280;
  font-size: 16px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabs button {
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.tabs button:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.tabs button.active {
  background: #dc4a45;
  color: white;
}

/* Loading & No Data */
.loading,
.no-data {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}

.no-data p {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 16px;
}

.back-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #dc4a45;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

/* Reservations Grid */
.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.reservation-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.reservation-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.card-header {
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #059669;
}

.status-badge.completed {
  background: #e5e7eb;
  color: #6b7280;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.card-content {
  padding: 20px;
}

.car-image {
  width: 100%;
  height: 180px;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.car-details h3 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.details-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.detail-item .value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.detail-item .location {
  font-size: 13px;
  color: #6b7280;
}

.card-footer {
  padding: 16px 20px;
  background: #f9fafb;
  display: flex;
  gap: 8px;
  border-top: 1px solid #e5e7eb;
}

.view-btn {
  flex: 1;
  padding: 10px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #c23e39;
}

.modify-btn {
  padding: 10px 16px;
  background: white;
  color: #dc4a45;
  border: 1.5px solid #dc4a45;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.modify-btn:hover {
  background: #fee2e2;
}

.cancel-btn {
  padding: 10px 16px;
  background: white;
  color: #6b7280;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f3f4f6;
  color: #dc2626;
  border-color: #dc2626;
}

@media (max-width: 768px) {
  .reservations-page {
    padding: 24px;
  }

  .reservations-grid {
    grid-template-columns: 1fr;
  }

  .details-row {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
  }
}
</style>

