<template>
  <div id="app">
    <nav class="main-nav">
      <div class="container">
        <router-link to="/" class="logo">
          <h1>Materrax</h1>
        </router-link>
        <div class="nav-links">
          <router-link to="/">Главная</router-link>
          <router-link to="/requests">Запросы</router-link>
          <router-link to="/offers">Предложения</router-link>
          <router-link v-if="!isAuthenticated" to="/login">Вход</router-link>
          <router-link v-if="!isAuthenticated" to="/register">Регистрация</router-link>
          <router-link v-if="isAuthenticated" to="/profile">Профиль</router-link>
          <button v-if="isAuthenticated" @click="logout" class="btn-logout">Выход</button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="main-footer">
      <div class="container">
        <p>&copy; 2025 Materrax. Платформа перевозок материалов.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

    const logout = () => {
      store.dispatch('auth/logout')
      router.push('/login')
    }

    return {
      isAuthenticated,
      logout
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-nav {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: var(--text-primary);
  padding: 1.25rem 0;
  box-shadow: var(--shadow-soft);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.main-nav .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: var(--text-primary);
}

.logo h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 200;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 400;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-gold);
  transition: width 0.3s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--text-primary);
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

.btn-logout {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-gold);
  color: var(--text-primary);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
}

.main-footer {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: var(--text-muted);
  padding: 2rem 0;
  text-align: center;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.main-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.main-footer p {
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  font-weight: 300;
}
</style>



