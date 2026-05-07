---
📐 Quadrant | Eisenhower Matrix PWA
---

**Quadrant** is a minimalist, high-performance Progressive Web App (PWA) designed to help you master productivity through the **Eisenhower Matrix** method. It allows you to categorize tasks by urgency and importance, ensuring you focus on what truly matters.

🚀 **<a href="https://time-pi-self.vercel.app/" target="_blank" rel="noopener noreferrer">View Live Site</a>**

---

## 💡 How It Works
The Eisenhower Matrix organizes your tasks into four distinct quadrants to help you prioritize your workflow:

1.  **Do (Urgent & Important):** Tasks that need immediate attention.
2.  **Schedule (Important, Not Urgent):** Tasks to be planned for later.
3.  **Delegate (Urgent, Not Important):** Tasks that can be handed off to others.
4.  **Delete (Neither):** Tasks that are distractions and should be removed.

---

## ✨ Key Features
* **Frictionless Capture:** Add tasks quickly with offline-first support.
* **Drag-and-Drop Interface:** Seamlessly move tasks between quadrants or reorder within a list using `dnd-kit`.
* **Reliable Sync:** Real-time synchronization with Supabase and local persistence with Dexie.js.
* **PWA Ready:** Install it on your mobile device or desktop for an app-like experience via Serwist.
* **Dark Mode Support:** Support for light, dark, and system themes with Tailwind CSS v4 and shadcn/ui.
* **WCAG AA Accessible:** Built with accessibility in mind, including full keyboard navigation and screen reader support.

---

## 🛠️ Tech Stack
* **Framework:** <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">Next.js 15</a> (App Router) + TypeScript
* **Styling:** Tailwind CSS v4 + shadcn/ui
* **State Management:** Zustand + TanStack Query v5
* **Database:** Supabase (Auth + Postgres) + Dexie.js (IndexedDB cache)
* **Service Worker:** Serwist
* **Testing:** Vitest + Playwright

---

## 🚀 Getting Started

### Prerequisites
* Node.js (Latest LTS recommended)
* pnpm

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/JesseFlip/time.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd time
   ```
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Run the development server:**
   ```bash
   pnpm dev
   ```
5. **Open the app:** Navigate to `http://localhost:3000` in your browser.

---

## 📸 Preview
![Quadrant Dashboard](/public/screenshots/quadrant_snippet.png)
![Dashboard Overview](/public/screenshots/dashboard.png)

---

## 📄 License
This project is licensed under the MIT License.

---

**Built with ❤️ for productivity seekers.**

