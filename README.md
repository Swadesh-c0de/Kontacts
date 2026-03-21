# **Kontacts**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?style=flat-square&logo=framer)](https://framer.com/motion)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

A minimal, high-performance contact management dashboard. Built for elegance, **Kontacts** provides a fluid, compact interface for managing your professional and personal network.

---

### Key Features

- **Full CRUD Management**: Seamlessly add, view, edit, and delete contacts with instant state updates.
- **Smart Filtering & Sorting**: Ultra-fast search bar using `useDeferredValue` and a multi-sort engine (Name/Email) for instant organization.
- **Search Experience**: Professional search loading indicators, including a subtle spinner and a pulsing progress bar.
- **Smart Pagination**: A smooth, responsive, and monochromatic pagination system to navigate long contact lists with a modern "Page X of Y" counter.
- **Complete Profile Control**: Dedicated profile management for updating credentials, changing passwords, and secure account deletion with integrated modal experiences.
- **Resilient Networking**: Automatic rate-limit detection and gracefully handled backend validations across all forms.
- **Mobile First**: Fully responsive architecture optimized for low-latency scrolling and touch interactions, featuring dual-pagination for easy mobile navigation.
- **Theme Toggle**: Automatic theme switching between light and dark mode with a smooth glassmorphic transition.

---

### Design Philosophy: "Compact & Fluid"

Kontacts is inspired by high-end design portfolios. It prioritizes:
1. **Density**: Reducing white space without sacrificing clarity—making it perfect for power users.
2. **Smoothness**: Using `cubic-bezier(0.23, 1, 0.32, 1)` easing across all transitions for a "buttery" feel.
3. **Consistency**: A unified Glassmorphism aesthetic using subtle blurs and border-transparencies.

---

### Technical Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components where applicable).
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust, type-safe development.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom utility-first glassmorphism tokens.
- **Animations**: [Framer Motion](https://framer.com/motion) (StaggerContainer, FadeUp, and Spring variants).
- **Networking**: [Axios](https://axios-http.com/) with a specialized API wrapper for token-based authentication.
- **Icons**: [Lucide React](https://lucide.dev/) for a clean, consistent icon set.

---

### 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (Layouts, Pages, Globals)
├── components/     # Reusable UI & Motion primitives (Button, Input, FadeUp, etc.)
└── lib/            # Shared utilities and API configuration
```

---

### Development Setup

1. **Clone & Install:**
   ```bash
   git clone https://github.com/Swadesh-c0de/Kontacts.git
   cd Kontacts
   npm install
   ```

2. **Configure Environment:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-url.com/api
   ```

3. **Launch Dev Server:**
   ```bash
   npm run dev
   ```

---

**[Visit Live App →](https://kontacts.vercel.app)**  
**[Backend Repository →](https://github.com/Swadesh-c0de/contacts-management-system-backend)**