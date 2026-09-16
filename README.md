# ConsistKey

ConsistKey is a habit-tracking app designed to help users build consistency through simple daily progress tracking. Create habits, monitor your streaks, and stay motivated as you work toward your goals.

Access it here: YOUR-VERCEL-URL

## Features

- 🌱 **Create habits** — Add and customize habits you want to build into your routine
- ✅ **Track progress** — Mark habits as completed and keep track of your daily consistency
- 🔥 **Streak tracking** — Monitor your current streaks and stay motivated to maintain them
- 📊 **Progress overview** — View your habit activity and track how consistently you are meeting your goals
- 🗓️ **Daily organization** — Keep your habits organized in one place for easy daily check-ins
- 💾 **Persistent storage** — Save habit data so your progress remains available after refreshing the app
- 📱 **Responsive design** — Use the app across different screen sizes

## Tech stack

- **React** + **TypeScript**
- **Vite** — build tool and development server
- **Tailwind CSS** — styling
- **localStorage** — client-side data persistence

## Project structure

```text
consistkey/
├── index.html              # App entry HTML
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main application component
│   ├── components/         # Reusable UI components
│   ├── styles/             # Styling and global CSS
│   └── ...
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── README.md
