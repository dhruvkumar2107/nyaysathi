# Deployment Guide for Nyay-Sathi

Since your project runs AI natively in Node.js, you only need to deploy the **Frontend** and **Backend**. You can do this easily on **Render.com**.

## Option 1: All-in-One on Render.com (Recommended)
Render allows you to deploy Node.js, Python, and Static sites in one place.

### 1. Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster**.
3. Create a User (username/password) and whitelist IP `0.0.0.0/0` (for cloud access).
4. Your connection string is: `mongodb+srv://dhruvkumar21075_db_user:Dhruv%402107@cluster0.iofqvq2.mongodb.net/nyaysathi?retryWrites=true&w=majority`. (Note: The `@` in your password has been encoded to `%40` for URL compatibility).

### 2. Backend (Node.js)
1. Push your code to GitHub.
2. In Render, create a **Web Service**.
3. Connect your repo.
4. **Root Directory**: `server`
5. **Build Command**: `npm install`
6. **Start Command**: `node index.js`
7. **Environment Variables**:
   - `MONGO_URI`: `mongodb+srv://dhruvkumar21075_db_user:Dhruv%402107@cluster0.iofqvq2.mongodb.net/nyaysathi?retryWrites=true&w=majority`
   - `JWT_SECRET`: `super_secret_key_change_later`
   - `GEMINI_API_KEY`: `AIzaSyBPC2rr4TlFJQWZUE5RQVTfCS0NM4isU9E`
   - `RZP_KEY_ID`: `rzp_test_RqBKFFolwTFZtE`
   - `RZP_KEY_SECRET`: `L5tDHXfB5L7BqjtRBgITAMmf`
   - `PYTHON_AI_URL`: (Not Required - AI runs natively in Node.js)

### 3. Frontend (React)
1. In Render, create a **Static Site**.
2. Connect the same repo.
3. **Root Directory**: `client`
4. **Build Command**: `npm install && npm run build`
5. **Publish Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL`: `https://nyaysathi-79nf.onrender.com`

---

## Option 2: Vercel (Frontend) + Render (Backend)

### Frontend (Vercel)
1. Install Vercel CLI or go to Vercel.com.
2. Import repo.
3. **Framework Preset**: Vite.
4. **Root Directory**: `client`.
5. Add Env Var: `VITE_API_URL` = (Your Render Backend URL).

### Backend & Python
Use Render (as described above) because Vercel Serverless functions have 10s timeouts which might be too short for AI/Database operations.
