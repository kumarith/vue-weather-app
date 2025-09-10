# 🌤️ Vue Weather App

A sleek and responsive weather application built with **Vue 3**, styled using **TailwindCSS**, and tested with **Playwright**. This project also includes a GitHub Actions CI workflow to run end-to-end tests on every push and pull request to the `main` branch.

---

## 🚀 Features

- 🔍 Get current weather data using **Axios**
- ⚡ Fast development with **Vite**
- 🎨 Beautiful UI powered by **TailwindCSS**
- ✅ End-to-end testing with **Playwright**
- 🔁 Continuous integration using **GitHub Actions**

---

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Playwright](https://playwright.dev/)
- [GitHub Actions](https://github.com/features/actions)

---

## 📦 Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/kumarith/vue-weather-app
cd weather

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview

- App will be available at http://localhost:5173 by default.

---

## Playwright E2E

# Install Playwright dependencies and browsers
npx playwright install --with-deps

# Run tests
npm run test:e2e

# View tedts report
npx playwright show-report

---

## GithubActions CI Workflow 

- This project includes a CI pipeline that:
- Runs on push and pull_request to the main branch
- Installs Node.js and project dependencies
- Runs Playwright E2E tests
- Uploads Playwright test reports

---

## 🔮 Future Plans

The Vue Weather App is a work in progress. Here are some upcoming improvements and features planned:


- Edge Case Error Handling
  Handle API errors such as invalid responses, rate limits, or network failures more gracefully.

- Expand Test Coverage 
  - Add more Playwright test scenarios.
  - Validate accessibility and responsiveness.

- Internationalization (i18n)
  Support multiple languages and units (e.g., °C vs. °F).

- Deploy to Cloud 
  Host the app using platforms like **Vercel**, **Netlify**, or **GitHub Pages**.


