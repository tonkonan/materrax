<template>
  <div class="profile-page">
    <div class="profile-card">
      <h1>Профиль</h1>
      <div class="profile-info">
        <div class="info-item">
          <label>Email:</label>
          <span>{{ user?.email }}</span>
        </div>
        <div class="info-item">
          <label>Роль:</label>
          <span class="role-badge">{{ roleLabel }}</span>
        </div>
        <div v-if="user?.company" class="info-item">
          <label>Компания:</label>
          <span>{{ user.company }}</span>
        </div>
        <div class="info-item">
          <label>Зарегистрирован:</label>
          <span>{{ formatDate(user?.created_at) }}</span>
        </div>
      </div>

      <div class="columns-draft">
        <h2>Черновик полей профиля</h2>
        <div class="columns-grid">
          <div class="col-card">
            <div class="col-header">
              <h3>Для покупателя</h3>
              <button class="btn-copy" @click="copyText(buyerColumns)">Копировать</button>
            </div>
            <textarea
              v-model="buyerColumns"
              rows="8"
              placeholder="Каждая строка — название поля (напр. ИНН, Юр. адрес, Контактное лицо)"
            ></textarea>
            <ul class="preview-list">
              <li v-for="(item, idx) in buyerColumnsList" :key="'b-'+idx">{{ item }}</li>
            </ul>
          </div>
          <div class="col-card">
            <div class="col-header">
              <h3>Для поставщика</h3>
              <button class="btn-copy" @click="copyText(supplierColumns)">Копировать</button>
            </div>
            <textarea
              v-model="supplierColumns"
              rows="8"
              placeholder="Каждая строка — название поля (напр. ИНН, ОГРН, Адрес склада, Кол-во машин)"
            ></textarea>
            <ul class="preview-list">
              <li v-for="(item, idx) in supplierColumnsList" :key="'s-'+idx">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Profile',
  setup() {
    const store = useStore()
    
    const user = computed(() => store.getters['auth/currentUser'])
    
    const roleLabel = computed(() => {
      const role = user.value?.role
      return role === 'buyer' ? 'Покупатель' : role === 'supplier' ? 'Поставщик' : role
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU')
    }

    // Черновики полей (локально, без сохранения)
    const buyerColumns = ref([
      'ИНН',
      'Юридический адрес',
      'Контактное лицо',
      'Телефон',
      'Email',
      'Город доставки по умолчанию'
    ].join('\n'))

    const supplierColumns = ref([
      'ИНН',
      'ОГРН',
      'Юридическое лицо',
      'Адрес склада/базы',
      'Регион работы',
      'Парковка (кол-во машин)',
      'Типы кузовов',
      'Страхование груза'
    ].join('\n'))

    const toList = (text) =>
      text
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)

    const buyerColumnsList = computed(() => toList(buyerColumns.value))
    const supplierColumnsList = computed(() => toList(supplierColumns.value))

    const copyText = async (text) => {
      try {
        await navigator.clipboard?.writeText(text)
      } catch (e) {
        // no-op
      }
    }

    return {
      user,
      roleLabel,
      formatDate,
      buyerColumns,
      supplierColumns,
      buyerColumnsList,
      supplierColumnsList,
      copyText
    }
  }
}
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  max-width: 600px;
  width: 100%;
}

h1 {
  margin: 0 0 2rem 0;
  color: #2c3e50;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  font-size: 1.1rem;
  color: #2c3e50;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-weight: 600;
}

.columns-draft {
  margin-top: 2rem;
}

.columns-draft h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.columns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.col-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.col-card h3 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  background: white;
  min-height: 120px;
}

.btn-copy {
  border: none;
  background: #667eea;
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-copy:hover {
  background: #5568d3;
}

.preview-list {
  margin: 0.75rem 0 0;
  padding-left: 1rem;
  color: #555;
}

.preview-list li {
  margin: 0.25rem 0;
}
</style>



