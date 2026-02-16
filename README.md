# TaskBoard Pro

A complete frontend Task Board application built for internship assignment. Features static login, drag & drop tasks, full persistence, search/filter/sort, and activity tracking.

## Features
- Static login with hardcoded credentials (intern@demo.com / intern123)
- "Remember me" functionality using localStorage/sessionStorage
- Drag & drop tasks between TODO, DOING, DONE columns
- Full task CRUD operations with title, description, priority, due date, tags
- Search by title, filter by priority, sort by due date
- Complete localStorage persistence across browser refresh
- Activity log tracking all user actions
- Reset board with confirmation dialog
- Professional responsive UI with gradients and animations
- Form validation and error handling

## Demo
Deployed at: [YOUR_DEPLOYED_URL_HERE]

**Login Credentials:**
```
Email: intern@demo.com
Password: intern123
```

## Tech Stack
- React 18
- Vite (development)
- Vanilla CSS (inline styles for rapid prototyping)
- HTML5 Drag & Drop API
- localStorage for persistence

## Quick Setup

1. **Clone/Download** the project
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
4. **Open browser:** http://localhost:3000
5. **Login:** intern@demo.com / intern123

## Project Structure
```
src/
├── components/
│   ├── AuthProvider.jsx     # Authentication context
│   └── Login.jsx           # Login page with remember me
├── App.jsx                 # Main TaskBoard application
└── main.jsx               # React entry point
```

## Available Scripts
```bash
npm run dev     # Start dev server (localhost:3000)
npm run build   # Build for production
npm run preview # Preview production build
```

## Deployment
1. **Build:** `npm run build`
2. **Deploy** `dist/` folder to:
   - Vercel (automatic with GitHub)
   - Netlify (drag & drop)
   - Render.com
   - GitHub Pages

## Task Features
- **Create**: Full form with validation (title required)
- **Edit**: Click edit button on any task card
- **Delete**: Trash icon on task cards
- **Move**: Drag tasks between columns
- **Search**: Real-time title filtering
- **Filter**: Priority dropdown (Low/Medium/High/All)
- **Sort**: Due date sorting (empty dates last)

