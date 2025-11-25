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
  padding: 6rem 2rem;
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  margin-bottom: 5rem;
  box-shadow: var(--shadow-elegant);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.hero h1 {
  font-size: 4rem;
  margin: 0 0 1.5rem 0;
  font-weight: 200;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: var(--text-secondary);
  font-weight: 300;
  letter-spacing: 0.01em;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.btn {
  padding: 1rem 2.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 400;
  font-size: 1rem;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  border: 1px solid transparent;
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

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.btn-primary {
  background: var(--accent-gold);
  color: var(--marble-dark);
  border-color: var(--accent-gold);
}

.btn-primary:hover {
  background: var(--accent-gold-hover);
  border-color: var(--accent-gold-hover);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.features {
  padding: 3rem 0;
}

.features h2 {
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 200;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.feature-card {
  padding: 3rem 2.5rem;
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  transition: all 0.4s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
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

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-elegant);
  border-color: rgba(212, 175, 55, 0.3);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: -0.01em;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.01em;
}
</style>



