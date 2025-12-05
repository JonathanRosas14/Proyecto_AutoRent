<template>
  <div id="app">
    <!-- Si la ruta es "/" muestra el Home -->
    <div v-if="currentRoute === '/'" class="home-container">
      <!-- HEADER -->
      <header>
        <div class="logo">
          <div class="logo-icon">
            <img src="./assets/logo.png" alt="Logo" />
          </div>
          <span>AutoRent</span>
        </div>
        <div class="header-buttons">
          <router-link to="/login" class="login-btn">Login</router-link>
          <router-link to="/register" class="signup-btn">Sign Up</router-link>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="hero-section">
        <img
          src="./assets/Car_image1.png"
          alt="Auto en carretera"
          class="hero-image"
        />
        <div class="hero-overlay">
          <h1>Find Your Perfect Ride</h1>
          <p>Wide Selection, Competitive Prices, Easy Booking.</p>
        </div>
      </section>

      <!-- EXPLORE FLEET -->
      <section class="fleet-section">
        <h2>Explore Our Fleet</h2>
        <div class="fleet-grid">
          <div class="fleet-card">
            <img src="./assets/Car_image2.png" alt="SUVs" />
            <h3>SUVs</h3>
            <a href="#" class="view-all">View All</a>
          </div>
          <div class="fleet-card">
            <img src="./assets/Car_image3.png" alt="Sedans" />
            <h3>Sedans</h3>
            <a href="#" class="view-all">View All</a>
          </div>
          <div class="fleet-card">
            <img src="./assets/Car_image4.png" alt="Luxury" />
            <h3>Luxury</h3>
            <a href="#" class="view-all">View All</a>
          </div>
          <div class="fleet-card">
            <img src="./assets/Car_image5.png" alt="Electric" />
            <h3>Electric</h3>
            <a href="#" class="view-all">View All</a>
          </div>
        </div>
      </section>

      <!-- PROMO BANNER -->
      <section class="promo-section">
        <img
          src="./assets/Car_image6.png"
          alt="Weekend deal"
          class="promo-image"
        />
        <div class="promo-overlay">
          <h2>Save 20% on Weekend Rentals</h2>
          <p>This Month's Special Deal</p>
        </div>
      </section>

      <!-- CONTACT SECTION -->
      <section class="contact-section">
        <h2>Get In Touch</h2>
        <div class="contact-container">
          <div class="contact-info">
            <h3>Contact Information</h3>
            <p>
              Have questions or need assistance? Reach out to us. We're here to
              help you find the perfect vehicle for your needs.
            </p>
            <div class="info-item">
              <img src="./assets/location.png" alt="location" />
              <span>123 Rental Ave, Car City, ST 12345</span>
            </div>
            <div class="info-item">
              <img src="./assets/phone.png" alt="phone" />
              <span>(123) 456-7890</span>
            </div>
            <div class="info-item">
              <img src="./assets/mail.png" alt="mail" />
              <span>support@AutoRent.com</span>
            </div>
          </div>

          <div class="contact-form">
            <form @submit.prevent="handleContact">
              <div class="form-group">
                <label>Name</label>
                <input
                  type="text"
                  v-model="contactForm.name"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input
                  type="email"
                  v-model="contactForm.email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div class="form-group">
                <label>Message</label>
                <textarea
                  v-model="contactForm.message"
                  placeholder="Your message..."
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" class="send-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer>
        <div class="footer-content">
          <div class="footer-column">
            <div class="footer-logo">
              <div class="logo-icon">
                <img src="./assets/logo.png" alt="Logo" />
              </div>
              <span>AutoRent</span>
            </div>
            <p>
              Your journey starts here. Rent the perfect car for any occasion.
            </p>
          </div>

          <div class="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>

          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
            <a href="#">Terms of Service</a>
          </div>

          <div class="footer-column">
            <h4>Follow Us</h4>
            <div class="social-links">
              <div class="info-social">
                <img src="./assets/twitter.png" alt="twitter" />
                <a href="#">Twitter</a>
              </div>

              <div class="info-social">
                <img src="./assets/facebook.png" alt="facebook" />
                <a href="#">Facebook</a>
              </div>

              <div class="info-social">
                <img src="./assets/instagram.png" alt="instagram" />
                <a href="#">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 AutoRent. All rights reserved.</p>
        </div>
      </footer>
    </div>

    <!-- Para otras rutas (Login, Register) -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentRoute = computed(() => route.path);

const contactForm = ref({
  name: "",
  email: "",
  message: "",
});

const handleContact = () => {
  console.log("Contact form:", contactForm.value);
  alert("Message sent! We will contact you soon.");
  contactForm.value = { name: "", email: "", message: "" };
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.home-container {
  width: 100%;
  overflow-x: hidden;
}

/* HEADER */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

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

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #dc4a45;
}

.header-buttons {
  display: flex;
  gap: 15px;
}

.login-btn {
  padding: 10px 20px;
  background: transparent;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.login-btn:hover {
  background: #f3f4f6;
}

.signup-btn {
  padding: 10px 20px;
  background: #dc4a45;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.signup-btn:hover {
  background: #c23e39;
}

/* HERO SECTION */
.hero-section {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 90%;
  z-index: 2;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
}

.hero-overlay h1 {
  font-size: 56px;
  margin-bottom: 15px;
  font-weight: 700;
  letter-spacing: -1px;
}

.hero-overlay p {
  font-size: 20px;
  font-weight: 400;
}

/* FLEET SECTION */
.fleet-section {
  padding: 80px 60px;
  background: white;
}

.fleet-section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
  color: #1a1a1a;
}

.fleet-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.fleet-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.fleet-card:hover {
  transform: translateY(-5px);
}

.fleet-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.fleet-card h3 {
  padding: 20px;
  font-size: 20px;
  color: #1a1a1a;
}

.view-all {
  display: block;
  padding: 0 20px 20px;
  color: #dc4a45;
  text-decoration: none;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

/* PROMO SECTION */
.promo-section {
  position: relative;
  height: 400px;
  margin: 40px 60px;
  border-radius: 16px;
  overflow: hidden;
}

.promo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}

.promo-overlay {
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: white;
}

.promo-overlay h2 {
  font-size: 36px;
  margin-bottom: 8px;
}

.promo-overlay p {
  font-size: 18px;
  opacity: 0.9;
}

/* CONTACT SECTION */
.contact-section {
  padding: 80px 60px;
  background: #f9fafb;
}

.contact-section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
  color: #1a1a1a;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-info h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #1a1a1a;
}

.contact-info p {
  color: #6b7280;
  margin-bottom: 30px;
  line-height: 1.6;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  color: #4b5563;
}

.info-item img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icon {
  font-size: 20px;
}

.contact-form .form-group {
  margin-bottom: 20px;
}

.contact-form label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #dc4a45;
}

.send-btn {
  width: 100%;
  padding: 14px;
  background: #dc4a45;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.send-btn:hover {
  background: #c23e39;
}

/* FOOTER */
footer {
  background: rgb(255, 255, 255);
  color: black;
  padding: 60px 60px 30px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin: 0 auto 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.footer-logo .logo-icon {
  width: 35px;
  height: 35px;
}

.footer-logo span {
  font-size: 18px;
  font-weight: 600;
}

.footer-column p {
  color: #414244;
  line-height: 1.6;
}

.footer-column h4 {
  margin-bottom: 20px;
  font-size: 16px;
}

.footer-column a {
  display: block;
  color: #414244;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: #dc4a45;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #374151;
  color: #9ca3af;
}
.info-social {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-social img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.info-social a {
  margin-bottom: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .fleet-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-container {
    grid-template-columns: 1fr;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  header {
    padding: 15px 30px;
  }

  .nav-links {
    display: none;
  }

  .hero-overlay h1 {
    font-size: 36px;
  }

  .fleet-grid {
    grid-template-columns: 1fr;
  }

  .promo-section {
    margin: 20px 30px;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
