<template>
  <div class="category-view">
    <!-- Header -->
    <div class="category-header">
      <h1>{{ categoryName }}</h1>
      <p>
        Browse our selection of available {{ categoryName }} for your next
        adventure.
      </p>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <p>Loading cars...</p>
    </div>

    <!-- No cars found -->
    <div v-else-if="cars.length === 0" class="no-cars">
      <p>No cars available in this category yet.</p>
      <router-link to="/dashboard" class="back-btn"
        >← Back to Dashboard</router-link
      >
    </div>

    <!-- Cars Grid -->
    <div v-else class="cars-grid">
      <div v-for="car in sortedCars" :key="car.id_car" class="car-card">
        <div class="car-image-container">
          <img
            :src="car.main_image || '/placeholder-car.jpg'"
            :alt="car.name"
            @error="handleImageError"
          />
        </div>

        <div class="car-details">
          <h3>{{ car.name }}</h3>

          <div class="car-specs">
            <div class="spec-item">
              <span class="icon">👥</span>
              <span>{{ car.passengers }}</span>
            </div>
            <div class="spec-item">
              <span class="icon">💼</span>
              <span>{{ car.luggage }}</span>
            </div>
            <div class="spec-item">
              <span class="icon">⚙️</span>
              <span>{{ car.transmission }}</span>
            </div>
          </div>

          <div class="car-price">
            <span class="price-label">Starting at</span>
            <span class="price">${{ car.price_per_day }}/day</span>
          </div>

          <div class="car-actions">
            <button class="book-btn">Book Now</button>
            <router-link :to="`/car/${car.id_car}`" class="details-btn">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const categoryName = ref("");
const cars = ref([]);
const loading = ref(true);
const sortBy = ref("price_asc");

onMounted(async () => {
  categoryName.value = route.params.type;
  await fetchCars();
});

const fetchCars = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/cars/category/${categoryName.value}`
    );
    const data = await response.json();

    if (data.success) {
      cars.value = data.cars;
    }
  } catch (error) {
    console.error("Error al cargar carros:", error);
  } finally {
    loading.value = false;
  }
};

const sortedCars = computed(() => {
  const carsCopy = [...cars.value];

  switch (sortBy.value) {
    case "price_asc":
      return carsCopy.sort((a, b) => a.price_per_day - b.price_per_day);
    case "price_desc":
      return carsCopy.sort((a, b) => b.price_per_day - a.price_per_day);
    case "name":
      return carsCopy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return carsCopy;
  }
});

const handleImageError = (e) => {
  e.target.src = "/placeholder-car.jpg";
};
</script>

<style scoped>
.category-view {
  background: #f9fafb;
  min-height: 100vh;
}

/* Header */
.category-header {
  margin-bottom: 32px;
}

.category-header h1 {
  font-size: 36px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.category-header p {
  font-size: 16px;
  color: #6b7280;
}

/* Loading & No cars */
.loading,
.no-cars {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.back-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #dc4a45;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

/* Cars Grid */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 16px;
  max-width: 1300px;
  margin: 0 auto;
}

.car-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  max-width: 200px;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.car-image-container {
  width: 100%;
  height: 120px;
  overflow: hidden;
  background: #f3f4f6;
}

.car-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-details {
  padding: 12px;
}

.car-details h3 {
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 600;
}

.car-specs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: #6b7280;
}

.icon {
  font-size: 12px;
}

.car-price {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.price-label {
  font-size: 10px;
  color: #6b7280;
}

.price {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.car-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.book-btn {
  width: 100%;
  padding: 8px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.book-btn:hover {
  background: #c23e39;
}

.details-btn {
  width: 90%;
  padding: 8px;
  background: white;
  color: #dc4a45;
  border: 1.5px solid #dc4a45;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  display: block;
}

.details-btn:hover {
  background: #fee2e2;
}

/* Responsive */
@media (max-width: 1200px) {
  .cars-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 900px) {
  .cars-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 700px) {
  .cars-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 500px) {
  .category-view {
    padding: 20px;
  }
  
  .cars-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
