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
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: var(--shadow-elegant);
  max-width: 900px;
  width: 100%;
  border: 1px solid var(--card-border);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
}

h1 {
  margin: 0 0 3rem 0;
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 200;
  letter-spacing: -0.02em;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--border-color);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item label {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.info-item span {
  font-size: 1.15rem;
  color: var(--text-primary);
  font-weight: 300;
  letter-spacing: 0.01em;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(212, 175, 55, 0.15);
  color: var(--accent-gold);
  border-radius: 6px;
  font-weight: 400;
  letter-spacing: 0.02em;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.columns-draft {
  margin-top: 3rem;
}

.columns-draft h2 {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  color: var(--text-primary);
  font-weight: 200;
  letter-spacing: -0.01em;
}

.columns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.col-card {
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.col-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  background: rgba(255, 255, 255, 0.03);
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.col-card h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 300;
  letter-spacing: -0.01em;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  min-height: 150px;
  font-size: 0.95rem;
  line-height: 1.6;
  transition: all 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.btn-copy {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.btn-copy:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.preview-list {
  margin: 1.25rem 0 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  list-style: none;
  border-left: 2px solid var(--border-color);
  padding-left: 1.5rem;
}

.preview-list li {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
  position: relative;
  padding-left: 1rem;
}

.preview-list li::before {
  content: '•';
  position: absolute;
  left: -0.5rem;
  color: var(--accent-gold);
  font-size: 1.2rem;
  line-height: 1;
}
</style>



