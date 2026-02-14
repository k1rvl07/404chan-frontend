# 404chan Frontend

Анонимный имиджборд на Next.js 15 + React 19 + TypeScript.

## Технологии

- **Next.js 15** — React-фреймворк (App Router)
- **React 19** — UI-библиотека
- **TypeScript 5** — Типизация
- **Tailwind CSS** — Стилизация
- **Ant Design 5** — Базовые UI-компоненты
- **Biome** — Линтер и форматтер
- **Zustand** — Глобальное состояние
- **TanStack Query** — Server state
- **Axios** — HTTP-клиент

## Быстрый старт

### Требования

- Node.js 20+

### Установка

```bash
cd 404chan-frontend

# Устанавливаем зависимости
npm install

# Запуск в режиме разработки
npm run dev

# Продакшен сборка
npm run build

# Запуск продакшена
npm run start
```

## Структура проекта

```
src/
├── app/                    # App Router
│   ├── layout.tsx         # Главный layout
│   └── page.tsx           # Главная страница
├── components/
│   ├── layout/            # Layout компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AppContainer.tsx
│   ├── pages/             # Компоненты страниц
│   │   ├── HomePage.tsx
│   │   ├── BoardPage.tsx
│   │   └── ThreadPage.tsx
│   ├── screens/           # Экраны
│   │   ├── SplashScreen.tsx
│   │   └── ErrorScreen.tsx
│   └── ui/                # Базовые UI компоненты
│       ├── Button.tsx
│       ├── Input.tsx
│       └── MessageCard.tsx
├── stores/                # Zustand сторы
├── services/              # API клиенты
├── providers/             # React providers
├── hooks/                 # Кастомные хуки
├── utils/                 # Утилиты
├── types/                 # TypeScript типы
└── styles/                # Глобальные стили
```

## Импорты

Используйте path aliases через barrel exports:

```typescript
import { Button } from '@components';
import { useSessionStore } from '@stores';
import { api } from '@services';
```

## Линтинг

```bash
# Проверка
npm run biome

# Автоисправление
npm run biome -- --write
```

## API

Бэкенд доступен по адресу: `http://localhost:8080`

## Переменные окружения

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Лицензия

MIT
