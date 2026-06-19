# PrepRoute — Test Creation & Publishing Platform

A React-based admin dashboard for creating, managing, and publishing tests. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Architecture

```
src/
├── main.tsx                  # Entry point — mounts App inside AuthProvider
├── App.tsx                   # Root component — state-driven view router
├── types.ts                  # Shared TypeScript types & interfaces
├── index.css                 # Tailwind theme & global styles
├── api/
│   ├── client.ts             # Axios instance (base URL, auth interceptor, 401 handling)
│   └── endpoints.ts          # Typed API functions (auth, subjects, topics, tests, questions)
├── context/
│   └── AuthContext.tsx        # Auth state (token, user) persisted to localStorage
├── screens/
│   ├── Login.tsx             # Login form (userId + password)
│   ├── Dashboard.tsx         # Test list with search, create/edit/view/delete actions
│   ├── ChapterWise.tsx       # Test metadata form (subject, topics, duration, marking scheme)
│   ├── Workspace.tsx         # Question editor — add/remove/navigate MCQs
│   ├── PreviewPublish.tsx    # Test summary preview with publish action
│   ├── PublishConfig.tsx     # Publish now or schedule with "live until" options
│   └── EditTestModal.tsx     # Modal wrapper around ChapterWise for editing existing tests
├── layout/
│   ├── AppLayout.tsx         # Shell — IconRail + TopNav + content area
│   ├── IconRail.tsx          # Sidebar navigation icons
│   └── TopNav.tsx            # Top bar with breadcrumbs, user avatar, notifications
└── components/
    ├── Button.tsx            # Primary/secondary/danger/ghost button
    ├── Input.tsx             # Labeled text input
    ├── SelectField.tsx       # Styled select with chevron
    ├── Stepper.tsx           # Number input with up/down chevrons
    ├── Modal.tsx             # Overlay modal dialog
    ├── Badge.tsx             # Status/tag pill (amber/green/navy/success)
    └── Logo.tsx              # SVG "PrepRoute" logo
```

### View Routing

Navigation is managed via React state (`AppView` type) in `App.tsx` — no router library is used. The flow is:

```
Login → Dashboard → ChapterWise → Workspace → PublishConfig
                        ↑              ↑
                        └──── Edit ─────┘
                                
Dashboard → PreviewPublish (view published/draft test)
```

### Data Flow

1. **Auth** — `AuthContext` stores JWT in `localStorage`. The Axios interceptor (`client.ts`) attaches it to every request and redirects to login on 401.
2. **Test Creation** — `ChapterWise` collects metadata → calls `createTest` → navigates to `Workspace`.
3. **Questions** — `Workspace` manages a local array of question objects → saves via `createQuestionsBulk` → calls `updateTest` with question IDs.
4. **Publishing** — `PublishConfig` / `PreviewPublish` calls `updateTest` with `status: 'live'`.
5. **Editing** — `Dashboard` fetches test details via `getTestById` → pre-populates `ChapterWise` form state.

### API

All requests go through a Vite dev server proxy:

| Endpoint                         | Method | Description                |
| -------------------------------- | ------ | -------------------------- |
| `/api/auth/login`                | POST   | Login                      |
| `/api/subjects`                  | GET    | List subjects              |
| `/api/topics/subject/:id`        | GET    | Topics by subject          |
| `/api/sub-topics/topic/:id`      | GET    | Sub-topics by topic        |
| `/api/sub-topics/multi-topics`   | POST   | Sub-topics by topic IDs    |
| `/api/tests`                     | GET    | List all tests             |
| `/api/tests/:id`                 | GET    | Get test by ID             |
| `/api/tests`                     | POST   | Create test                |
| `/api/tests/:id`                 | PUT    | Update test                |
| `/api/questions/bulk`            | POST   | Create questions in bulk   |
| `/api/questions/fetchBulk`       | POST   | Fetch questions by IDs     |

## Setup

### Prerequisites

- Node.js >= 18
- npm or yarn

### Install

```bash
cd preproute
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server (default `http://localhost:5173`). API requests to `/api/*` are proxied to the staging backend.

### Build

```bash
npm run build
```

Compiles TypeScript and bundles with Vite into `dist/`.

### Preview

```bash
npm run preview
```

Serves the production build locally.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

## Tech Stack

| Tool             | Purpose            |
| ---------------- | ------------------ |
| React 19         | UI library         |
| TypeScript 6     | Type safety        |
| Vite 8           | Build tool / HMR   |
| Tailwind CSS v4  | Styling            |
| Axios            | HTTP client        |
| Lucide React     | Icons              |
| ESLint           | Code linting       |

## Theme

Custom Tailwind theme defined in `src/index.css` with a purple/blue primary palette (`#5B6FE8`), success/destructive semantic colors, and a clean gray-based neutral scale.
