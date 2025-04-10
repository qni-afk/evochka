// Импорт необходимых модулей
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import multer from 'multer'; // Для обработки загрузки файлов

// Инициализация приложения express
const app = express();
const PORT = process.env.PORT || 5000;

// Получение путей для работы с файлами
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, 'data');
const publicDir = join(__dirname, '..', 'public');
const circlesDir = join(publicDir, 'circle');

// Создаем директории для хранения данных и видео, если они не существуют
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(circlesDir)) {
  fs.mkdirSync(circlesDir, { recursive: true });
}

// Настройка CORS
const corsOptions = {
  origin: '*', // Разрешаем доступ с любого домена для отладки
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // Отключаем для упрощения
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Парсинг JSON в запросах
app.use(express.static(publicDir)); // Раздача статических файлов

// Настройка multer для обработки загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, circlesDir);
  },
  filename: function (req, file, cb) {
    const circleId = req.params.circleId;
    const ext = file.originalname.split('.').pop();
    cb(null, `circle${circleId}.${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Ограничение размера 100MB
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Разрешены только видео файлы!'), false);
    }
    cb(null, true);
  }
});

// Константа - дата начала отношений (замените на реальную дату)
const RELATIONSHIP_START_DATE = new Date('2023-12-09T00:00:00Z');

// Определение достижений
const achievements = [
  {
    id: 'start',
    title: 'Начало пути',
    description: 'Вы вместе уже 1 день!',
    icon: '✨',
    condition: (days) => days >= 1,
  },
  {
    id: 'week',
    title: 'Первая неделя',
    description: 'Прошла целая неделя вместе!',
    icon: '🗓️',
    condition: (days) => days >= 7,
  },
  {
    id: 'month',
    title: 'Месяц любви',
    description: 'Вы вместе уже месяц!',
    icon: '💖',
    condition: (days) => days >= 30,
  },
  {
    id: '100days',
    title: '100 дней счастья',
    description: 'Сто дней радости и любви!',
    icon: '💯',
    condition: (days) => days >= 100,
  },
  {
    id: 'halfyear',
    title: 'Пол года вместе',
    description: 'Полгода теплых отношений!',
    icon: '☀️',
    condition: (days) => days >= 183,
  },
  {
    id: 'anniversary',
    title: 'Годовщина',
    description: 'Целый год вместе! Поздравляем!',
    icon: '🎉',
    condition: (days) => days >= 365,
  },
];

// Путь к файлу данных пользователя
const getUserDataPath = (userId) => {
  return join(dataDir, `${userId}.json`);
};

// Функция для чтения данных пользователя
const getUserData = (userId) => {
  const filePath = getUserDataPath(userId);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Ошибка чтения файла ${filePath}:`, error);
      return null;
    }
  }
  return null;
};

// Функция для сохранения данных пользователя
const saveUserData = (userId, data) => {
  try {
    const filePath = getUserDataPath(userId);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Ошибка записи файла ${getUserDataPath(userId)}:`, error);
  }
};

// Функция для расчета разблокированных достижений
const calculateUnlockedAchievements = (startDate) => {
  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const unlocked = [];
  achievements.forEach(ach => {
    if (ach.condition(diffDays)) {
      // Рассчитываем дату разблокировки (startDate + необходимое кол-во дней)
      const unlockDate = new Date(startDate);
      const daysToAdd = achievements.find(a => a.id === ach.id).condition.toString().match(/\d+/)[0]; // Получаем число дней из условия
      unlockDate.setDate(startDate.getDate() + parseInt(daysToAdd));

      unlocked.push({
        ...ach,
        unlockedDate: unlockDate.toISOString().split('T')[0] // Форматируем дату
      });
    }
  });
  return unlocked;
};

// Путь к файлу данных кружков
const circlesDataPath = join(dataDir, 'circles.json');

// Функция для чтения данных кружков
const getCirclesData = () => {
  if (fs.existsSync(circlesDataPath)) {
    try {
      const data = fs.readFileSync(circlesDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Ошибка чтения файла ${circlesDataPath}:`, error);
      return [];
    }
  }
  // Возвращаем массив по умолчанию, если файл не существует
  return [
    { id: 1, path: '/circle/circle1.mp4' },
    { id: 2, path: '/circle/circle2.mp4' },
    { id: 3, path: '/circle/circle3.mp4' }
  ];
};

// Функция для сохранения данных кружков
const saveCirclesData = (circles) => {
  try {
    fs.writeFileSync(circlesDataPath, JSON.stringify(circles, null, 2));
    return true;
  } catch (error) {
    console.error(`Ошибка записи файла ${circlesDataPath}:`, error);
    return false;
  }
};

// Маршруты API

// Получение данных пользователя
app.get('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = getUserData(userId);

    if (!userData) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(userData);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Сохранение данных пользователя
app.post('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    // Устанавливаем дату начала отношений, если ее нет
    if (!userData.relationshipStartDate) {
      userData.relationshipStartDate = RELATIONSHIP_START_DATE.toISOString();
    }

    saveUserData(userId, userData);

    res.json({ success: true, message: 'Данные успешно сохранены' });
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление отдельных данных пользователя (PATCH)
app.patch('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    let userData = getUserData(userId);

    if (!userData) {
      userData = {}; // Создаем новый объект, если пользователь не существует
    }

    // Устанавливаем дату начала отношений, если ее нет
    if (!userData.relationshipStartDate) {
      userData.relationshipStartDate = RELATIONSHIP_START_DATE.toISOString();
    }

    userData = { ...userData, ...updates };

    saveUserData(userId, userData);

    res.json({ success: true, message: 'Данные успешно обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Новый эндпоинт для получения достижений
app.get('/api/achievements/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = getUserData(userId);

    // Используем дату начала отношений из данных пользователя или дефолтную
    const startDate = userData && userData.relationshipStartDate
                      ? new Date(userData.relationshipStartDate)
                      : RELATIONSHIP_START_DATE;

    const unlockedAchievements = calculateUnlockedAchievements(startDate);

    res.json(unlockedAchievements);
  } catch (error) {
    console.error('Ошибка при получении достижений:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Новый эндпоинт для загрузки видео кружка
app.post('/api/upload-circle/:circleId', upload.single('video'), (req, res) => {
  try {
    const { circleId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }

    // Формируем путь к видео для фронтенда
    const videoPath = `/circle/circle${circleId}.${req.file.originalname.split('.').pop()}`;

    res.json({
      success: true,
      message: 'Видео успешно загружено',
      path: videoPath
    });
  } catch (error) {
    console.error('Ошибка при загрузке видео:', error);
    res.status(500).json({ error: 'Ошибка сервера при загрузке видео' });
  }
});

// Эндпоинт для получения списка кружков
app.get('/api/circles', (req, res) => {
  try {
    const circles = getCirclesData();
    res.json(circles);
  } catch (error) {
    console.error('Ошибка при получении списка кружков:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Эндпоинт для обновления списка кружков
app.post('/api/circles', (req, res) => {
  try {
    const circles = req.body;

    // Проверяем корректность данных
    if (!Array.isArray(circles)) {
      return res.status(400).json({ error: 'Неверный формат данных' });
    }

    // Проверяем, что каждый элемент имеет id и path
    const isValid = circles.every(circle =>
      typeof circle.id === 'number' &&
      typeof circle.path === 'string'
    );

    if (!isValid) {
      return res.status(400).json({
        error: 'Каждый кружок должен иметь числовой id и строковый path'
      });
    }

    // Сохраняем данные
    if (saveCirclesData(circles)) {
      res.json({
        success: true,
        message: 'Список кружков успешно обновлен'
      });
    } else {
      throw new Error('Ошибка при сохранении данных');
    }
  } catch (error) {
    console.error('Ошибка при обновлении списка кружков:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для проверки здоровья API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API работает', timestamp: new Date() });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});