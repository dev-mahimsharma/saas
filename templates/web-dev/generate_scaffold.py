import os

TS_DIR = r"c:\Users\spars\OneDrive\Desktop\saas\templates\web-dev\typescript-version\django-react"
JS_DIR = r"c:\Users\spars\OneDrive\Desktop\saas\templates\web-dev\javascript-version\django-react"

backend_structure = {
    "manage.py": """#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
""",
    "config/__init__.py": "",
    "config/settings/__init__.py": "",
    "config/settings/base.py": """from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = 'replace-this-in-production'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    
    # Local apps
    'apps.core',
    'apps.users',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

AUTH_USER_MODEL = 'users.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
""",
    "config/settings/dev.py": """from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

CORS_ALLOW_ALL_ORIGINS = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
""",
    "config/settings/prod.py": """from .base import *

DEBUG = False

ALLOWED_HOSTS = ['yourdomain.com']

CORS_ALLOWED_ORIGINS = [
    "https://yourfrontend.com",
]

# Configure your production database here
""",
    "config/urls.py": """from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
]
""",
    "config/wsgi.py": """import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
application = get_wsgi_application()
""",
    "config/asgi.py": """import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
application = get_asgi_application()
""",
    "apps/__init__.py": "",
    "apps/core/__init__.py": "",
    "apps/core/apps.py": """from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
""",
    "apps/core/models.py": """from django.db import models

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
""",
    "apps/core/middleware.py": """class CoreMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response
""",
    "apps/users/__init__.py": "",
    "apps/users/apps.py": """from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
""",
    "apps/users/models.py": """from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    pass
""",
    "apps/users/serializers.py": """from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']
""",
    "apps/users/views.py": """from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    # Custom auth logic here
    pass
""",
    "apps/api/__init__.py": "",
    "apps/api/urls.py": """from django.urls import path
from apps.users.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
""",
    "requirements/base.txt": "Django>=4.2\ndjangorestframework\ndjango-cors-headers\ndjangorestframework-simplejwt\npython-dotenv\n",
    "requirements/local.txt": "-r base.txt\npytest\npytest-django\n",
    "requirements/production.txt": "-r base.txt\ngunicorn\npsycopg2-binary\n",
    "services/__init__.py": "",
    "services/auth_service.py": """def authenticate_user(username, password):
    pass
""",
    ".env.example": "DEBUG=True\nSECRET_KEY=your_secret_key\n",
    "pytest.ini": "[pytest]\nDJANGO_SETTINGS_MODULE = config.settings.dev\npython_files = tests.py test_*.py *_tests.py\n",
    "README.md": """# Django REST + React Vite Project

## Backend Setup
1. Create a virtual environment: `python -m venv venv`
2. Activate: `source venv/bin/activate` or `venv\\Scripts\\activate` on Windows
3. Install reqs: `pip install -r requirements/local.txt`
4. Run migrations: `python manage.py migrate`
5. Run server: `python manage.py runserver`

## Frontend Setup
1. `cd client`
2. `npm run dev`
"""
}

frontend_ts_structure = {
    "package.json": """{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}""",
    "tsconfig.json": """{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}""",
    "tsconfig.node.json": """{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}""",
    "vite.config.ts": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
""",
    "index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + TS + Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
""",
    "src/main.tsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import { AppProvider } from './providers/AppProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
""",
    "src/App.tsx": """import { AppRoutes } from './routes'

function App() {
  return <AppRoutes />
}

export default App
""",
    "src/styles/global.css": """:root {
  --primary-color: #0f172a;
  --primary-hover: #1e293b;
  --bg-color: #f8fafc;
  --text-color: #334155;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
""",
    "src/api/client.ts": """import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post('http://localhost:8000/api/auth/refresh/', {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
""",
    "src/types/api.ts": """export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
""",
    "src/features/auth/types.ts": """export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: number; username: string };
}
""",
    "src/features/auth/api/index.ts": """import { apiClient } from '@/api/client';
import { AuthResponse } from '../types';

export const login = async (credentials: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('auth/login/', credentials);
  return response.data;
};
""",
    "src/features/auth/hooks/useAuth.ts": """import { useState } from 'react';
import { login } from '../api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      // redirect logic
      window.location.href = '/';
    } catch (e) {
      console.error('Login error', e);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLogin };
};
""",
    "src/features/auth/components/LoginForm.tsx": """import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import styles from './LoginForm.module.css';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading } = useAuth();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      handleLogin({ username, password });
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.container}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Please enter your details to sign in.</p>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <Input 
              id="username"
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <Input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <Button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
""",
    "src/features/auth/components/LoginForm.module.css": """.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
}
.container {
  width: 100%;
  max-width: 400px;
}
.title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}
.subtitle {
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
  color: #64748b;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.inputGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.inputGroup label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}
.submitBtn {
  margin-top: 0.5rem;
}
""",
    "src/components/ui/Button/Button.tsx": """import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={`${styles.button} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
""",
    "src/components/ui/Button/Button.module.css": """.button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}
.button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}
.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
""",
    "src/components/ui/Input/Input.tsx": """import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input className={`${styles.input} ${className || ''}`} {...props} />
  );
};
""",
    "src/components/ui/Input/Input.module.css": """.input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
}
""",
    "src/components/ui/Card/Card.tsx": """import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {children}
    </div>
  );
};
""",
    "src/components/ui/Card/Card.module.css": """.card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  padding: 2rem;
}
""",
    "src/providers/AppProvider.tsx": """import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};
""",
    "src/routes/index.tsx": """import { Routes, Route } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token');
  return token ? <>{children}</> : <LoginForm />;
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the clean architecture dashboard.</p>
            <button onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
            }}>Logout</button>
          </div>
        </PrivateRoute>
      } />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};
"""
}

# Provide an exact JS map instead of regex replacing, avoids any TypeScript remnant syntaxes.
frontend_js_structure = {
    "package.json": """{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.0.8"
  }
}""",
    "vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
""",
    "index.html": frontend_ts_structure["index.html"].replace(".tsx", ".jsx"),
    "src/main.jsx": frontend_ts_structure["src/main.tsx"].replace(".App.tsx", ".App.jsx").replace("providers/AppProvider.tsx", "providers/AppProvider.jsx"),
    "src/App.jsx": frontend_ts_structure["src/App.tsx"],
    "src/styles/global.css": frontend_ts_structure["src/styles/global.css"],
    "src/api/client.js": frontend_ts_structure["src/api/client.ts"],
    "src/features/auth/api/index.js": """import { apiClient } from '@/api/client';

export const login = async (credentials) => {
  const response = await apiClient.post('auth/login/', credentials);
  return response.data;
};
""",
    "src/features/auth/hooks/useAuth.js": """import { useState } from 'react';
import { login } from '../api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      window.location.href = '/';
    } catch (e) {
      console.error('Login error', e);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLogin };
};
""",
    "src/features/auth/components/LoginForm.jsx": """import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import styles from './LoginForm.module.css';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      handleLogin({ username, password });
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.container}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Please enter your details to sign in.</p>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <Input 
              id="username"
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <Input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <Button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
""",
    "src/features/auth/components/LoginForm.module.css": frontend_ts_structure["src/features/auth/components/LoginForm.module.css"],
    "src/components/ui/Button/Button.jsx": """import React from 'react';
import styles from './Button.module.css';

export const Button = ({ children, className, ...props }) => {
  return (
    <button className={`${styles.button} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
""",
    "src/components/ui/Button/Button.module.css": frontend_ts_structure["src/components/ui/Button/Button.module.css"],
    "src/components/ui/Input/Input.jsx": """import React from 'react';
import styles from './Input.module.css';

export const Input = ({ className, ...props }) => {
  return (
    <input className={`${styles.input} ${className || ''}`} {...props} />
  );
};
""",
    "src/components/ui/Input/Input.module.css": frontend_ts_structure["src/components/ui/Input/Input.module.css"],
    "src/components/ui/Card/Card.jsx": """import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, className }) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {children}
    </div>
  );
};
""",
    "src/components/ui/Card/Card.module.css": frontend_ts_structure["src/components/ui/Card/Card.module.css"],
    "src/providers/AppProvider.jsx": """import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const AppProvider = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};
""",
    "src/routes/index.jsx": """import { Routes, Route } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? <>{children}</> : <LoginForm />;
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the clean architecture dashboard.</p>
            <button onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
            }}>Logout</button>
          </div>
        </PrivateRoute>
      } />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};
"""
}

def write_files(base_dir, structure):
    for fpath, contents in structure.items():
        full_path = os.path.join(base_dir, fpath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(contents)

write_files(os.path.join(TS_DIR, "server"), backend_structure)
write_files(os.path.join(TS_DIR, "client"), frontend_ts_structure)
write_files(os.path.join(JS_DIR, "server"), backend_structure)
write_files(os.path.join(JS_DIR, "client"), frontend_js_structure)

print("Project generated successfully")
