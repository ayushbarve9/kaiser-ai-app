# Contributing to KAISER AI

Thank you for your interest in contributing to KAISER AI! We welcome contributions from developers, designers, and civic tech enthusiasts.

---

## 💻 Local Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/civic-connect-ai.git
   cd civic-connect-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up local environment variables**:
   Create a `.env` file in the root folder based on `.env.example`:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   ```

4. **Start local development server**:
   ```bash
   npm run dev
   ```

5. **Run TypeScript check**:
   ```bash
   npm run lint
   ```

---

## 📋 Pull Request Guidelines

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Ensure Code Quality**:
   - Write clear, descriptive code comments.
   - Run `npm run lint` and `npm run build` locally before pushing to ensure zero build or type errors.
3. **Submit Your Pull Request**:
   - Push your branch to GitHub and open a Pull Request targeting the `main` branch.
   - Provide a concise description of the changes and screenshots/screen recordings if applicable.

---

## 📜 Code of Conduct

Maintain professional composure, be respectful to fellow contributors, and help build a safer, cleaner civic environment!
