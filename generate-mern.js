const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'templates', 'web-dev');

function createFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

function generateBackend(isTS, serverPath) {
    const ext = isTS ? 'ts' : 'js';

    // package.json
    createFile(path.join(serverPath, 'package.json'), JSON.stringify({
        name: "mern-auth-server",
        version: "1.0.0",
        main: `src/index.${ext}`,
        scripts: {
            start: isTS ? "ts-node src/index.ts" : "node src/index.js",
            dev: isTS ? "nodemon --exec ts-node src/index.ts" : "nodemon src/index.js"
        },
        dependencies: {
            "bcryptjs": "^2.4.3",
            "cors": "^2.8.5",
            "dotenv": "^16.3.1",
            "express": "^4.18.2",
            "jsonwebtoken": "^9.0.2",
            "mongoose": "^7.5.0"
        },
        devDependencies: isTS ? {
            "@types/bcryptjs": "^2.4.4",
            "@types/cors": "^2.8.14",
            "@types/express": "^4.17.17",
            "@types/jsonwebtoken": "^9.0.3",
            "nodemon": "^3.0.1",
            "ts-node": "^10.9.1",
            "tsconfig-paths": "^4.2.0",
            "typescript": "^5.2.2"
        } : {
            "nodemon": "^3.0.1"
        }
    }, null, 2));

    // tsconfig.json if TS
    if (isTS) {
        createFile(path.join(serverPath, 'tsconfig.json'), `{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "ts-node": {
    "require": ["tsconfig-paths/register"]
  }
}`);
    }

    createFile(path.join(serverPath, '.env.example'), `MONGO_URI=mongodb://localhost:27017/mern_db\nJWT_SECRET=supersecretkey\nPORT=5000`);

    // src/config
    createFile(path.join(serverPath, `src/config/db.${ext}`), `
${isTS ? `import mongoose from 'mongoose';\nimport { MONGO_URI } from './env';` : `const mongoose = require('mongoose');\nconst { MONGO_URI } = require('./env');`}

${isTS ? 'export ' : ''}const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection established');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};
${!isTS ? 'module.exports = connectDB;' : ''}
    `);

    createFile(path.join(serverPath, `src/config/env.${ext}`), `
${isTS ? `import dotenv from 'dotenv';` : `const dotenv = require('dotenv');`}
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const PORT = process.env.PORT || 5000;

if (!MONGO_URI || !JWT_SECRET) {
    console.error('Missing critical environment variables MONGO_URI or JWT_SECRET');
    process.exit(1);
}

${isTS ? `export { MONGO_URI, JWT_SECRET, PORT };` : `module.exports = { MONGO_URI, JWT_SECRET, PORT };`}
    `);

    // types if TS
    if (isTS) {
        createFile(path.join(serverPath, 'src/types/index.ts'), `
import { Request } from 'express';
export interface AuthRequest extends Request {
    userId?: string;
}
        `);
    }

    // Auth Middleware
    createFile(path.join(serverPath, `src/middleware/authMiddleware.${ext}`), `
${isTS ? `import { Response, NextFunction } from 'express';\nimport jwt from 'jsonwebtoken';\nimport { JWT_SECRET } from '@/config/env';\nimport { AuthRequest } from '@/types';` 
: `const jwt = require('jsonwebtoken');\nconst { JWT_SECRET } = require('../config/env');`}

${isTS ? 'export ' : ''}const verifyToken = (${isTS ? 'req: AuthRequest, res: Response, next: NextFunction' : 'req, res, next'}) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET)${isTS ? ' as any' : ''};
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
${!isTS ? 'module.exports = { verifyToken };' : ''}
    `);

    createFile(path.join(serverPath, `src/middleware/errorMiddleware.${ext}`), `
${isTS ? 'export ' : ''}const errorHandler = (${isTS ? 'err: any, req: any, res: any, next: any' : 'err, req, res, next'}) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server Error' });
};
${!isTS ? 'module.exports = { errorHandler };' : ''}
    `);

    // Models
    createFile(path.join(serverPath, `src/models/User.${ext}`), `
${isTS ? `import mongoose, { Document, Schema } from 'mongoose';\nimport bcrypt from 'bcryptjs';` : `const mongoose = require('mongoose');\nconst bcrypt = require('bcryptjs');`}

const userSchema = new ${isTS ? 'Schema' : 'mongoose.Schema'}({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

${isTS ? 'export default mongoose.model("User", userSchema);' : 'module.exports = mongoose.model("User", userSchema);'}
    `);

    // Services
    createFile(path.join(serverPath, `src/services/authService.${ext}`), `
${isTS ? `import jwt from 'jsonwebtoken';\nimport { JWT_SECRET } from '@/config/env';` : `const jwt = require('jsonwebtoken');\nconst { JWT_SECRET } = require('../config/env');`}

${isTS ? 'export ' : ''}const generateToken = (userId${isTS ? ': string' : ''}) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
${!isTS ? 'module.exports = { generateToken };' : ''}
    `);

    // Controllers
    createFile(path.join(serverPath, `src/controllers/authController.${ext}`), `
${isTS ? `import { Request, Response } from 'express';\nimport User from '@/models/User';\nimport bcrypt from 'bcryptjs';\nimport { generateToken } from '@/services/authService';` 
: `const User = require('../models/User');\nconst bcrypt = require('bcryptjs');\nconst { generateToken } = require('../services/authService');`}

${isTS ? 'export ' : ''}const register = async (${isTS ? 'req: Request, res: Response' : 'req, res'}) => {
    try {
        const { email, password, name } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'User exists' });
        const user = await User.create({ email, password, name });
        res.status(201).json({ token: generateToken(user._id${isTS ? ' as string' : ''}), user: { id: user._id, email } });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

${isTS ? 'export ' : ''}const login = async (${isTS ? 'req: Request, res: Response' : 'req, res'}) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
        res.json({ token: generateToken(user._id${isTS ? ' as string' : ''}), user: { id: user._id, email } });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};
${!isTS ? 'module.exports = { register, login };' : ''}
    `);

    createFile(path.join(serverPath, `src/controllers/userController.${ext}`), `
${isTS ? `import { Response } from 'express';\nimport User from '@/models/User';\nimport { AuthRequest } from '@/types';` 
: `const User = require('../models/User');`}

${isTS ? 'export ' : ''}const getProfile = async (${isTS ? 'req: AuthRequest, res: Response' : 'req, res'}) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: 'Error retrieving profile' }); }
};
${!isTS ? 'module.exports = { getProfile };' : ''}
    `);

    // Routes
    createFile(path.join(serverPath, `src/routes/authRoutes.${ext}`), `
${isTS ? `import { Router } from 'express';\nimport { register, login } from '@/controllers/authController';\nconst router = Router();` 
: `const { Router } = require('express');\nconst { register, login } = require('../controllers/authController');\nconst router = Router();`}

router.post('/register', register);
router.post('/login', login);

${isTS ? 'export default router;' : 'module.exports = router;'}
    `);

    createFile(path.join(serverPath, `src/routes/userRoutes.${ext}`), `
${isTS ? `import { Router } from 'express';\nimport { getProfile } from '@/controllers/userController';\nimport { verifyToken } from '@/middleware/authMiddleware';\nconst router = Router();` 
: `const { Router } = require('express');\nconst { getProfile } = require('../controllers/userController');\nconst { verifyToken } = require('../middleware/authMiddleware');\nconst router = Router();`}

router.get('/me', verifyToken, getProfile);

${isTS ? 'export default router;' : 'module.exports = router;'}
    `);

    // index
    createFile(path.join(serverPath, `src/index.${ext}`), `
${isTS ? `import 'module-alias/register'; // Used for compiled mode if needed\nimport express from 'express';\nimport cors from 'cors';\nimport connectDB from '@/config/db';\nimport { PORT } from '@/config/env';\nimport authRoutes from '@/routes/authRoutes';\nimport userRoutes from '@/routes/userRoutes';\nimport { errorHandler } from '@/middleware/errorMiddleware';` 
: `const express = require('express');\nconst cors = require('cors');\nconst connectDB = require('./config/db');\nconst { PORT } = require('./config/env');\nconst authRoutes = require('./routes/authRoutes');\nconst userRoutes = require('./routes/userRoutes');\nconst { errorHandler } = require('./middleware/errorMiddleware');`}

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
    `);
}


function generateFrontend(isTS, clientPath) {
    const ext = isTS ? 'tsx' : 'jsx';
    const bareExt = isTS ? 'ts' : 'js';

    // package.json
    createFile(path.join(clientPath, 'package.json'), JSON.stringify({
        name: "mern-auth-client",
        version: "1.0.0",
        type: "module",
        scripts: {
            dev: "vite",
            build: isTS ? "tsc && vite build" : "vite build",
            preview: "vite preview"
        },
        dependencies: {
            "axios": "^1.5.0",
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.16.0"
        },
        devDependencies: isTS ? {
            "@types/react": "^18.2.21",
            "@types/react-dom": "^18.2.7",
            "@vitejs/plugin-react": "^4.0.4",
            "typescript": "^5.2.2",
            "vite": "^4.4.9",
            "vite-tsconfig-paths": "^4.2.1"
        } : {
            "@vitejs/plugin-react": "^4.0.4",
            "vite": "^4.4.9"
        }
    }, null, 2));

    // Vite config
    createFile(path.join(clientPath, `vite.config.${bareExt}`), `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
${isTS ? "import tsconfigPaths from 'vite-tsconfig-paths'" : ""}
${!isTS ? "import path from 'path'" : ""}

export default defineConfig({
  plugins: [react()${isTS ? ", tsconfigPaths()" : ""}],
  resolve: {
    alias: {
      ${!isTS ? "'@': path.resolve(__dirname, './src')" : ""}
    }
  }
})
    `);

    // tsconfig if TS
    if (isTS) {
        createFile(path.join(clientPath, 'tsconfig.json'), `{
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
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}`);
    }

    // index.html
    createFile(path.join(clientPath, 'index.html'), `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MERN Auth Boilerplate</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
    `);

    // src/styles/main.css
    createFile(path.join(clientPath, 'src/styles/main.css'), `
:root {
  --primary-color: #2563eb;
  --bg-color: #f8fafc;
  --text-color: #1e293b;
  --header-bg: #fff;
  --border-color: #e2e8f0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: var(--bg-color); color: var(--text-color); }
.nav { display: flex; gap: 1rem; padding: 1rem; background: var(--header-bg); border-bottom: 1px solid var(--border-color); }
.nav a { text-decoration: none; color: var(--primary-color); font-weight: 600; }
.container { padding: 2rem; max-width: 800px; margin: 0 auto; }
.btn { background: var(--primary-color); color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
.form-group { margin-bottom: 1rem; }
.form-group input { width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; mt-1; }
    `);

    if (isTS) {
        createFile(path.join(clientPath, 'src/types/index.ts'), `
export interface User {
    id: string;
    email: string;
    name?: string;
}
        `);
    }

    // API
    createFile(path.join(clientPath, `src/api/axiosInstance.${bareExt}`), `
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
});

export default api;
    `);

    // Context
    createFile(path.join(clientPath, `src/context/AuthContext.${ext}`), `
import { createContext, useState, useEffect } from 'react';
import api from '@/api/axiosInstance';
${isTS ? `import { User } from '@/types';` : ''}

${isTS ? `interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}` : ''}

export const AuthContext = createContext${isTS ? '<AuthContextType | null>(null)' : '()'};

export const AuthProvider = ({ children }${isTS ? ': { children: React.ReactNode }' : ''}) => {
    const [user, setUser] = useState${isTS ? '<User | null>' : ''}(null);
    const [token, setToken] = useState${isTS ? '<string | null>' : ''}(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.get('/users/me')
                .then(res => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (newToken${isTS ? ': string' : ''}, newUser${isTS ? ': User' : ''}) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
    `);

    // Hooks
    createFile(path.join(clientPath, `src/hooks/useAuth.${bareExt}`), `
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
    `);

    createFile(path.join(clientPath, `src/hooks/useFetch.${bareExt}`), `
import { useState, useEffect } from 'react';
import api from '@/api/axiosInstance';

export const useFetch = ${isTS ? '<T>' : ''}(url${isTS ? ': string' : ''}) => {
    const [data, setData] = useState${isTS ? '<T | null>' : ''}(null);
    const [error, setError] = useState${isTS ? '<string | null>' : ''}(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(url)
            .then(res => setData(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, error, loading };
};
    `);

    // Layout
    createFile(path.join(clientPath, `src/components/layout/Navbar.${ext}`), `
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="nav">
            <Link to="/">Home</Link>
            {user ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={logout} className="btn">Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};
    `);

    createFile(path.join(clientPath, `src/components/layout/ProtectedRoute.${ext}`), `
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" />;
};
    `);

    // Pages
    createFile(path.join(clientPath, `src/pages/LoginPage.${ext}`), `
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (e${isTS ? ': React.FormEvent' : ''}) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            nav('/dashboard');
        } catch (err) { alert('Login failed'); }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
};
    `);

    createFile(path.join(clientPath, `src/pages/RegisterPage.${ext}`), `
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const nav = useNavigate();

    const handleSubmit = async (e${isTS ? ': React.FormEvent' : ''}) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { email, password });
            login(data.token, data.user);
            nav('/dashboard');
        } catch (err) { alert('Register failed'); }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
};
    `);

    createFile(path.join(clientPath, `src/pages/Dashboard.${ext}`), `
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="container">
            <h2>Welcome, {user?.email}</h2>
            <p>This is a protected dashboard area.</p>
        </div>
    );
};
    `);

    // App & Main
    createFile(path.join(clientPath, `src/App.${ext}`), `
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { Dashboard } from '@/pages/Dashboard';
import '@/styles/main.css';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
    `);

    createFile(path.join(clientPath, `src/main.${ext}`), `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')${isTS ? ' as HTMLElement' : ''}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
    `);
}

// Build standard versions
const jsMernPath = path.join(basePath, 'javascript-version', 'mern');
const tsMernPath = path.join(basePath, 'typescript-version', 'mern');

generateBackend(false, path.join(jsMernPath, 'server'));
generateFrontend(false, path.join(jsMernPath, 'client'));

generateBackend(true, path.join(tsMernPath, 'server'));
generateFrontend(true, path.join(tsMernPath, 'client'));

console.log("MERN Boilerplate initialized for both JS and TS versions!");
