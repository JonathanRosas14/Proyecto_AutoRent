<template>
  <div class="car-detail-view">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <p>Loading car details...</p>
    </div>

    <template v-else>
      <div class="detail-container">
        <!-- Left: Images -->
        <div class="images-section">
          <div class="main-image">
            <img :src="selectedImage || car.main_image" :alt="car.name" />
          </div>
          
          <div class="thumbnail-grid">
            <div 
              v-for="(image, index) in images" 
              :key="index"
              class="thumbnail"
              :class="{ active: selectedImage === image.image_url }"
              @click="selectedImage = image.image_url"
            >
              <img :src="image.image_url" :alt="`${car.name} ${index + 1}`" />
            </div>
          </div>
        </div>

        <!-- Right: Details -->
        <div class="details-section">
          <div class="car-header">
            <h1>{{ car.name }}</h1>
            <p class="car-type">{{ car.category_name }}</p>
          </div>

          <!-- Specs Icons -->
          <div class="specs-icons">
            <div class="spec-icon">
              <div class="icon-circle">👥</div>
              <span class="spec-number">{{ car.passengers }}</span>
              <span class="spec-label">Passengers</span>
            </div>
            
            <div class="spec-icon">
              <div class="icon-circle">💼</div>
              <span class="spec-number">{{ car.luggage }} Bags</span>
              <span class="spec-label">Luggage</span>
            </div>
            
            <div class="spec-icon">
              <div class="icon-circle">⚙️</div>
              <span class="spec-number">{{ car.transmission }}</span>
              <span class="spec-label">Transmission</span>
            </div>
            
            <div class="spec-icon">
              <div class="icon-circle">⛽</div>
              <span class="spec-number">{{ car.fuel_capacity }} MPG</span>
              <span class="spec-label">Fuel Efficiency</span>
            </div>
          </div>

          <!-- Tabs -->
          <div class="tabs">
            <button 
              :class="{ active: activeTab === 'specs' }"
              @click="activeTab = 'specs'"
            >
              Specifications
            </button>
            <button 
              :class="{ active: activeTab === 'features' }"
              @click="activeTab = 'features'"
            >
              Features
            </button>
            <button 
              :class="{ active: activeTab === 'reviews' }"
              @click="activeTab = 'reviews'"
            >
              Reviews
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <div v-if="activeTab === 'specs'" class="description">
              <p>{{ car.description }}</p>
            </div>
            
            <div v-if="activeTab === 'features'" class="features-list">
              <p>Features information will be displayed here</p>
            </div>
            
            <div v-if="activeTab === 'reviews'" class="reviews-list">
              <p>Customer reviews will be displayed here</p>
            </div>
          </div>

          <!-- Price & Reserve -->
          <div class="reserve-section">
            <div class="price-info">
              <div class="price">
                <span class="amount">${{ car.price_per_day }}</span>
                <span class="period">/day</span>
              </div>
              <p class="deposit">Security deposit: $200</p>
            </div>
            
            <button class="reserve-btn">
              ❤️ Reserve This Car
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const car = ref({})
const images = ref([])
const loading = ref(true)
const selectedImage = ref(null)
const activeTab = ref('specs')

onMounted(async () => {
  await fetchCarDetails()
})

const fetchCarDetails = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/cars/${route.params.id}`)
    const data = await response.json()
    
    if (data.success) {
      car.value = data.car
      images.value = data.images
      
      // Establecer la primera imagen como seleccionada
      if (images.value.length > 0) {
        selectedImage.value = images.value[0].image_url
      } else if (car.value.main_image) {
        selectedImage.value = car.value.main_image
      }
    }
  } catch (error) {
    console.error('Error al cargar detalles:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.car-detail-view {
  background: #f9fafb;
  min-height: 100vh;
}

/* Container */
.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: white;
  padding: 40px;
  border-radius: 16px;
}

/* Images */
.main-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #f3f4f6;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.thumbnail {
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #dc4a45;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Details */
.car-header h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.car-type {
  color: #6b7280;
  margin-bottom: 32px;
}

/* Specs Icons */
.specs-icons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.spec-icon {
  text-align: center;
}

.icon-circle {
  width: 56px;
  height: 56px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 24px;
}

.spec-number {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.spec-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.tabs button {
  padding: 12px 24px;
  background: none;
  border: none;
  color: #6b7280;
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
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #dc4a45;
}

/* Tab Content */
.tab-content {
  min-height: 150px;
  margin-bottom: 32px;
}

.description {
  color: #4b5563;
  line-height: 1.6;
}

/* Reserve */
.reserve-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 12px;
}

.price-info {
  margin-bottom: 20px;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.amount {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
}

.period {
  font-size: 18px;
  color: #6b7280;
}

.deposit {
  font-size: 14px;
  color: #6b7280;
}

.reserve-btn {
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

.reserve-btn:hover {
  background: #c23e39;
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
  }
  
  .specs-icons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .car-detail-view {
    padding: 24px;
  }
  
  .thumbnail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>