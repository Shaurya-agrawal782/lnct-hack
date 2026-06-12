# DisasterConnect Deployment Guide

This guide details the steps required to deploy the DisasterConnect MERN stack application to production hosting platforms.

---

## 🗄️ 1. MongoDB Atlas Setup

DisasterConnect requires a MongoDB instance. For production, utilize a cloud-hosted MongoDB Atlas cluster.

1. **Create an Account / Log In:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Free Tier Cluster:**
   - Choose your preferred cloud provider and region.
   - Click **Create Cluster**.
3. **Configure Database Security:**
   - **Database Access:** Create a database user (e.g. `disasterconnect-user`) and set a strong, random password.
   - **Network Access:** Add an IP address rule:
     - For initial testing, you can add `0.0.0.0/0` (Allow Access from Anywhere).
     - For production security, restrict access to the specific static outgoing IP addresses of your Render backend.
4. **Retrieve Connection String:**
   - Click **Connect** on your database cluster view.
   - Choose **Connect your application (Drivers)**.
   - Select **Node.js** driver (version `latest` or `2.2.12` depending on local DNS support).
   - Copy the SRV string. It will look like:
     `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/disasterconnect?retryWrites=true&w=majority`

---

## 💻 2. Backend Hosting (Render Web Service)

Deploy the Node.js / Express backend using **Render** (or equivalent PaaS).

1. **Create a Web Service:**
   - Connect your GitHub repository to Render.
   - Set **Name** (e.g. `disasterconnect-backend`).
   - Set **Root Directory:** `backend`
   - Set **Language/Runtime:** `Node`
2. **Set Build & Start Configurations:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Configure Environment Variables:**
   - Go to the **Environment** tab on Render and add:
     - `PORT` = `10000` (or leave empty; Render assigns one dynamically)
     - `NODE_ENV` = `production`
     - `CLIENT_URL` = `https://your-frontend-domain.vercel.app` (your deployed frontend URL; can be a comma-separated list of origins)
     - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/disasterconnect?retryWrites=true&w=majority`
     - `JWT_SECRET` = `[Generate a long random cryptographic secret key]`
     - `JWT_EXPIRES_IN` = `1h`
     - `ALLOW_PUBLIC_ROLE_REGISTRATION` = `false`

---

## 🎨 3. Frontend Hosting (Vercel or Render Static Site)

Deploy the React / Vite application using **Vercel** (or Render Static Sites).

1. **Create a Project on Vercel:**
   - Connect your GitHub repository.
   - Set **Framework Preset:** `Vite` (Vercel automatically detects this).
   - Set **Root Directory:** `frontend`
2. **Configure Build & Output Settings:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Configure Environment Variables:**
   - Add the following variable in the Vercel dashboard:
     - `VITE_API_URL` = `https://disasterconnect-backend.onrender.com/api` (the URL of your deployed Render service with `/api` appended)

---

## 🔍 4. Post-Deployment Checklist

After the builds succeed on both platforms, verify functionality:

1. **API Health Check:** Visit `https://your-backend-domain.com/api/health` in a browser. It should return a success JSON payload showing connection to MongoDB.
2. **Citizen Registration & Login:** Create a new Citizen account at the signup screen and log in successfully.
3. **WebSocket Alert Connection:** Inspect the developer tools network log to confirm the Socket.io client connects successfully to the root path of the backend domain.
4. **Leaflet Map Operations:** Access the interactive map page to ensure tiles load correctly and incident icons are drawn.
5. **Logistics Dispatch Flow:** Submit a mock incident as citizen, log in as admin, verify visibility, assign a responder/resources, and confirm the responder can update its status.

---

## 🛠️ Common Errors & Troubleshooting

- **CORS Blocked:**
  - *Symptom:* REST calls fail in browser console with CORS errors.
  - *Fix:* Ensure the `CLIENT_URL` variable in your backend matches your frontend domain *exactly* (including `https://` and no trailing slash).
- **Cookie Not Saved (Cannot Log In):**
  - *Symptom:* Login request returns success, but subsequent calls fail with unauthorized status.
  - *Fix:* Verify `withCredentials: true` is set in the frontend Axios client. Ensure `sameSite: "none"` and `secure: true` are running on the backend cookie settings (which is handled automatically when `NODE_ENV=production`).
- **Socket.io Disconnected / Fails to Connect:**
  - *Symptom:* Console shows polling errors or fails to establish WebSocket protocol.
  - *Fix:* Verify the socket client URI is derived correctly (VITE_API_URL without the `/api` path). Check that the backend has matching CORS configurations for socket origins.
- **MongoDB Connection Failed:**
  - *Symptom:* Backend service fails to start or crashes with connection timeouts.
  - *Fix:* Ensure your current outgoing platform IP is allowlisted on MongoDB Atlas, and the password matches.
- **Atlas SRV/DNS Issue:**
  - *Symptom:* Server logs show `querySrv ECONNREFUSED`.
  - *Fix:* Ensure the database connection URI is correct. If DNS resolution persists, switch from the SRV string to the legacy Node.js driver string structure (`mongodb://` instead of `mongodb+srv://`).

---

## 🔒 Security Requirements

- **Never Expose Secrets:** Do not commit `.env`, `.env.production`, or active credentials to Git repository.
- **Role Control:** Ensure `ALLOW_PUBLIC_ROLE_REGISTRATION=false` in production to prevent public admin creation.
- **Passwords:** Use high-entropy passwords for database users.
