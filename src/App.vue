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
}

.main-nav {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-nav .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: white;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #42b983;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.main-footer {
  background: #2c3e50;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}

.main-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-footer p {
  margin: 0;
}
</style>



