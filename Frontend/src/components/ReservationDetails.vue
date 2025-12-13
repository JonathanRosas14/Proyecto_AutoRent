<template>
  <div class="confirmation-page">
    <div v-if="loading" class="loading">Loading...</div>

    <template v-else-if="reservation">
      <!-- Success Header -->
      <div class="success-header">
        <div class="check-icon">✓</div>
        <h1>Your Reservation is Confirmed!</h1>
        <p>A confirmation email with all the details has been sent to your registered email address.</p>
      </div>

      <!-- Confirmation Number -->
      <div class="confirmation-number">
        <span class="label">Confirmation Number</span>
        <span class="number">BKNG-{{ reservation.id_reservation.toString().padStart(7, '0') }}</span>
      </div>

      <!-- Car Details -->
      <div class="car-section">
        <div class="car-info">
          <span class="car-category">{{ reservation.category_name }}</span>
          <h2>{{ reservation.car_name }}</h2>
          
          <div class="car-specs">
            <div class="spec">
              <span class="icon">👥</span>
              <span>{{ reservation.passengers }}</span>
            </div>
            <div class="spec">
              <span class="icon">💼</span>
              <span>{{ reservation.luggage }}</span>
            </div>
            <div class="spec">
              <span class="icon">⚙️</span>
              <span>{{ reservation.transmission }}</span>
            </div>
            <div class="spec">
              <span class="icon">∞</span>
              <span>Unlimited</span>
            </div>
          </div>
        </div>

        <div class="car-image">
          <img :src="reservation.car_image" :alt="reservation.car_name" />
        </div>
      </div>

      <!-- Pickup & Dropoff Details -->
      <div class="trip-details">
        <div class="detail-section">
          <h3>Pick-up</h3>
          <p class="location">{{ reservation.pickUp_location }}</p>
          <p class="datetime">{{ formatFullDateTime(reservation.pickUp_DateTime) }}</p>
        </div>

        <div class="detail-section">
          <h3>Drop-off</h3>
          <p class="location">{{ reservation.dropOff_location }}</p>
          <p class="datetime">{{ formatFullDateTime(reservation.dropOff_DateTime) }}</p>
        </div>
      </div>

      <!-- Cost Summary -->
      <div class="cost-section">
        <h3>Cost Summary</h3>
        
        <div class="cost-row">
          <span>Base Rate ({{ reservation.total_days }} days)</span>
          <span>${{ reservation.base_price.toFixed(2) }}</span>
        </div>
        
        <div class="cost-row">
          <span>Taxes & Fees</span>
          <span>${{ reservation.taxes_fees.toFixed(2) }}</span>
        </div>
        
        <div class="cost-row total">
          <span>Total Paid</span>
          <span>${{ reservation.total_cost.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <router-link to="/reservation" class="primary-btn">
          View All Reservations
        </router-link>
        
        <button @click="contactSupport" class="secondary-btn">
          Contact Support
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const reservation = ref(null)
const loading = ref(true)

onMounted(async () => {
  await fetchReservationDetails()
})

const fetchReservationDetails = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/reservation/${route.params.id}`)
    const data = await response.json()
    
    if (data.success) {
      reservation.value = data.reservation
    } else {
      router.push('/reservation')
    }
  } catch (error) {
    console.error('Error:', error)
    router.push('/reservation')
  } finally {
    loading.value = false
  }
}

const formatFullDateTime = (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const contactSupport = () => {
  router.push('/support')
}
</script>

<style scoped>
.confirmation-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.loading {
  text-align: center;
  padding: 100px 20px;
  font-size: 18px;
  color: #6b7280;
}

/* Success Header */
.success-header {
  text-align: center;
  margin-bottom: 32px;
}

.check-icon {
  width: 80px;
  height: 80px;
  background: #059669;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto 24px;
}

.success-header h1 {
  font-size: 36px;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.success-header p {
  color: #6b7280;
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

/* Confirmation Number */
.confirmation-number {
  background: white;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.confirmation-number .label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.confirmation-number .number {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

/* Car Section */
.car-section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.car-info {
  flex: 1;
}

.car-category {
  font-size: 14px;
  color: #6b7280;
  display: block;
  margin-bottom: 8px;
}

.car-info h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.car-specs {
  display: flex;
  gap: 24px;
}

.spec {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
}

.spec .icon {
  font-size: 20px;
}

.car-image {
  width: 400px;
  height: 250px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Trip Details */
.trip-details {
  background: white;
  padding: 32px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-section h3 {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 12px;
  font-weight: 500;
}

.detail-section .location {
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
  margin-bottom: 4px;
}

.detail-section .datetime {
  font-size: 14px;
  color: #6b7280;
}

/* Cost Section */
.cost-section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cost-section h3 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 15px;
}

.cost-row span:first-child {
  color: #6b7280;
}

.cost-row span:last-child {
  color: #1a1a1a;
  font-weight: 600;
}

.cost-row.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  font-size: 20px;
}

.cost-row.total span {
  color: #1a1a1a;
  font-weight: 700;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
}

.primary-btn {
  flex: 1;
  padding: 16px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #c23e39;
}

.secondary-btn {
  flex: 1;
  padding: 16px;
  background: white;
  color: #6b7280;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .car-section {
    flex-direction: column;
  }

  .car-image {
    width: 100%;
  }

  .trip-details {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>