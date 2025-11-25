<template>
  <div class="requests-page">
    <div class="page-header">
      <h1>Запросы на перевозку</h1>
      <button v-if="userRole === 'buyer'" @click="showCreateForm = true" class="btn btn-primary">
        + Создать запрос
      </button>
    </div>

    <!-- Форма создания запроса -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <div class="modal-content" @click.stop>
        <h2>Новый запрос</h2>
        <form @submit.prevent="createRequest">
          <div class="form-group">
            <label>Что ищете? *</label>
            <input 
              v-model="newRequest.material" 
              placeholder="Например: Песок строительный, Щебень, Цемент М500"
              required 
            />
          </div>
          <div class="form-group">
            <label>Город доставки *</label>
            <input 
              v-model="newRequest.city" 
              placeholder="Например: Москва, Санкт-Петербург"
              required 
            />
          </div>
          <div class="form-group">
            <label>Откуда (адрес загрузки)</label>
            <input 
              v-model="newRequest.from_location" 
              placeholder="Например: Московская обл., г. Подольск, карьер"
            />
          </div>
          <div class="form-group">
            <label>Куда (адрес доставки)</label>
            <input 
              v-model="newRequest.to_location" 
              placeholder="Например: г. Москва, ул. Строителей, д. 10"
            />
          </div>
          <div class="form-group">
            <label>Объём (тонн) *</label>
            <input 
              type="number" 
              v-model="newRequest.volume" 
              placeholder="Например: 50"
              min="0.01"
              step="0.01"
              required 
            />
          </div>
          <div class="form-group">
            <label>Дополнительная информация</label>
            <textarea 
              v-model="newRequest.description" 
              rows="4"
              placeholder="Укажите дополнительные требования, сроки доставки и т.д."
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Создать запрос</button>
            <button type="button" @click="showCreateForm = false" class="btn btn-secondary">Отмена</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Список запросов -->
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="requests.length === 0" class="no-data">
      <p>Нет запросов. Показываем демо-данные:</p>
    </div>
    <div class="requests-list">
      <div v-for="request in displayRequests" :key="request.id" class="request-card">
        <h3>{{ request.material }}</h3>
        <div class="request-info">
          <p><strong>Город доставки:</strong> {{ extractCity(request.to_location) }}</p>
          <p><strong>Маршрут:</strong> {{ request.from_location }} → {{ request.to_location }}</p>
          <p><strong>Объём:</strong> {{ request.volume }} тонн</p>
          <p><strong>Статус:</strong> <span :class="`status-${request.status}`">{{ getStatusText(request.status) }}</span></p>
          <p v-if="request.description"><strong>Описание:</strong> {{ request.description }}</p>
        </div>
        <div class="request-meta">
          <small v-if="request.user_company"><strong>Заказчик:</strong> {{ request.user_company }}</small>
          <small>Создано: {{ formatDate(request.created_at) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { demoRequests } from '../services/demoData'

export default {
  name: 'Requests',
  setup() {
    const store = useStore()
    
    const showCreateForm = ref(false)
    const newRequest = ref({
      material: '',
      city: '',
      from_location: '',
      to_location: '',
      volume: '',
      description: ''
    })

    const requests = computed(() => store.getters['requests/allRequests'])
    const loading = computed(() => store.getters['requests/isLoading'])
    const userRole = computed(() => store.getters['auth/userRole'])

    // Показываем реальные данные или демо
    const displayRequests = computed(() => {
      return requests.value.length > 0 ? requests.value : demoRequests
    })

    const createRequest = async () => {
      try {
        // Формируем адрес доставки из города и адреса
        const toLocation = newRequest.value.to_location 
          ? `${newRequest.value.to_location}` 
          : `г. ${newRequest.value.city}`
        
        const fromLocation = newRequest.value.from_location || `г. ${newRequest.value.city}`
        
        const requestData = {
          material: newRequest.value.material,
          from_location: fromLocation,
          to_location: toLocation,
          volume: parseFloat(newRequest.value.volume),
          description: newRequest.value.description || null
        }
        
        await store.dispatch('requests/createRequest', requestData)
        showCreateForm.value = false
        newRequest.value = {
          material: '',
          city: '',
          from_location: '',
          to_location: '',
          volume: '',
          description: ''
        }
      } catch (err) {
        alert('Ошибка создания запроса: ' + (err.message || 'Неизвестная ошибка'))
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU')
    }

    const getStatusText = (status) => {
      const statusMap = {
        'open': 'Открыт',
        'in_progress': 'В работе',
        'closed': 'Закрыт'
      }
      return statusMap[status] || status
    }

    const extractCity = (location) => {
      if (!location) return 'Не указан'
      // Пытаемся извлечь город из адреса
      const cityMatch = location.match(/г\.\s*([^,]+)/i) || location.match(/([А-ЯЁ][а-яё]+)/)
      return cityMatch ? cityMatch[1] : location.split(',')[0]
    }

    onMounted(() => {
      store.dispatch('requests/fetchRequests')
    })

    return {
      showCreateForm,
      newRequest,
      requests,
      displayRequests,
      loading,
      userRole,
      createRequest,
      formatDate,
      getStatusText,
      extractCity
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 200;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 400;
  font-size: 0.95rem;
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

.btn-primary:hover {
  background: var(--accent-gold-hover);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-gold);
  color: var(--text-primary);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-elegant);
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
}

.modal-content h2 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 200;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 300;
}

.requests-list {
  display: grid;
  gap: 2rem;
}

.request-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-soft);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.request-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elegant);
  border-color: rgba(212, 175, 55, 0.3);
}

.request-card:hover::before {
  transform: scaleX(1);
}

.request-card h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: -0.01em;
}

.request-info p {
  margin: 0.75rem 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}

.request-info strong {
  color: var(--text-primary);
  font-weight: 400;
  letter-spacing: 0.02em;
}

.status-open {
  color: #4ade80;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.status-closed {
  color: var(--text-muted);
}

.status-in_progress {
  color: var(--accent-gold);
  font-weight: 400;
  letter-spacing: 0.02em;
}

.request-meta {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
}

.request-meta strong {
  color: var(--text-secondary);
  font-weight: 400;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid var(--card-border);
  font-weight: 300;
}
</style>

