<template>
  <div class="home">
    <section class="hero">
      <h1>Materrax</h1>
      <p class="subtitle">Платформа для связи покупателей и поставщиков материалов</p>
      <div class="cta-buttons">
        <router-link to="/register" class="btn btn-primary">Начать работу</router-link>
        <router-link to="/requests" class="btn btn-secondary">Посмотреть запросы</router-link>
      </div>
    </section>

    <section class="features">
      <h2>Как это работает</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>Для покупателей</h3>
          <p>Создавайте запросы на перевозку материалов и получайте предложения от поставщиков</p>
        </div>
        <div class="feature-card">
          <h3>Для поставщиков</h3>
          <p>Просматривайте запросы и предлагайте свои услуги по перевозке</p>
        </div>
        <div class="feature-card">
          <h3>Быстро и удобно</h3>
          <p>Находите нужных партнёров за считанные минуты</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  text-align: center;
}

.hero {
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 1rem 0;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
}

.features {
  padding: 2rem 0;
}

.features h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.feature-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}
</style>



