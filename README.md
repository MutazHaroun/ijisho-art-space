# Ijisho Art Space

A full-stack web application for a gallery owner to manage and display paintings and handmade heritage items inspired by Rwandan culture. This platform replaces social-media-based promotion with a professional, centralized digital gallery.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [File Explanations](#file-explanations)
3. [Prerequisites](#prerequisites)
4. [Database Setup](#database-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [API Endpoints](#api-endpoints)
9. [Default Admin Credentials](#default-admin-credentials)

---

## Directory Structure

```
ART2/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── seed.js
│   ├── db/
│   │   ├── index.js
│   │   └── migration.sql
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── controllers/
│   │   ├── galleryController.js
│   │   ├── adminController.js
│   │   └── contactController.js
│   ├── routes/
│   │   ├── gallery.js
│   │   ├── admin.js
│   │   └── contact.js
│   └── uploads/
│       └── .gitkeep
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ArtworkCard.jsx
        │   ├── GalleryGrid.jsx
        │   └── ContactForm.jsx
        └── pages/
            ├── HomePage.jsx
            ├── GalleryPage.jsx
            ├── ArtworkDetail.jsx
            ├── ContactPage.jsx
            └── admin/
                ├── AdminLogin.jsx
                ├── Dashboard.jsx
                └── ArtworkForm.jsx
```

---

## File Explanations

### Root

| File | Purpose |
|------|---------|
| `README.md` | This file. Full project documentation, setup instructions, and file descriptions. |

### Backend (`backend/`)

| File | Purpose |
|------|---------|
| `package.json` | Lists all Node.js backend dependencies and defines scripts (`start`, `dev`, `migrate`, `seed`). |
| `.env.example` | Template for environment variables (database credentials, JWT secret, port). Copy to `.env` and fill in real values. |
| `server.js` | Express application entry point. Configures middleware (CORS, JSON parsing, static file serving), mounts all route groups, and starts the HTTP server. |
| `seed.js` | One-time script to create the initial admin user in the database with a bcrypt-hashed password. |
| `db/index.js` | Creates and exports a PostgreSQL connection pool using the `pg` library and environment variables. |
| `db/migration.sql` | SQL schema file. Creates the `artworks`, `contact_messages`, and `admin_users` tables, custom ENUM types, indexes, and an auto-update trigger for `updated_at`. |
| `middleware/auth.js` | JWT authentication middleware. Extracts the Bearer token from the Authorization header, verifies it, and attaches the decoded user to `req.user`. |
| `middleware/upload.js` | Multer configuration for image uploads. Sets storage destination (`uploads/`), generates unique filenames, filters for image MIME types, and enforces a 5 MB size limit. |
| `controllers/galleryController.js` | Handles public gallery endpoints: fetching all artworks (with optional category/status filters) and fetching a single artwork by ID. |
| `controllers/adminController.js` | Handles admin operations: login (credential check + JWT generation), create artwork, update artwork (with image replacement), and delete artwork (with file cleanup). |
| `controllers/contactController.js` | Handles contact form submission (insert into database) and retrieving all messages for the admin dashboard. |
| `routes/gallery.js` | Express router for public gallery routes: `GET /api/gallery` and `GET /api/gallery/:id`. |
| `routes/admin.js` | Express router for admin routes. `POST /api/admin/login` is public; all other routes (`GET/POST/PUT/DELETE /api/admin/artworks`, `GET /api/admin/messages`) are protected by the auth middleware. |
| `routes/contact.js` | Express router for the public contact endpoint: `POST /api/contact`. |
| `uploads/.gitkeep` | Placeholder to ensure the uploads directory exists in version control. Uploaded images are stored here at runtime. |

### Frontend (`frontend/`)

| File | Purpose |
|------|---------|
| `package.json` | Lists all React frontend dependencies and defines scripts (`start`, `build`). Includes a proxy to the backend for development. |
| `tailwind.config.js` | Tailwind CSS configuration. Extends the default theme with custom `primary` (warm orange) and `accent` (green) color palettes inspired by Rwandan aesthetics. Includes the `@tailwindcss/forms` plugin. |
| `postcss.config.js` | PostCSS configuration that enables Tailwind CSS and Autoprefixer processing. |
| `public/index.html` | HTML shell for the single-page React application. |
| `src/index.js` | React entry point. Renders the root `<App />` component wrapped in `BrowserRouter` for client-side routing. |
| `src/index.css` | Global stylesheet with Tailwind directives (`@tailwind base`, `components`, `utilities`) and base font. |
| `src/App.js` | Main application component. Defines all routes (Home, Gallery, Detail, Contact, Admin Login, Dashboard, Artwork Form) and wraps them with the Navbar and Footer. |
| `src/api/axios.js` | Configured Axios instance pointing at the backend API. Automatically attaches the JWT token from localStorage to every request via an interceptor. |
| `src/components/Navbar.jsx` | Responsive navigation bar with links to Home, Gallery, and Contact. Includes a mobile hamburger menu. |
| `src/components/Footer.jsx` | Site footer with brand info, quick links, and contact details. |
| `src/components/ArtworkCard.jsx` | Card component displaying an artwork thumbnail, title, artist, category badge, status, and price. Links to the detail page. |
| `src/components/GalleryGrid.jsx` | Renders a responsive CSS grid of `ArtworkCard` components. Shows a loading spinner or empty-state message as needed. |
| `src/components/ContactForm.jsx` | Controlled form component for name, email, subject, and message. Posts to the contact API endpoint and shows success/error feedback. |
| `src/pages/HomePage.jsx` | Landing page with a hero banner, "Our Story" section describing Rwandan art and heritage, and a grid of up to 6 featured available artworks. |
| `src/pages/GalleryPage.jsx` | Full gallery page with category (All / Art / Heritage) and status (All / Available / Sold) filter buttons. Fetches artworks based on active filters. |
| `src/pages/ArtworkDetail.jsx` | Single artwork detail page showing the full image, title, artist, category, status, price, description, and an "Inquire" button linking to the contact page. |
| `src/pages/ContactPage.jsx` | Contact page combining the `ContactForm` component with a sidebar showing location, email, business hours, and social media info. |
| `src/pages/admin/AdminLogin.jsx` | Admin login page. Sends credentials to the backend, stores the JWT token in localStorage on success, and redirects to the dashboard. |
| `src/pages/admin/Dashboard.jsx` | Protected admin dashboard. Displays summary stats (total artworks, art count, heritage count, messages), an artworks table with edit/delete actions, and a list of contact messages. Redirects to login if unauthenticated. |
| `src/pages/admin/ArtworkForm.jsx` | Dual-purpose form for creating and editing artworks. Handles image upload with preview, populates fields from existing data when editing, and submits as `multipart/form-data`. |

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or later) — https://nodejs.org/
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or later) — https://www.postgresql.org/download/

---

## Database Setup

1. **Start PostgreSQL** and open a terminal or `psql` shell.

2. **Create the `RWRW` database role and the database:**

   ```bash
   # Connect using your system user (the default on macOS Homebrew installs)
   psql -d postgres
   ```

   ```sql
   CREATE ROLE "RWRW" WITH LOGIN SUPERUSER;
   CREATE DATABASE rwanda_gallery;
   \q
   ```

3. **Run the migration** to create tables and types:

   ```bash
   cd backend
   psql -d rwanda_gallery -f db/migration.sql
   ```

   This creates the `artworks`, `contact_messages`, and `admin_users` tables along with ENUM types and indexes.

---

## Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create your `.env` file** by copying the example:

   ```bash
   cp .env.example .env
   ```

3. **Edit `.env`** with your actual PostgreSQL credentials and a secure JWT secret:

   ```
   PORT=5001
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=RWRW
   DB_PASSWORD=
   DB_NAME=rwanda_gallery
   JWT_SECRET=your_random_secret_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

   > **Note:** Port 5001 is used because macOS AirPlay Receiver (ControlCenter) permanently occupies port 5000. `DB_PASSWORD` is empty for local Homebrew PostgreSQL installs that use peer/trust authentication.

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Seed the admin user:**

   ```bash
   npm run seed
   ```

6. **Start the backend server:**

   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   The API will be available at `http://localhost:5001`.

---

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   The React app will open at `http://localhost:3000` and proxy API requests to `http://localhost:5001`.

---

## Running the Application

To run the full stack locally, open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

Then open your browser to `http://localhost:3000`.

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gallery` | List all artworks (query params: `category`, `status`) |
| `GET` | `/api/gallery/:id` | Get a single artwork by ID |
| `POST` | `/api/contact` | Submit a contact form message |
| `GET` | `/api/health` | Health check |

### Admin (Protected — requires Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Authenticate and receive a JWT token |
| `GET` | `/api/admin/artworks` | List all artworks (admin view) |
| `POST` | `/api/admin/artworks` | Create a new artwork (multipart/form-data with `image` file) |
| `PUT` | `/api/admin/artworks/:id` | Update an artwork (multipart/form-data) |
| `DELETE` | `/api/admin/artworks/:id` | Delete an artwork and its image file |
| `GET` | `/api/admin/messages` | List all contact messages |

---

## Default Admin Credentials

After running `npm run seed`:

- **Username:** `admin`
- **Password:** `admin123`

> Change these in your `.env` file before running the seed script in production.
