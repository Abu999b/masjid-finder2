# Masjid Finder - Frontend

A React-based web application to find nearby masjids with prayer times, directions, and an admin panel for management.

## 🚀 Features

- **Interactive Map**
  - Leaflet + OpenStreetMap integration (no API key needed!)
  - Real-time geolocation
  - Click markers to view masjid details
  - Click anywhere on map to get coordinates
  - Distance calculation from user location

- **Prayer Times**
  - Display all 5 daily prayers + Jummah
  - Next prayer time indicator
  - Formatted 12-hour time display

- **User Features**
  - Request admin access
  - Request to add new masjids
  - Request to edit masjid details
  - Request to delete masjids
  - Track request status

- **Admin Features**
  - Add/edit masjids (Main Admin only)
  - Submit requests for approval (Regular Admin)
  - Manage users (Main Admin only)
  - Approve/reject requests (Main Admin only)

- **Authentication**
  - JWT-based authentication
  - Role-based access control
  - Persistent login

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone 
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup

Create `.env.local` for local development:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Create `.env.production` for production:
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Important:**
- Environment variables MUST start with `REACT_APP_`
- Rebuild required after changing environment variables
- Never commit `.env` files with sensitive data

### 4. Start the development server
```bash
npm start
```

App will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
frontend/
├── public/
│   ├── index.html                 # HTML template
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Map.js                 # Leaflet map component
│   │   ├── MasjidDetails.js       # Masjid detail modal
│   │   ├── RequestModal.js        # Request submission modal
│   │   ├── ConfirmDialog.js       # Confirmation dialog
│   │   ├── Navbar.js              # Navigation bar
│   │   └── *.css                  # Component styles
│   ├── context/
│   │   └── AuthContext.js         # Authentication state
│   ├── pages/
│   │   ├── Home.js                # Main map view
│   │   ├── Login.js               # Login page
│   │   ├── Register.js            # Registration page
│   │   ├── AdminMasjids.js        # Masjid management
│   │   ├── AdminUsers.js          # User management
│   │   ├── AdminRequests.js       # Request management
│   │   ├── MyRequests.js          # User's request tracking
│   │   └── *.css                  # Page styles
│   ├── services/
│   │   └── api.js                 # API service layer
│   ├── utils/
│   │   └── prayerTimes.js         # Prayer time utilities
│   ├── App.js                     # Main app component
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
├── .env.local                     # Local environment variables
├── .env.production                # Production environment variables
├── .gitignore
├── package.json
├── vercel.json                    # Vercel configuration
└── README.md
```

## 🎨 Key Components

### Map Component (`src/components/Map.js`)
- Powered by Leaflet and React-Leaflet
- Shows user location with blue marker
- Displays masjids with default markers
- Red marker for selected location
- Click anywhere to get coordinates
- Popups with prayer times

### Authentication (`src/context/AuthContext.js`)
- JWT token management
- User state management
- Persistent login with localStorage
- Auto-logout on token expiration

### Request System
- Users can submit requests for admin access, adding, editing, or deleting masjids
- Track request status (pending/approved/rejected)
- Main admin approval workflow

## 🗺️ Map Features

### Technologies
- **Leaflet:** Open-source JavaScript library for maps
- **React Leaflet:** React components for Leaflet
- **OpenStreetMap:** Free map tiles (no API key needed!)

### Map Interactions
- **Click masjid markers** to view details
- **Click anywhere on map** to get coordinates
- **Auto-center** on user location
- **Distance calculation** to each masjid
- **Get directions** via Google Maps

### Custom Markers
- Blue marker for user location
- Red marker for selected coordinates
- Green markers for masjids

## 👥 User Roles

### Regular User
- View all masjids and prayer times
- Get directions to masjids
- Request admin access
- Request to add/edit/delete masjids
- Track their request status

### Admin
- All user permissions
- Cannot directly add/edit/delete masjids
- Must submit requests to main admin
- Requests require main admin approval

### Main Admin (First Registered User)
- All admin permissions
- Directly add/edit/delete masjids
- Approve/reject all requests
- Manage user roles
- Access to all admin panels

## 🔌 API Integration

The frontend communicates with the backend REST API:
```javascript
// Example API usage
import { authAPI, masjidAPI, requestAPI } from './services/api';

// Login
const response = await authAPI.login({ email, password });

// Get nearby masjids
const masjids = await masjidAPI.getNearby(lng, lat, 5000);

// Submit request
await requestAPI.create({
  type: 'add_masjid',
  masjidData: { ... }
});
```

## 🚀 Build & Deployment

### Local Build
```bash
npm run build
```
Creates optimized production build in `build/` folder.

### Deploy to Vercel

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option 2: Vercel Dashboard

1. **Push to GitHub**
```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
```

2. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend` (if monorepo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add `REACT_APP_API_URL`
   - Value: `https://your-backend.onrender.com/api`
   - Apply to: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Visit your live site!

### Deployment Checklist

✅ Backend is deployed and running  
✅ `REACT_APP_API_URL` points to production backend  
✅ CORS is configured in backend for frontend domain  
✅ Environment variables set in Vercel  
✅ All dependencies installed  
✅ Build succeeds locally  

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `https://api.example.com/api` |

**Critical Notes:**
- Variables MUST start with `REACT_APP_`
- Rebuild required after changing variables
- Set in Vercel dashboard for production
- Use `.env.local` for local development

## 📱 Responsive Design

Fully responsive design works on:
- 📱 Mobile phones (portrait & landscape)
- 📱 Tablets (iPad, Android tablets)
- 💻 Laptops
- 🖥️ Desktop computers (up to 4K)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧪 Available Scripts

### `npm start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view in browser.  
Page reloads on edits.

### `npm test`
Launches test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.  
Optimizes for best performance.  
Minifies files and includes hashes.

### `npm run eject`
**⚠️ Warning: One-way operation!**  
Ejects from Create React App.  
Gives full control over configuration.

## 📚 Dependencies
```json
{
  "react": "^18.2.0",              // UI library
  "react-dom": "^18.2.0",           // React DOM renderer
  "react-router-dom": "^6.15.0",    // Routing
  "axios": "^1.5.0",                // HTTP client
  "leaflet": "^1.9.4",              // Map library
  "react-leaflet": "^4.2.1",        // React Leaflet components
  "jwt-decode": "^3.1.2"            // JWT decoder
}
```

## 🎨 Styling

- **CSS Modules** for component-specific styles
- **Global styles** in `index.css`
- **Responsive design** with CSS Grid and Flexbox
- **Mobile-first** approach
- **Custom CSS** (no UI frameworks)

## 🐛 Troubleshooting

### Map Not Showing
- **Problem:** Blank map or tiles not loading
- **Solution:**
  - Check if Leaflet CSS is imported in `index.html`
  - Verify map container has height in CSS
  - Check browser console for errors
  - Try clearing browser cache

### API Requests Failing
- **Problem:** "Failed to fetch" errors
- **Solution:**
  - Verify `REACT_APP_API_URL` is set correctly
  - Check if backend is running
  - Look at Network tab in DevTools
  - Verify CORS is enabled on backend
  - Check backend logs for errors

### Location Not Detected
- **Problem:** User location not working
- **Solution:**
  - Enable location permissions in browser
  - HTTPS required for geolocation in production
  - Check browser compatibility
  - Use browser's location settings

### Login Not Working
- **Problem:** Can't login or token issues
- **Solution:**
  - Check if token is saved in localStorage
  - Verify API endpoint is correct
  - Check Network tab for error responses
  - Clear localStorage and try again: `localStorage.clear()`

### Environment Variables Not Working
- **Problem:** `undefined` when accessing `process.env.REACT_APP_API_URL`
- **Solution:**
  - Variables must start with `REACT_APP_`
  - Restart development server after adding variables
  - For Vercel: Set in dashboard and redeploy
  - Check `.env` file is in project root

## 🔒 Security

- **Passwords hashed** with bcrypt on backend
- **JWT tokens** for authentication
- **Protected routes** with AuthContext
- **Token stored** in localStorage
- **Auto-logout** on token expiration
- **Input validation** on all forms
- **No sensitive data** in frontend code

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance Optimization

- **Code splitting** with React.lazy
- **Image optimization** with WebP format
- **Lazy loading** for maps and images
- **Memoization** with React.memo and useMemo
- **Production build** minification
- **Gzip compression** on Vercel

## 📄 License

MIT License - free to use for learning and development.

## 👨‍💻 Author

Created for the Muslim community to find nearby masjids easily.

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: Open an issue on GitHub
- 📖 Docs: Read this README

## 🙏 Acknowledgments

- [Leaflet](https://leafletjs.com/) - Interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) - Free map data
- [React](https://reactjs.org/) - UI framework
- [Vercel](https://vercel.com/) - Hosting platform
- [React Leaflet](https://react-leaflet.js.org/) - React components

## 🗺️ Roadmap

Future enhancements:
- [ ] Push notifications for prayer times
- [ ] Offline mode with service workers
- [ ] Dark mode support
- [ ] Multi-language support (Arabic, Urdu, etc.)
- [ ] Advanced search filters
- [ ] Masjid reviews and ratings
- [ ] Event announcements
- [ ] Mobile app (React Native)

---

**Made with ❤️ for the Muslim community**
