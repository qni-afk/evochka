// Импорт необходимых модулей
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Инициализация приложения express
const app = express();
const PORT = process.env.PORT || 5000;

// Получение путей для работы с файлами
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, 'data');

// Создаем директорию для хранения данных, если она не существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Парсинг JSON в запросах

// Путь к файлу данных пользователя
const getUserDataPath = (userId) => {
  return join(dataDir, `${userId}.json`);
};

// Функция для чтения данных пользователя
const getUserData = (userId) => {
  const filePath = getUserDataPath(userId);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return null;
};

// Функция для сохранения данных пользователя
const saveUserData = (userId, data) => {
  const filePath = getUserDataPath(userId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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

    saveUserData(userId, userData);

    res.json({ success: true, message: 'Данные успешно сохранены' });
  } catch (error) {
    console.error('Ошибка при сохранении данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление отдельных данных пользователя
app.patch('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    let userData = getUserData(userId);

    if (!userData) {
      userData = {}; // Создаем новый объект, если пользователь не существует
    }

    // Обновляем только переданные поля
    userData = { ...userData, ...updates };

    saveUserData(userId, userData);

    res.json({ success: true, message: 'Данные успешно обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Эндпоинт для проверки состояния API
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'API работает корректно' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});