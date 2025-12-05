# Проект «ТИМБИЛДИНГ»

Корпоративный сайт и простая админ-панель для компании, которая проводит онлайн- и офлайн-тимбилдинги.

- Публичная часть: лендинг + страница программы + форма заявки.
- Админка: просмотр и изменение заявок, управление программами.

---

## 1. Стек и структура

### 1.1. Frontend

- React
- React Router
- Redux Toolkit (`site`, `programs`, `requests`)
- Bootstrap 5
- Собственные стили (SCSS/ CSS-токены)

Основные компоненты/страницы:

- `src/app/Layout.jsx` — общий layout (Header + Footer + `<Outlet />`).
- `src/pages/HomePage.jsx` — главная страница.
- `src/pages/ProgramPage.jsx` — страница программы `/programs/:slug`.
- `src/pages/AdminRequestsPage.jsx` — список заявок.
- `src/pages/AdminProgramsPage.jsx` — список программ + форма добавления.
- `src/sections/*` — секции главной:
  - `Hero` — главный баннер, кнопка «Подать заявку».
  - `Goals` — «Основные цели тимбилдинга».
  - `WhyUs` — «Почему выбирают нас».
  - `AboutStory` — блок истории компании (по макету).
  - `ProgramsTeaser` — тизер выездных квестов, подтягивает первую программу.
  - `SignUpForm` — форма «Подать заявку» (отправка на backend).
  - `Contacts` — контакты, телефоны, email.

Маршруты (см. `src/App.jsx`):

- `/` — главная.
- `/programs/:slug` — детальная страница программы.
- `/admin/requests` — админ-страница заявок.
- `/admin/programs` — админ-страница программ.

Авторизации пока нет: доступ в админку открытый (учебный проект).

### 1.2. Backend

- Node.js + Express
- MongoDB + Mongoose

Файлы (папка `server`):

- `server/index.js` — вход backend:
  - подключает `dotenv`, `cors`, `express.json`;
  - подключается к MongoDB через `mongoose.connect(process.env.MONGO_URI)`;
  - поднимает HTTP-сервер на `PORT` (по умолчанию `5001`);
  - регистрирует маршруты `/api/requests` и `/api/programs`.

- `server/models/Program.js` — модель программы:

  ```js
  slug: String     // "hungry-games"
  title: String    // "Голодные игры"
  shortDescription: String
  duration: String
  peopleFrom: Number
  priceFrom: String
  format: String
  goals: [String]
  structure: [String]
  