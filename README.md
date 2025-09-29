# Mini Dashboard / Task Manager App

A personal dashboard built with React, TypeScript, Vite, and Tailwind CSS.  
Features a local Task Manager and Weather API integration, with modular components for easy expansion.

---

## Features

- **Task Manager**

  - Add, edit, delete, and mark tasks as complete/incomplete
  - Filter tasks (all, completed, pending)
  - Search tasks by keyword
  - Sort tasks by priority

- **Weather Card**

  - Fetches current weather for selected cities using OpenWeatherMap API
  - Uses API to diplay either rainy picture or sunny
  - Displays advice and motivational quotes

- **Modular Design**

  - Easily add new cards/components (e.g., quotes, advice, etc.)

- **Functional Programming**

  - Uses `map`, `filter`, and `reduce` for task operations

- **TypeScript**

  - Strong typing for safety and maintainability

- **ESLint Integration**
  - Enforces code quality and style

---

## Getting Started

### Prerequisites

- Node.js & npm

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage

- Manage your tasks in the Task Manager card.
- View weather and advice in the Weather card.
- Search, filter, and sort tasks for better productivity.

---

## Project Structure

```
src/
  components/
    taskManager.tsx
    weather.tsx
    quote.tsx
    ...
  App.tsx
  main.tsx
  Assets/
    jogging.jpg
    gym.jpg
  ...
```

---

## ESLint & Code Quality

- ESLint is configured for TypeScript and React.
- Common rules: no unused variables, no `any` type, consistent semicolons, React hooks rules.
- Run lint checks:
  ```bash
  npm run lint
  ```

---

## Credits

- [OpenWeatherMap API](https://openweathermap.org/)
- [Quotable API](https://api.quotable.io/)
- [Advice Slip API](https://api.adviceslip.com/)
- [Font Awesome](https://fontawesome.com/)

---

## License

MIT

---

**Made by Sandra Weberg & Lars Munck**
