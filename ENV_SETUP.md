# Environment Variables Setup Guide

## Overview
This project uses a single `.env.example` file approach for better maintainability. Follow the instructions below to set up your environment.

---

## 🔧 Development Setup

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd learn_letlearn/backend
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your actual values:
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://letlearn_user:Letlearn%402026@cluster0.ljqghzy.mongodb.net/letlearn?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_letlearn_2024
   JWT_EXPIRE=7d
   
   # Frontend Configuration
   FRONTEND_URL=http://localhost:5173
   
   # Cloudinary (Optional)
   USE_CLOUDINARY=false
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the server:
   ```bash
   npm install
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd learn_letlearn
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with:
   ```env
   VITE_API_URL=http://localhost:5001
   VITE_SOCKET_URL=http://localhost:5001
   VITE_APP_NAME=LetLearn
   VITE_APP_VERSION=1.0.0
   ```

4. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```

---

## 🚀 Production Setup (Vercel)

### Backend Deployment
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add these variables:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://letlearn_user:Letlearn%402026@cluster0.ljqghzy.mongodb.net/letlearn?retryWrites=true&w=majority
   JWT_SECRET=<change_this_to_a_strong_secret>
   FRONTEND_URL=https://your-frontend-url.vercel.app
   USE_CLOUDINARY=false
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   ADMIN_EMAIL=admin@letlearn.com
   ADMIN_PASSWORD=<strong_password>
   ```

3. Redeploy the backend

### Frontend Deployment
1. Go to **Vercel Dashboard** → Your Frontend Project → **Settings** → **Environment Variables**

2. Add these variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   VITE_SOCKET_URL=https://your-backend-url.vercel.app
   VITE_APP_NAME=LetLearn
   VITE_APP_VERSION=1.0.0
   ```

3. Redeploy the frontend

---

## 📋 Environment Variables Reference

### Backend Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `PORT` | Number | Yes | Server port (5001 dev, 3001 prod) |
| `NODE_ENV` | String | Yes | `development` or `production` |
| `MONGODB_URI` | String | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | String | Yes | Secret key for JWT signing (change in production!) |
| `JWT_EXPIRE` | String | Yes | Token expiration time (e.g., `7d`) |
| `FRONTEND_URL` | String | Yes | Frontend URL for CORS configuration |
| `USE_CLOUDINARY` | Boolean | No | Enable cloud file storage |
| `CLOUDINARY_CLOUD_NAME` | String | Conditional | Required if `USE_CLOUDINARY=true` |
| `CLOUDINARY_API_KEY` | String | Conditional | Required if `USE_CLOUDINARY=true` |
| `CLOUDINARY_API_SECRET` | String | Conditional | Required if `USE_CLOUDINARY=true` |
| `ADMIN_EMAIL` | String | No | Admin dashboard email |
| `ADMIN_PASSWORD` | String | No | Admin dashboard password |
| `LOG_LEVEL` | String | No | `debug`, `info`, `warn`, `error` |

### Frontend Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_API_URL` | String | Yes | Backend API base URL |
| `VITE_SOCKET_URL` | String | Yes | Socket.IO server URL (usually same as API URL) |
| `VITE_APP_NAME` | String | No | Application name |
| `VITE_APP_VERSION` | String | No | Application version |

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT_SECRET** in production (at least 32 characters)
3. **Rotate secrets regularly** - Especially in production
4. **Use Vercel's environment variables** for production secrets
5. **Restrict MongoDB IP whitelist** to Vercel IPs only
6. **Change default admin credentials** before deployment
7. **Keep MongoDB password URL-encoded** (@ becomes %40)

---

## ✅ Verification Checklist

- [ ] Backend `.env` created from `.env.example`
- [ ] Frontend `.env.local` created from `.env.example`
- [ ] MongoDB connection string is correct and password is URL-encoded
- [ ] JWT_SECRET is changed in production
- [ ] FRONTEND_URL and VITE_API_URL are correctly set
- [ ] Environment variables added to Vercel dashboard
- [ ] Backend and frontend can communicate without errors
- [ ] Health check endpoint (`/api/health`) responds 200
- [ ] No console errors related to API calls

---

## 🆘 Troubleshooting

### MongoDB Connection Failed
- Check if `MONGODB_URI` is correct
- Verify password is URL-encoded (`@` → `%40`)
- Ensure IP is whitelisted in MongoDB Atlas
- Test locally before deploying to Vercel

### API Returns 404
- Verify `VITE_API_URL` is set correctly in frontend
- Check `FRONTEND_URL` is set in backend
- Ensure backend is deployed and running
- Check Vercel logs for errors

### CORS Errors
- Verify `FRONTEND_URL` in backend matches deployed frontend URL
- Redeploy backend after changing `FRONTEND_URL`
- Check browser console for specific CORS errors

### Socket.IO Connection Issues
- Verify `VITE_SOCKET_URL` matches backend URL
- Check Vercel logs for Socket.IO errors
- Ensure backend has Socket.IO configured

---

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed deployment guide
2. Review Vercel logs in dashboard
3. Test locally before deploying
4. Verify all environment variables are set correctly

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
