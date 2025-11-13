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
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #ddd;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.requests-list {
  display: grid;
  gap: 1.5rem;
}

.request-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.request-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.request-info p {
  margin: 0.5rem 0;
}

.status-open {
  color: #27ae60;
  font-weight: 600;
}

.status-closed {
  color: #95a5a6;
}

.request-meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #999;
  display: flex;
  justify-content: space-between;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.status-in_progress {
  color: #f39c12;
  font-weight: 600;
}
</style>

