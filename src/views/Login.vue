<template>
  <div class="login-page">
    <div class="login-card">
      <h2>Вход</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            placeholder="your@email.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Пароль</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
            placeholder="Введите пароль"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <p class="register-link">
        Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const form = ref({
      email: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        await store.dispatch('auth/login', form.value)
        router.push('/')
      } catch (err) {
        error.value = 'Неверный email или пароль'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 0;
}

.login-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: var(--shadow-elegant);
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--card-border);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
}

h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 200;
  letter-spacing: -0.02em;
}

.form-group {
  margin-bottom: 1.75rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: var(--accent-gold);
  color: var(--marble-dark);
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-gold-hover);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: rgba(220, 53, 69, 0.15);
  color: #ff6b7a;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid rgba(220, 53, 69, 0.3);
  font-size: 0.9rem;
  letter-spacing: 0.01em;
}

.register-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.register-link a {
  color: var(--accent-gold);
  text-decoration: none;
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: color 0.3s ease;
  position: relative;
}

.register-link a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-gold);
  transition: width 0.3s ease;
}

.register-link a:hover {
  color: var(--accent-gold-hover);
}

.register-link a:hover::after {
  width: 100%;
}
</style>



