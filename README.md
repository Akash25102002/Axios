# SupportFlow CRM — Customer Support Ticketing System

SupportFlow CRM is a modern, production-ready, full-stack Customer Support Ticketing application built strictly according to Datastraw Technologies assessment requirements. Inspired by clean, card-based SaaS architectures (such as the **Rhombus Multi-Purpose Dashboard UI Kit**), it empowers support teams to track, search, filter, and resolve customer issues with real-time feedback and persistent audit notes.

---

## 🌟 Live Links & Repository

- **Frontend (Vercel)**: `https://supportflow-crm.vercel.app` *(Ready for production deployment)*
- **Backend API (Render)**: `https://supportflow-api.onrender.com` *(Ready for production deployment)*
- **GitHub Repository**: `https://github.com/Akash25102002/Axios`

---

## 🚀 Key Features

- **Dashboard KPI Metrics**: Real-time cards displaying Total, Open, In Progress, and Closed ticket counts.
- **Sequential Ticket IDs**: Clean, collision-free, human-readable IDs (`TKT-001`, `TKT-002`, `TKT-003`) generated via atomic MongoDB counters.
- **Real-Time Debounced Search**: Multi-field search across customer name, ticket ID, email, subject, and description with a 350ms debounce.
- **Segmented Status Filtering**: Instant filter tabs for All, Open, In Progress, and Closed tickets with live count badges.
- **Two-Column Ticket Details**: Comprehensive layout displaying full issue description, customer contact card, and audit metadata.
- **Chronological Internal Notes**: Interactive activity stream allowing agents to append internal updates and troubleshooting logs.
- **Thoughtful Bonus Feature (Ticket Priority)**:
  - Supports `Low`, `Medium`, and `High` priority levels with distinct color-coded badges.
  - Can be selected at ticket creation time or modified on the ticket details page.
- **Defensive Input Validation & Sanitization**:
  - RFC 5322 email regex verification.
  - Subject minimum length (3 chars, max 200) and description minimum length (10 chars).
  - Prevention of duplicate submissions via button locking and visual spinners.
- **Robust Error & Loading States**:
  - Skeleton loaders for cards and tables.
  - Contextual empty states with clear calls to action.
  - Global centralized error handling hiding stack traces in production.
  - Floating toast notifications for non-intrusive feedback.
- **Fully Responsive SaaS UI**: Tailored layouts for Desktop, Tablet, and Mobile screens.

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18**: Component-driven SPA architecture.
- **Vite**: High-speed build tooling and Hot Module Replacement.
- **Tailwind CSS**: Utility-first styling implementing the Rhombus SaaS design tokens.
- **React Router v6**: Client-side routing (`/`, `/tickets/new`, `/tickets/:ticketId`).
- **Axios**: Centralized HTTP client with interceptors for error transformation.
- **Lucide React**: Crisp, modern icon suite.

### Backend
- **Node.js & Express.js**: REST API server following the Controller-Service-Model architecture.
- **Mongoose ODM**: Schema validation, compound indexing, and lifecycle management.
- **Security Suite**: `helmet` (security HTTP headers), `cors` (cross-origin resource sharing), JSON payload size limits.

### Database
- **MongoDB Atlas**: Managed multi-region cloud database (with zero-config in-memory fallback for local dev/testing).

---

## 📐 System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Client Tier (Vercel)                 │
│   React 18 SPA + Vite + Tailwind CSS + Lucide Icons   │
│   • Dashboard Page    • Create Ticket Page            │
│   • Ticket Details    • Centralized Axios Client      │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                   API Tier (Render)                    │
│   Node.js + Express REST API Server                    │
│   • Security Middleware (Helmet, CORS, JSON Limiter)   │
│   • Validation Middleware & Centralized Error Handler  │
│   • Controller-Service-Model Pattern                   │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│                Database Tier (MongoDB)                 │
│   • Tickets Collection (Indexed: ticketId, status)     │
│   • Notes Collection (Indexed: ticketId, createdAt)    │
│   • Counters Collection (Atomic ID generator)          │
└────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Design

### 1. `Ticket` Collection
```javascript
{
  ticketId: { type: String, required: true, unique: true, index: true }, // e.g. TKT-001
  customerName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  customerEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
  subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
  description: { type: String, required: true, trim: true, minlength: 10 },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open', index: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
**Indexes**:
- `{ ticketId: 1 }` (Unique)
- `{ status: 1, createdAt: -1 }` (Optimizes dashboard queries)
- `{ customerEmail: 1 }` (Fast customer ticket lookup)
- Text Index on `{ ticketId: 'text', customerName: 'text', customerEmail: 'text', subject: 'text', description: 'text' }`

### 2. `Note` Collection
```javascript
{
  ticketId: { type: String, required: true, index: true }, // References Ticket.ticketId
  noteText: { type: String, required: true, trim: true, minlength: 1 },
  createdAt: { type: Date, default: Date.now, index: 1 }
}
```

### 3. `Counter` Collection (Atomic Sequence)
```javascript
{
  _id: { type: String, required: true }, // 'ticketId'
  seq: { type: Number, default: 0 }
}
```

> **Why separate `Note` from `Ticket`? (Interview Talking Point)**:
> In enterprise support software, customer tickets can accumulate hundreds of follow-ups, internal notes, and activity logs over weeks. Embedding notes as an array inside the ticket document can hit MongoDB’s 16MB document size limit and causes document relocation overhead as documents grow. Keeping `Note` in a dedicated collection ensures unbounded scalability, clean pagination, and isolated audit logging.

---

## 📡 REST API Documentation

### 1. Create Ticket
- **Endpoint**: `POST /api/tickets`
- **Request Body**:
  ```json
  {
    "customer_name": "Alice Johnson",
    "customer_email": "alice@example.com",
    "subject": "Unable to log in to dashboard",
    "description": "Getting a 403 Forbidden error after entering 2FA code.",
    "priority": "High"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "ticket_id": "TKT-001",
    "customer_name": "Alice Johnson",
    "customer_email": "alice@example.com",
    "subject": "Unable to log in to dashboard",
    "status": "Open",
    "priority": "High",
    "created_at": "2026-09-25T04:14:50.000Z"
  }
  ```

### 2. List Tickets
- **Endpoint**: `GET /api/tickets`
- **Query Parameters**:
  - `status`: `Open` | `In Progress` | `Closed`
  - `search`: string (matches name, email, ID, subject, or description)
- **Response** (`200 OK`):
  ```json
  [
    {
      "ticket_id": "TKT-001",
      "customer_name": "Alice Johnson",
      "customer_email": "alice@example.com",
      "subject": "Unable to log in to dashboard",
      "status": "Open",
      "priority": "High",
      "created_at": "2026-09-25T04:14:50.000Z"
    }
  ]
  ```

### 3. Dashboard KPI Statistics
- **Endpoint**: `GET /api/tickets/stats`
- **Response** (`200 OK`):
  ```json
  {
    "total": 12,
    "open": 6,
    "in_progress": 4,
    "closed": 2
  }
  ```

### 4. Get Ticket Details
- **Endpoint**: `GET /api/tickets/:ticketId`
- **Response** (`200 OK`):
  ```json
  {
    "ticket_id": "TKT-001",
    "customer_name": "Alice Johnson",
    "customer_email": "alice@example.com",
    "subject": "Unable to log in to dashboard",
    "description": "Getting a 403 Forbidden error after entering 2FA code.",
    "status": "Open",
    "priority": "High",
    "created_at": "2026-09-25T04:14:50.000Z",
    "updated_at": "2026-09-25T04:14:50.000Z",
    "notes": [
      {
        "id": "66f3a...",
        "note_text": "Investigating permissions with security team.",
        "created_at": "2026-09-25T04:14:52.000Z"
      }
    ]
  }
  ```

### 5. Update Ticket & Add Notes
- **Endpoint**: `PUT /api/tickets/:ticketId`
- **Request Body**:
  ```json
  {
    "status": "In Progress",
    "priority": "High",
    "notes": "Customer confirmed they can now access staging environment."
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "updated_at": "2026-09-25T04:14:53.000Z",
    "ticket": {
      "ticket_id": "TKT-001",
      "status": "In Progress",
      "priority": "High"
    },
    "note": {
      "id": "66f3b...",
      "note_text": "Customer confirmed they can now access staging environment.",
      "created_at": "2026-09-25T04:14:53.000Z"
    }
  }
  ```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```bash
PORT=5000
NODE_ENV=development
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/supportflow?retryWrites=true&w=majority
# Frontend URL for CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```bash
# Backend API Base URL (without trailing slash)
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Setup & Quickstart

### Prerequisites
- Node.js >= 18
- npm >= 9

### One-Command Start
Run from the root directory:
```bash
# 1. Start both backend and frontend concurrently
npm run dev
```
- Frontend will open at: `http://localhost:5173`
- Backend API will run at: `http://localhost:5000`

### Or Run Individually

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Automated Testing Verification

SupportFlow includes an automated integration test suite covering all 21 key test scenarios:

```bash
npm run test:api
```

### Test Results Output:
```text
--- Starting SupportFlow CRM API Automated Tests ---

 PASS: Health check endpoint returns 200
 PASS: POST /api/tickets rejects empty body with 400
 PASS: POST /api/tickets rejects invalid email format
 PASS: POST /api/tickets rejects description < 10 chars
 PASS: Create Ticket 1 generates TKT-001 with High priority
 PASS: Create Ticket 2 generates sequential TKT-002
 PASS: Create Ticket 3 generates sequential TKT-003
 PASS: GET /api/tickets returns array of tickets
 PASS: Search tickets by name works
 PASS: Search tickets by ID works
 PASS: Search tickets by description keyword works
 PASS: GET /api/tickets/stats returns correct counts
 PASS: GET /api/tickets/TKT-001 returns ticket details with notes array
 PASS: GET /api/tickets/TKT-999 returns 404 Not Found
 PASS: PUT /api/tickets/TKT-001 updates status to In Progress
 PASS: PUT /api/tickets/TKT-001 adds note 1
 PASS: PUT /api/tickets/TKT-001 adds note 2
 PASS: GET /api/tickets/TKT-001 returns both appended notes in chronological order
 PASS: PUT /api/tickets/TKT-001 updates status to Closed
 PASS: Filter by Closed returns TKT-001
 PASS: Filter by Open returns only Open tickets

========================================
 API Tests Completed: 21 PASSED, 0 FAILED
========================================
```

---

## 🌟 Bonus Feature: Ticket Priority

### Product Rationale
Customer support teams face varying severity levels: a production outage requires immediate attention, while a feature inquiry can wait. By implementing **Ticket Priority** (`Low`, `Medium`, `High`):
- Support teams can instantly triage blockers visually using color-coded badge chips (Rose for High, Amber for Medium, Blue for Low).
- The priority is selectable during ticket submission and can be modified as an issue escalates or de-escalates on the ticket details page.
- Priority is indexed in MongoDB (`{ priority: 1 }`) to support future SLA sorting and escalation queues.

---

## 🚀 Deployment Instructions

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist `0.0.0.0/0` under Network Access.
3. Obtain your connection string: `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/supportflow?retryWrites=true&w=majority`.

### 2. Backend (Render)
1. Push repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `CLIENT_URL`: `https://supportflow-crm.vercel.app`

### 3. Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variable:
   - `VITE_API_URL`: `https://supportflow-api.onrender.com/api`
4. Deploy! `client/vercel.json` already contains the SPA routing configuration to handle client-side routing on page refresh.

---

## 🎥 3–5 Minute Demo Video Script & Walkthrough

| Timestamp | Section | Talking Points & Actions |
|---|---|---|
| **0:00 - 0:45** | **Introduction & Problem Statement** | • Introduce SupportFlow CRM: a production-ready customer support platform designed for high-efficiency support teams.<br>• Highlight tech stack: React 18, Vite, Tailwind CSS, Node.js, Express, MongoDB.<br>• Point out the Rhombus-inspired design: clean KPI cards, responsive layout, clear status badges. |
| **0:45 - 1:45** | **Dashboard & Core Interaction** | • Demonstrate the 4 KPI metric cards (Total, Open, In Progress, Closed).<br>• Show live, debounced search (`useDebounce` hook): typing "John" or "TKT-001" queries backend immediately.<br>• Demonstrate status filters: toggle between Open, In Progress, and Closed.<br>• Show empty states and table skeleton loading animations. |
| **1:45 - 2:45** | **Create Ticket & Validation** | • Click "+ Create Ticket".<br>• Demonstrate defensive validation: empty submit shows inline error alerts; invalid email triggers regex alert; short description triggers min-length check.<br>• Fill out valid details with `High` priority.<br>• Submit ticket: show spinner locking duplicate clicks, floating toast message with generated `TKT-001`, and automatic redirect. |
| **2:45 - 3:45** | **Ticket Details, Status & Notes** | • Inspect 2-column details view: customer contact card, timestamps, issue description.<br>• Change status from `Open` to `In Progress` and click Save.<br>• Add an internal note in the activity feed: "Spoke with user, verifying log traces". Show real-time chronological append.<br>• Change status to `Closed` to complete the ticket lifecycle. |
| **3:45 - 4:30** | **Architecture & Engineering Highlights** | • Explain atomic counter pattern for sequential `TKT-XXX` IDs avoiding race conditions.<br>• Explain why `Note` is modeled as a separate collection (unbounded growth protection).<br>• Mention production security: Helmet headers, CORS policies, Express payload limit, and hidden stack traces. |

---

## 🏆 Final Quality & Assessment Checklist

- [x] **Frontend works**: React 18 + Vite SPA builds cleanly (`vite build` succeeded with zero errors).
- [x] **Backend works**: Express REST server running with clean routes, controllers, and services.
- [x] **MongoDB works**: Connected with Mongoose, schemas, compound and text indexes.
- [x] **Ticket creation works**: POST `/api/tickets` with atomic `TKT-001` generation.
- [x] **Ticket listing works**: GET `/api/tickets` returns formatted payload.
- [x] **Search works**: Multi-field search across ID, name, email, subject, description.
- [x] **Status filtering works**: Open, In Progress, Closed filters verified.
- [x] **Ticket details work**: Full view with metadata and related notes.
- [x] **Status update works**: PUT `/api/tickets/:ticketId` updates status and timestamps.
- [x] **Notes work**: Chronological timeline feed + add note capability verified.
- [x] **Priority bonus feature**: Low, Medium, High supported in creation and details.
- [x] **Validation works**: Email regex, min-length checks, empty field rejections (HTTP 400).
- [x] **Error handling works**: Centralized middleware; 404 on non-existent tickets; no stack traces leaked.
- [x] **Responsive design works**: Desktop table and mobile card layouts.
- [x] **Environment variables configured**: `.env.example` files provided for client and server.
- [x] **No secrets committed**: `.gitignore` configured properly.
- [x] **Production build succeeds**: `client/dist` generated cleanly.
- [x] **Deployment configuration ready**: `vercel.json` and `render.yaml` provided.
- [x] **Demo video script prepared**: 3–5 minute script with timestamped talking points.
