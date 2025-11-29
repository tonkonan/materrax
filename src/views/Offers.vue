<template>
  <div class="offers-page">
    <div class="page-header">
      <h1>Предложения</h1>
      <button v-if="userRole === 'supplier'" @click="showCreateForm = true" class="btn btn-primary">
        + Создать предложение
      </button>
    </div>

    <!-- Форма создания предложения -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <div class="modal-content" @click.stop>
        <h2>Новое предложение</h2>
        <form @submit.prevent="createOffer">
          <div class="form-group">
            <label>ID запроса</label>
            <input type="number" v-model="newOffer.request_id" required />
          </div>
          <div class="form-group">
            <label>Цена (руб.)</label>
            <input type="number" v-model="newOffer.price" required />
          </div>
          <div class="form-group">
            <label>Срок доставки (дней)</label>
            <input type="number" v-model="newOffer.delivery_time" required />
          </div>
          <div class="form-group">
            <label>Комментарий</label>
            <textarea v-model="newOffer.comment" rows="4"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Создать</button>
            <button type="button" @click="showCreateForm = false" class="btn btn-secondary">Отмена</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Список предложений -->
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="offers.length === 0" class="no-data">
      <p>Нет предложений. Показываем демо-данные:</p>
    </div>
    <div class="offers-list">
      <div v-for="offer in displayOffers" :key="offer.id" class="offer-card">
        <div class="offer-header">
          <h3>Предложение #{{ offer.id }}</h3>
          <span class="price">{{ formatPrice(offer.price) }} ₽</span>
        </div>
        
        <div class="offer-info">
          <p><strong>Материал:</strong> {{ offer.material }}</p>
          <p><strong>Маршрут:</strong> {{ offer.from_location }} → {{ offer.to_location }}</p>
          <p><strong>Срок доставки:</strong> {{ offer.delivery_time }} дней</p>
          <p v-if="offer.comment"><strong>Комментарий:</strong> {{ offer.comment }}</p>
        </div>

        <!-- Информация о перевозчике -->
        <div v-if="offer.supplier" class="supplier-info">
          <h4>Перевозчик</h4>
          <div class="supplier-details">
            <p><strong>Юр лицо:</strong> {{ offer.supplier.legal_entity_name }}</p>
            <p><strong>ИНН:</strong> {{ offer.supplier.legal_entity_inn }}</p>
            <p><strong>Адрес:</strong> {{ offer.supplier.address_full }}</p>
            <p><strong>Город:</strong> {{ offer.supplier.address_city }}, {{ offer.supplier.address_region }}</p>
          </div>

          <!-- Статистика надежности -->
          <div v-if="offer.supplier.reliability" class="reliability-stats">
            <div class="reliability-header">
              <strong>Надежность перевозчика:</strong>
              <span 
                class="reliability-badge"
                :style="{ color: getReliabilityColor(offer.supplier.reliability.score) }"
              >
                {{ offer.supplier.reliability.score }}/100
              </span>
            </div>
            <div class="reliability-details">
              <p>
                <span :style="{ color: getReliabilityColor(offer.supplier.reliability.score) }">
                  {{ getReliabilityText(offer.supplier.reliability.score) }}
                </span>
              </p>
              <p><strong>Нарушений:</strong> {{ offer.supplier.reliability.violations_count }}</p>
              <p><strong>Статус:</strong> 
                <span :class="`status-${offer.supplier.reliability.status}`">
                  {{ offer.supplier.reliability.status === 'active' ? 'Активен' : offer.supplier.reliability.status }}
                </span>
              </p>
              <p v-if="offer.supplier.reliability.verified" class="verified-badge">
                ✓ Проверено в базе юр лиц
              </p>
            </div>
          </div>
        </div>

        <div class="offer-meta">
          <small>Перевозчик: {{ offer.user_company || offer.user_email }}</small>
          <small>Создано: {{ formatDate(offer.created_at) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { demoOffers, getReliabilityColor, getReliabilityText } from '../services/demoData'

export default {
  name: 'Offers',
  setup() {
    const store = useStore()
    
    const showCreateForm = ref(false)
    const newOffer = ref({
      request_id: '',
      price: '',
      delivery_time: '',
      comment: ''
    })

    const offers = computed(() => store.getters['offers/allOffers'])
    const loading = computed(() => store.getters['offers/isLoading'])
    const userRole = computed(() => store.getters['auth/userRole'])

    // Показываем реальные данные или демо
    const displayOffers = computed(() => {
      return offers.value.length > 0 ? offers.value : demoOffers
    })

    const createOffer = async () => {
      try {
        await store.dispatch('offers/createOffer', newOffer.value)
        showCreateForm.value = false
        newOffer.value = {
          request_id: '',
          price: '',
          delivery_time: '',
          comment: ''
        }
      } catch (err) {
        alert('Ошибка создания предложения')
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU')
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price)
    }

    onMounted(() => {
      store.dispatch('offers/fetchOffers')
    })

    return {
      showCreateForm,
      newOffer,
      offers,
      displayOffers,
      loading,
      userRole,
      createOffer,
      formatDate,
      formatPrice,
      getReliabilityColor,
      getReliabilityText
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

.offers-list {
  display: grid;
  gap: 2rem;
}

.offer-card {
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

.offer-card::before {
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

.offer-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elegant);
  border-color: rgba(212, 175, 55, 0.3);
}

.offer-card:hover::before {
  transform: scaleX(1);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.offer-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: -0.01em;
}

.price {
  font-size: 2rem;
  font-weight: 300;
  color: var(--accent-gold);
  letter-spacing: -0.02em;
}

.offer-info p {
  margin: 0.75rem 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}

.offer-info strong {
  color: var(--text-primary);
  font-weight: 400;
  letter-spacing: 0.02em;
}

.offer-meta {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
}

.offer-meta strong {
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

.supplier-info {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border-left: 3px solid var(--accent-gold);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--accent-gold);
}

.supplier-info h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: -0.01em;
}

.supplier-details p {
  margin: 0.75rem 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.supplier-details strong {
  color: var(--text-primary);
  font-weight: 400;
}

.reliability-stats {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.reliability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reliability-header strong {
  color: var(--text-primary);
  font-weight: 400;
  font-size: 1rem;
}

.reliability-badge {
  font-size: 1.25rem;
  font-weight: 300;
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.reliability-details p {
  margin: 0.75rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.reliability-details strong {
  color: var(--text-primary);
  font-weight: 400;
}

.verified-badge {
  color: #4ade80;
  font-weight: 400;
  margin-top: 0.75rem;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.status-active {
  color: #4ade80;
  font-weight: 400;
  letter-spacing: 0.02em;
}
</style>

