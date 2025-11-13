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

.offers-list {
  display: grid;
  gap: 1.5rem;
}

.offer-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.offer-header h3 {
  margin: 0;
  color: #2c3e50;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #27ae60;
}

.offer-info p {
  margin: 0.5rem 0;
}

.offer-meta {
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

.supplier-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.supplier-info h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.supplier-details p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.reliability-stats {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.reliability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.reliability-badge {
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.reliability-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.verified-badge {
  color: #27ae60;
  font-weight: 600;
  margin-top: 0.5rem;
}

.status-active {
  color: #27ae60;
  font-weight: 600;
}
</style>

