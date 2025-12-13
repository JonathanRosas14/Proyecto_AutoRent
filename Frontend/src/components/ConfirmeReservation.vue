<template>
  <div class="reservation-view">
    <h1>Complete Your Reservation</h1>
    <p>Review your reservation details and proceed with booking</p>

    <div class="reservation-container">
      <!-- Lado izquierdo: Formulario -->
      <div class="form-section">
        <form @submit.prevent="handleReservation">
          <!-- Rental Details -->
          <section class="form-card">
            <div class="card-header">
              <span class="icon">🚗</span>
              <h2>Rental Details</h2>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Pick-up Location</label>
                <input 
                  type="text" 
                  v-model="formData.pickUp_location"
                  placeholder="Los Angeles Int. Airport"
                  required
                />
              </div>

              <div class="form-group">
                <label>Drop-off Location</label>
                <input 
                  type="text" 
                  v-model="formData.dropOff_location"
                  placeholder="Los Angeles Int. Airport"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Pick-up Date & Time</label>
                <input 
                  type="datetime-local" 
                  v-model="formData.pickUp_DateTime"
                  required
                />
              </div>

              <div class="form-group">
                <label>Drop-off Date & Time</label>
                <input 
                  type="datetime-local" 
                  v-model="formData.dropOff_DateTime"
                  @change="calculateTotalDays"
                  required
                />
              </div>
            </div>
          </section>

          <!-- Driver Information -->
          <section class="form-card">
            <div class="card-header">
              <span class="icon">👤</span>
              <h2>Driver Information</h2>
            </div>

            <div class="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                v-model="formData.driver_fullname"
                placeholder="As it appears on your license"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  v-model="formData.driver_email"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div class="form-group">
                <label>Driver's License Number</label>
                <input 
                  type="text" 
                  v-model="formData.driver_LicenseNumber"
                  placeholder="D1234567"
                  required
                />
              </div>
            </div>
          </section>

          <!-- Payment Details -->
          <section class="form-card">
            <div class="card-header">
              <span class="icon">💳</span>
              <h2>Payment Details</h2>
            </div>

            <div class="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                v-model="formData.payment_CardNumber"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  v-model="formData.payment_ExpiryDate"
                  placeholder="MM/YY"
                  maxlength="5"
                  required
                />
              </div>

              <div class="form-group">
                <label>CVV</label>
                <input 
                  type="text" 
                  v-model="formData.payment_cvv"
                  placeholder="123"
                  maxlength="4"
                  required
                />
              </div>
            </div>

            <div class="terms">
              <input type="checkbox" id="terms" v-model="agreedToTerms" required>
              <label for="terms">
                I agree to the <a href="#">Terms and Conditions</a>
              </label>
            </div>
          </section>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn" :disabled="loading || !agreedToTerms">
            {{ loading ? 'Processing...' : 'Confirm & Pay' }}
          </button>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>
        </form>
      </div>

      <!-- Lado derecho: Resumen -->
      <div class="summary-section">
        <div class="car-summary">
          <img :src="car.main_image" :alt="car.name" />
          <h3>{{ car.name }}</h3>
          <p class="car-category">{{ car.category_name }}</p>

          <div class="rental-info">
            <div class="info-row">
              <span>Pick-up</span>
              <span>{{ formatDate(formData.pickUp_DateTime) }}</span>
            </div>
            <div class="info-row">
              <span>Drop-off</span>
              <span>{{ formatDate(formData.dropOff_DateTime) }}</span>
            </div>
          </div>

          <div class="cost-breakdown">
            <h4>Cost Breakdown</h4>
            <div class="cost-row">
              <span>Base Rate ({{ totalDays }} days × ${{ car.price_per_day }})</span>
              <span>${{ basePrice.toFixed(2) }}</span>
            </div>
            <div class="cost-row">
              <span>Taxes & Fees</span>
              <span>${{ taxesFees.toFixed(2) }}</span>
            </div>
            <div class="cost-row total">
              <span>Total Cost</span>
              <span>${{ totalCost.toFixed(2) }}</span>
            </div>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const car = ref({})
const loading = ref(false)
const errorMessage = ref('')
const agreedToTerms = ref(false)

const formData = ref({
  pickUp_location: '',
  dropOff_location: '',
  pickUp_DateTime: '',
  dropOff_DateTime: '',
  driver_fullname: '',
  driver_email: '',
  driver_LicenseNumber: '',
  payment_CardNumber: '',
  payment_ExpiryDate: '',
  payment_cvv: ''
})

const totalDays = ref(1)

onMounted(async () => {
  await fetchCarDetails()
  
  // Pre-llenar email del usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.email) {
    formData.value.driver_email = user.email
  }
})

const fetchCarDetails = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/cars/${route.params.id}`)
    const data = await response.json()
    
    if (data.success) {
      car.value = data.car
    }
  } catch (error) {
    console.error('Error al cargar carro:', error)
  }
}

const calculateTotalDays = () => {
  if (formData.value.pickUp_DateTime && formData.value.dropOff_DateTime) {
    const pickUp = new Date(formData.value.pickUp_DateTime)
    const dropOff = new Date(formData.value.dropOff_DateTime)
    const diffTime = Math.abs(dropOff - pickUp)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    totalDays.value = diffDays || 1
  }
}

const basePrice = computed(() => {
  return (car.value.price_per_day || 0) * totalDays.value
})

const taxesFees = computed(() => {
  return basePrice.value * 0.15 // 15% taxes
})

const totalCost = computed(() => {
  return basePrice.value + taxesFees.value
})

const formatDate = (datetime) => {
  if (!datetime) return 'Not selected'
  return new Date(datetime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const handleReservation = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (!user || !user.id) {
      errorMessage.value = 'Please login to make a reservation'
      router.push('/login')
      return
    }

    const response = await fetch('http://localhost:3000/api/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_user: user.id,
        id_car: car.value.id_car,
        ...formData.value,
        total_days: totalDays.value,
        base_price: basePrice.value,
        taxes_fees: taxesFees.value,
        total_cost: totalCost.value
      })
    })

    const data = await response.json()

    if (data.success) {
      alert('Reservation confirmed successfully!')
      router.push('/reservation')
    } else {
      errorMessage.value = data.message
    }

  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = 'Error processing reservation'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reservation-view {
  padding: 48px 80px;
  background: #f9fafb;
  min-height: 100vh;
}

.reservation-view h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.reservation-view > p {
  color: #6b7280;
  margin-bottom: 32px;
}

.reservation-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  max-width: 1400px;
}

/* Form Section */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header .icon {
  font-size: 24px;
}

.card-header h2 {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
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
}

.form-group input:focus {
  outline: none;
  border-color: #dc4a45;
}

.terms {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.terms input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.terms label {
  font-size: 14px;
  color: #4b5563;
}

.terms a {
  color: #dc4a45;
  text-decoration: none;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #c23e39;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-alert {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
}

/* Summary Section */
.summary-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.car-summary {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.car-summary img {
  width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f4f6;
  margin-bottom: 16px;
}

.car-summary h3 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.car-category {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
}

.rental-info {
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row span:first-child {
  color: #6b7280;
}

.info-row span:last-child {
  color: #1a1a1a;
  font-weight: 500;
}

.cost-breakdown h4 {
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.cost-row span:first-child {
  color: #6b7280;
}

.cost-row span:last-child {
  color: #1a1a1a;
  font-weight: 500;
}

.cost-row.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
  font-size: 18px;
}

.cost-row.total span {
  color: #dc4a45;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .reservation-container {
    grid-template-columns: 1fr;
  }
  
  .summary-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .reservation-view {
    padding: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>