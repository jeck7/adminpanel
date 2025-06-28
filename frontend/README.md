# 🎨 Admin Panel Frontend

Modern React-based frontend for the Admin Panel application, built with Vite, Tailwind CSS, and React Router.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
npm run dev
```

Access the application at: http://localhost:5173

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Heroicons** - SVG icons
- **React Hook Form** - Form management

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── AdminLayout.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── AIAssistant.jsx
│   │   └── PromptBuilder.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Community.jsx
│   │   └── PromptEngineering.jsx
│   ├── services/          # API services
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── aiService.js
│   │   └── ...
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Features

### 🏠 Dashboard
- Interactive charts and statistics
- Real-time data updates
- Quick action buttons
- Responsive design

### 👥 User Management
- Complete CRUD operations
- Advanced search and filtering
- Role-based access control
- Modern table design with avatars

### 🤖 AI Assistant
- Real-time chat interface
- OpenAI integration
- Conversation history
- Context-aware responses

### 🛠️ Prompt Builder
- Visual prompt creation
- Template library
- Export/Import functionality
- Version control

### 🌐 Community
- Shared prompts marketplace
- Like and comment system
- User ratings
- Categories and tags

### 👤 Profile Management
- Personal information editing
- Password change
- Activity history
- Preferences settings

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Admin Panel
VITE_APP_VERSION=1.0.0
```

### API Configuration
Update the API base URL in `src/services/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

### Custom Components
Common UI components are available in the `components` directory:

- **AdminLayout** - Main layout wrapper
- **Header** - Top navigation bar
- **Sidebar** - Left navigation menu
- **Modal** - Reusable modal component
- **Button** - Custom button component

## 🔐 Authentication

### JWT Token Management
Authentication is handled through JWT tokens stored in localStorage:

```javascript
// Store token
localStorage.setItem('token', response.data.token);

// Get token
const token = localStorage.getItem('token');

// Remove token (logout)
localStorage.removeItem('token');
```

### Protected Routes
Routes are protected using the `ProtectedRoute` component:

```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
All components are designed mobile-first using Tailwind's responsive prefixes:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

## 🚀 Performance

### Code Splitting
Routes are lazy-loaded for better performance:

```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
```

### Image Optimization
Images are optimized using Vite's asset handling:

```javascript
import logo from '/src/assets/logo.svg';
```

## 🧪 Testing

### Unit Tests
Tests are written using Vitest and React Testing Library:

```bash
npm run test
```

### Example Test
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Docker Build
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Deployment Options
- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop dist folder
- **Railway**: Use Railway CLI
- **Heroku**: Use Heroku CLI

## 🔧 Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Sidebar.jsx`

### Adding New Components
1. Create component in `src/components/`
2. Export from `src/components/index.js`
3. Import where needed

### API Integration
1. Create service in `src/services/`
2. Use Axios for HTTP requests
3. Handle errors and loading states

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Clear cache and rebuild
npm run build --force
```

## 📚 Resources

- [React Documentation](https://reactjs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
