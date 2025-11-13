import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'materrax',
  password: process.env.PGPASSWORD || 'your_password',
  port: process.env.PGPORT || 5432,
})

// Logging
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
)
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
)

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} ${req.method} ${req.url} - IP: ${req.ip}\n`
  accessLogStream.write(log)
  next()
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Test DB connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ success: true, time: result.rows[0].now })
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} DB Error: ${err.message}\n`)
    res.status(500).json({ error: 'Database connection failed' })
  }
})

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' })
    }
    req.user = user
    next()
  })
}

// ========== AUTH ROUTES ==========

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, company } = req.body

    // Валидация
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, пароль и роль обязательны' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' })
    }

    if (role !== 'buyer' && role !== 'supplier') {
      return res.status(400).json({ error: 'Роль должна быть buyer или supplier' })
    }

    // Проверка существующего пользователя
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' })
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10)

    // Создание пользователя
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role, company) VALUES ($1, $2, $3, $4) RETURNING id, email, role, company, created_at',
      [email, passwordHash, role, company || null]
    )

    const user = result.rows[0]

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company: user.company
      },
      token
    })
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Registration error: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка регистрации' })
  }
})

// Логин
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' })
    }

    // Поиск пользователя
    const result = await pool.query(
      'SELECT id, email, password_hash, role, company, created_at FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const user = result.rows[0]

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Успешный вход',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company: user.company,
        created_at: user.created_at
      },
      token
    })
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Login error: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка входа' })
  }
})

// Получение текущего пользователя
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, company, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    res.json(result.rows[0])
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Get user error: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка получения пользователя' })
  }
})

// ========== USER ROUTES ==========

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 20')
    res.json(result.rows)
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Error fetching users: ${err.message}\n`)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ========== REQUESTS ROUTES ==========

// Получить все запросы
app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.email as user_email, u.company as user_company
      FROM requests r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Error fetching requests: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка получения запросов' })
  }
})

// Создать запрос (только buyer)
app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ error: 'Только покупатели могут создавать запросы' })
    }

    const { material, from_location, to_location, volume, description } = req.body

    if (!material || !from_location || !to_location || !volume) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    const result = await pool.query(
      `INSERT INTO requests (user_id, material, from_location, to_location, volume, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, material, from_location, to_location, volume, description || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Error creating request: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка создания запроса' })
  }
})

// ========== OFFERS ROUTES ==========

// Получить все предложения
app.get('/api/offers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.email as user_email, u.company as user_company,
             r.material, r.from_location, r.to_location
      FROM offers o
      JOIN users u ON o.user_id = u.id
      JOIN requests r ON o.request_id = r.id
      ORDER BY o.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Error fetching offers: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка получения предложений' })
  }
})

// Создать предложение (только supplier)
app.post('/api/offers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ error: 'Только поставщики могут создавать предложения' })
    }

    const { request_id, price, delivery_time, comment } = req.body

    if (!request_id || !price || !delivery_time) {
      return res.status(400).json({ error: 'ID запроса, цена и срок доставки обязательны' })
    }

    // Проверка существования запроса
    const requestCheck = await pool.query('SELECT id FROM requests WHERE id = $1', [request_id])
    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Запрос не найден' })
    }

    const result = await pool.query(
      `INSERT INTO offers (request_id, user_id, price, delivery_time, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [request_id, req.user.id, price, delivery_time, comment || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    errorLogStream.write(`${new Date().toISOString()} Error creating offer: ${err.message}\n`)
    res.status(500).json({ error: 'Ошибка создания предложения' })
  }
})

// Статические файлы (включая dev режим)
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  // Статические файлы с кешированием
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true
  }))
  
  // КРИТИЧНО: отдельный роут для /assets
  app.use('/assets', express.static(path.join(distPath, 'assets'), {
    maxAge: '1d',
    etag: true
  }))
  
  console.log('✅ Статические файлы подключены из папки dist')
} else {
  console.log('⚠️  Папка dist не найдена. Запустите "npm run build" для создания продакшн версии.')
}

// Статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true
}))

// Catch-all для SPA - все остальные запросы идут на фронтенд
app.get('*', (req, res) => {
  // Если запрос не к API, отдаем index.html
  if (!req.path.startsWith('/api/')) {
    if (fs.existsSync(distPath)) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    } else {
      res.json({
        message: 'Materrax API Server',
        note: 'Запустите "npm run build" для сборки фронтенда',
        api: 'Используйте /api/* для API запросов'
      })
    }
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

// Error handler
app.use((err, req, res, next) => {
  errorLogStream.write(`${new Date().toISOString()} ${err.stack}\n`)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Materrax server запущен на порту ${PORT}`)
  console.log(`📦 Доступен по адресу: http://0.0.0.0:${PORT}`)
})

