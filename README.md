# Git-for-TextEditor

A REST-based web app that brings **version control to a text editor**.  
Built as a **monorepo** with separate `client` (frontend) and `server` (backend).  

---

## What is this project?

This is a web-based text editor that doesn’t just let you write — it **tracks every change you make**.  
Think of it like Git, but built directly into the editor for documents:  

- Every save creates a new version.  
- You can go back to old versions anytime.  
- You can compare differences (diffs) between versions.  
- All data is stored securely with user authentication.  

It’s meant for anyone who wants a **personal version-controlled writing environment** without needing Git commands.  

---

## Project Structure

```

/client    → React (or similar) frontend
/server    → Express/MongoDB backend

````

Keeping frontend and backend neatly separated makes your codebase modular and easier to scale or refactor.

---

## Why This Setup?

- **Separation of concerns**: UI lives in `client`, API logic lives in `server`.
- **One repository, two parts**: No juggling multiple repos, easier to maintain.
- **Flexibility**: You can independently test and deploy frontend or backend if needed.

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/vinishdas/git_for_textEditor.git
cd git_for_textEditor
````

### 2. Install backend dependencies

```bash
cd server
npm install
```

*Sets up your Express/MongoDB API.*

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

*Sets up your frontend build environment.*

### 4. Environment Variables

In `/server`, create a `.env` file with:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 5. Run both servers

* In `/server`:

```bash
npm run dev
```

* In `/client`:

```bash
npm start
```

Now frontend runs on `http://localhost:3000` and backend on `http://localhost:5000`.

---

## Why Use This Stack?

* **React (frontend)** → interactive, responsive UI.
* **Express + MongoDB (backend)** → reliable REST API and data storage.
* **JWT authentication** → stateless, secure login.
* **Monorepo design** → simple to manage and extend.

---

## How Version Control Works

Every save or edit in the editor is treated as a version. You can:

* Save a new version.
* Fetch past versions.
* create branches from the current version 

It’s like having Git built into the editor, but focused on documents.

---

## Future Enhancements

* Rich text formatting (Markdown, styling, images).
* Real-time collaboration (multi-user editing).
* Export to PDF/Markdown.
* Deployment scripts (Docker, Vercel, Heroku)
* diffe viewer
* merging features

---


