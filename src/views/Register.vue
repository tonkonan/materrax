<template>
  <div class="register-page">
    <div class="register-card">
      <h2>Регистрация</h2>
      <form @submit.prevent="handleRegister">
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
            placeholder="Минимум 6 символов"
          />
        </div>

        <div class="form-group">
          <label for="role">Тип аккаунта</label>
          <select id="role" v-model="form.role" required>
            <option value="">Выберите роль</option>
            <option value="buyer">Покупатель</option>
            <option value="supplier">Поставщик</option>
          </select>
        </div>

        <div class="form-group">
          <label for="company">Название компании</label>
          <input 
            type="text" 
            id="company" 
            v-model="form.company" 
            placeholder="ООО Компания (опционально)"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="login-link">
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const form = ref({
      email: '',
      password: '',
      role: '',
      company: ''
    })
    
    const loading = ref(false)
    const error = ref('')

    const handleRegister = async () => {
      if (form.value.password.length < 6) {
        error.value = 'Пароль должен быть минимум 6 символов'
        return
      }

      loading.value = true
      error.value = ''
      
      try {
        await store.dispatch('auth/register', form.value)
        router.push('/')
      } catch (err) {
        error.value = 'Ошибка регистрации. Возможно, email уже используется'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 0;
}

.register-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: var(--shadow-elegant);
  width: 100%;
  max-width: 550px;
  border: 1px solid var(--card-border);
  position: relative;
  overflow: hidden;
}

.register-card::before {
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

input, select {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d4af37' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
}

select option {
  background: var(--marble-dark);
  color: var(--text-primary);
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

.login-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.login-link a {
  color: var(--accent-gold);
  text-decoration: none;
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: color 0.3s ease;
  position: relative;
}

.login-link a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-gold);
  transition: width 0.3s ease;
}

.login-link a:hover {
  color: var(--accent-gold-hover);
}

.login-link a:hover::after {
  width: 100%;
}
</style>



