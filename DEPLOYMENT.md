# Deployment Guide for Witcet

This guide covers how to deploy the three parts of your application:
1.  **Backend** (`witcet - admin/backend`) -> **Render**
2.  **Frontend Admin** (`witcet - admin/frontend - admin`) -> **Vercel**
3.  **Witcet Site** (`witcet - admin/witcet - site`) -> **Vercel**

## Prerequisites

1.  **GitHub Repository**: Ensure your entire project (`witcet - admin`) is pushed to a single GitHub repository.
2.  **Accounts**:
    *   [Render Account](https://render.com/)
    *   [Vercel Account](https://vercel.com/)
    *   [MongoDB Atlas](https://www.mongodb.com/atlas) (Ensure your IP access list allows `0.0.0.0/0` for cloud access).
    *   [Cloudinary](https://cloudinary.com/) (For images).

---

## Part 1: Deploy Backend to Render

1.  Log in to your **Render Dashboard**.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `witcet-backend` (or similar)
    *   **Region**: Choose strictly closest to your users (e.g., Singapore/Mumbai if in Asia).
    *   **Root Directory**: `backend` (Important! This tells Render to look inside the backend folder).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables** (Scroll down to "Advanced" or "Environment"):
    *   Add key-value pairs from your backend `.env` file:
        *   `MONGODB_URI`: `your_mongodb_connection_string`
        *   `JWT_SECRET`: `your_secret_key`
        *   `CLOUDINARY_CLOUD_NAME`: `...`
        *   `CLOUDINARY_API_KEY`: `...`
        *   `CLOUDINARY_API_SECRET`: `...`
        *   `PORT`: `5000` (Render will override this automatically, but good to have fallback).
6.  Click **Create Web Service**.
7.  **Wait for deployment**. Once live, copy the **Render URL** (e.g., `https://witcet-backend.onrender.com`). You will need this for the frontends.

---

## Part 2: Deploy Frontend Admin to Vercel

1.  Log in to your **Vercel Dashboard**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Project Name**: `witcet-admin`
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend - admin`.
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your **Render Backend URL** (e.g., `https://witcet-backend.onrender.com`).
        *   *Note: Ensure no trailing slash `/` at the end unless your code expects it.*
6.  Click **Deploy**.
7.  Vercel will build and deploy. Once done, you'll get a URL (e.g., `https://witcet-admin.vercel.app`).

---

## Part 3: Deploy Witcet Site to Vercel

1.  Go back to **Vercel Dashboard**.
2.  Click **Add New...** -> **Project**.
3.  Import the **SAME** GitHub repository again.
4.  Configure the project:
    *   **Project Name**: `witcet-site`
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `witcet - site`.
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your **Render Backend URL** (e.g., `https://witcet-backend.onrender.com`).
6.  Click **Deploy**.
7.  You'll get a URL (e.g., `https://witcet-site.vercel.app`).

---

## Final Steps: Update Backend CORS

Once you have your frontend URLs, you verify your Backend allows them.
1.  Check `backend/server.js`.
2.  Currently, `app.use(cors())` allows ALL origins. This is fine for testing.
3.  For better security later, update it to:
    ```javascript
    app.use(cors({
      origin: [
        'https://witcet-admin.vercel.app', 
        'https://witcet-site.vercel.app',
        'http://localhost:5173'
      ]
    }));
    ```
4.  If you make changes, commit and push to GitHub. Render will auto-redeploy.

## Troubleshooting

*   **White Screen on Frontend**: Check the browser console (F12). If you see CORS errors or 404s on API calls, check your `VITE_API_URL` environment variable.
*   **Images not loading**: Ensure Cloudinary credentials are correct on Render. Local images stored in `backend/images` will NOT persist on Render (free tier spins down/wipes disk). You must use Cloudinary for all uploads.
*   **"Process exited with code 1" on Render**: Check the logs tab. Usually a missing environment variable (like invalid Mongo URI).
