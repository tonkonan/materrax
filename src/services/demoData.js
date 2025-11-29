// Демо данные для отображения на фронте (без записи в БД)

export const demoRequests = [
  {
    id: 1,
    material: 'Песок строительный',
    from_location: 'Московская обл., г. Подольск, карьер "Северный"',
    to_location: 'г. Москва, ул. Строителей, д. 10',
    volume: 50.00,
    description: 'Нужен песок для строительства, доставка в течение недели',
    status: 'open',
    created_at: new Date().toISOString(),
    user_email: 'buyer1@test.com',
    user_company: 'ООО "СтройМатериалы"'
  },
  {
    id: 2,
    material: 'Щебень гранитный',
    from_location: 'Ленинградская обл., г. Выборг, карьер "Гранит"',
    to_location: 'г. Санкт-Петербург, пр. Невский, д. 25',
    volume: 30.00,
    description: 'Щебень фракции 20-40 для дорожных работ',
    status: 'open',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_email: 'buyer2@test.com',
    user_company: 'ИП Иванов И.И.'
  },
  {
    id: 3,
    material: 'Цемент М500',
    from_location: 'г. Москва, ул. Промышленная, д. 5',
    to_location: 'г. Москва, ул. Строителей, д. 10',
    volume: 20.00,
    description: 'Цемент в мешках по 50 кг, 400 мешков',
    status: 'in_progress',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user_email: 'buyer1@test.com',
    user_company: 'ООО "СтройМатериалы"'
  }
]

export const demoOffers = [
  {
    id: 1,
    request_id: 1,
    price: 15000.00,
    delivery_time: 3,
    comment: 'Имеем опыт перевозки строительных материалов, все документы в порядке',
    created_at: new Date().toISOString(),
    user_email: 'supplier1@test.com',
    user_company: 'ООО "ТрансЛогистик"',
    material: 'Песок строительный',
    from_location: 'Московская обл., г. Подольск, карьер "Северный"',
    to_location: 'г. Москва, ул. Строителей, д. 10',
    // Данные перевозчика
    supplier: {
      legal_entity_name: 'ООО "ТрансЛогистик"',
      legal_entity_inn: '7702345678',
      address_full: 'г. Москва, ул. Транспортная, д. 15, склад 3',
      address_city: 'Москва',
      address_region: 'Московская область',
      reliability: {
        score: 88,
        status: 'active',
        violations_count: 2,
        verified: true
      }
    }
  },
  {
    id: 2,
    request_id: 1,
    price: 18000.00,
    delivery_time: 5,
    comment: 'Быстрая доставка, работаем 24/7',
    created_at: new Date().toISOString(),
    user_email: 'supplier2@test.com',
    user_company: 'ООО "Быстрая Доставка"',
    material: 'Песок строительный',
    from_location: 'Московская обл., г. Подольск, карьер "Северный"',
    to_location: 'г. Москва, ул. Строителей, д. 10',
    supplier: {
      legal_entity_name: 'ООО "Быстрая Доставка"',
      legal_entity_inn: '7703456789',
      address_full: 'г. Москва, ул. Логистическая, д. 8',
      address_city: 'Москва',
      address_region: 'Московская область',
      reliability: {
        score: 45,
        status: 'active',
        violations_count: 8,
        verified: true
      }
    }
  },
  {
    id: 3,
    request_id: 2,
    price: 12000.00,
    delivery_time: 7,
    comment: 'Самая низкая цена, гарантия качества',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user_email: 'supplier3@test.com',
    user_company: 'ИП Петров П.П.',
    material: 'Щебень гранитный',
    from_location: 'Ленинградская обл., г. Выборг, карьер "Гранит"',
    to_location: 'г. Санкт-Петербург, пр. Невский, д. 25',
    supplier: {
      legal_entity_name: 'ИП Петров Петр Петрович',
      legal_entity_inn: '781345678901',
      address_full: 'г. Санкт-Петербург, ул. Грузовая, д. 12',
      address_city: 'Санкт-Петербург',
      address_region: 'Ленинградская область',
      reliability: {
        score: 60,
        status: 'active',
        violations_count: 5,
        verified: true
      }
    }
  },
  {
    id: 4,
    request_id: 3,
    price: 20000.00,
    delivery_time: 2,
    comment: 'Премиум сервис, страхование груза включено',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user_email: 'supplier4@test.com',
    user_company: 'ООО "Надежный Перевозчик"',
    material: 'Цемент М500',
    from_location: 'г. Москва, ул. Промышленная, д. 5',
    to_location: 'г. Москва, ул. Строителей, д. 10',
    supplier: {
      legal_entity_name: 'ООО "Надежный Перевозчик"',
      legal_entity_inn: '7704567890',
      address_full: 'г. Москва, ул. Надежная, д. 20, офис 10',
      address_city: 'Москва',
      address_region: 'Московская область',
      reliability: {
        score: 98,
        status: 'active',
        violations_count: 0,
        verified: true
      }
    }
  }
]

// Функция для получения цвета надежности
export const getReliabilityColor = (score) => {
  if (score >= 80) return '#27ae60' // зеленый
  if (score >= 60) return '#f39c12' // оранжевый
  return '#e74c3c' // красный
}

// Функция для получения текста надежности
export const getReliabilityText = (score) => {
  if (score >= 80) return 'Высокая надежность'
  if (score >= 60) return 'Средняя надежность'
  return 'Низкая надежность'
}



