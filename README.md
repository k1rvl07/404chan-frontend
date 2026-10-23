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

## Запуск

Основной способ запуска — общий dev-стек из родительского репозитория `404chan`:

```bash
git clone --recurse-submodules git@github.com:k1rvl07/404chan.git
cd 404chan
make init
make dev
```

### Автономный запуск

Требования: Node.js 20+.

```bash
cp .env.example .env
npm ci
npm run dev
```

Сборка и запуск продакшена:

```bash
npm run build
npm run start
```

Или через Docker:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Для prod-сборки Next.js переменные `NEXT_PUBLIC_*` передаются как build args:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_WS_URL=wss://api.example.com/ws \
  --build-arg NEXT_PUBLIC_ENV=production \
  -f Dockerfile.prod -t 404chan-frontend .
```

## Структура проекта

```
src/
├── app/                    # App Router
├── components/
│   ├── layout/             # Layout-компоненты
│   ├── pages/              # Компоненты страниц
│   ├── screens/            # Экраны
│   └── ui/                 # Базовые UI-компоненты
├── stores/                 # Zustand-сторы
├── services/               # API-клиенты
├── providers/              # React providers
├── hooks/                  # Кастомные хуки
├── utils/                  # Утилиты
├── types/                  # TypeScript-типы
└── styles/                 # Глобальные стили
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
npm run lint          # проверка
npm run biome         # автоисправление
```

## API

Бэкенд по умолчанию доступен по адресу `http://localhost:8080`.

## Переменные окружения

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_ENV=development
```

## Лицензия

MIT
