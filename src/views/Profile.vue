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
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
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

    return {
      user,
      roleLabel,
      formatDate
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
</style>



