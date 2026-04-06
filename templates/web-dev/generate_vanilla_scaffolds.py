import os

JS_DIR = r"c:\Users\spars\OneDrive\Desktop\saas\templates\web-dev\javascript-version\vanilla-js-starter"
TS_DIR = r"c:\Users\spars\OneDrive\Desktop\saas\templates\web-dev\typescript-version\vanilla-ts-starter"

common_css = """/* Professional CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* Colors */
  --bg-color: #ffffff;
  --text-color: #1e293b;
  --primary-color: #3b82f6;
  --border-color: #e2e8f0;
  --container-bg: #f8fafc;
  
  /* Typography */
  --font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #0f172a;
    --text-color: #f1f5f9;
    --primary-color: #60a5fa;
    --border-color: #334155;
    --container-bg: #1e293b;
  }
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  background-color: var(--container-bg);
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-align: center;
  border: 1px solid var(--border-color);
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

p {
  font-size: 1.125rem;
  color: inherit;
}
"""

js_files = {
    "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla JS Starter Template</title>
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body>
    <main class="container">
        <h1>Starter Template</h1>
        <p id="date-display">Loading...</p>
    </main>
    <script type="module" src="./assets/js/main.js"></script>
</body>
</html>
""",
    "assets/css/style.css": common_css,
    "assets/js/utils.js": """// Utility module demonstrating ES6 exports
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}
""",
    "assets/js/main.js": """import { formatDate } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello World! Vanilla JS Starter Initialized.");
    
    const displayElement = document.getElementById('date-display');
    if (displayElement) {
        displayElement.textContent = `Today is ${formatDate(new Date())}`;
    }
});
""",
    "package.json": """{
  "name": "vanilla-js-starter",
  "version": "1.0.0",
  "description": "Modern ES6+ Vanilla JavaScript starter template",
  "scripts": {
    "test": "echo \\\"Error: no test specified\\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}""",
    "README.md": """# Vanilla JS Starter

A highly modern, pure Javascript starter template with ES Modules correctly linked.

## How to Run

Since this project uses ES Modules (`type="module"`), you cannot simply double-click the `index.html` file in your browser due to CORS restrictions.

1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode or a similar local web server.
2. Open the project root.
3. Click "Go Live" or serve the directory natively (e.g. `npx serve .` or `python -m http.server`).
4. Open the printed `localhost` URL in your modern browser.
"""
}

ts_files = {
    "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla TS Starter Template</title>
    <link rel="stylesheet" href="./styles/style.css">
</head>
<body>
    <main class="container">
        <h1>Starter Template</h1>
        <p id="user-display">Loading...</p>
    </main>
    <script type="module" src="./dist/main.js"></script>
</body>
</html>
""",
    "styles/style.css": common_css,
    "src/utils.ts": """export function toTitleCase(str: string): string {
    return str.replace(
        /\\w\\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}
""",
    "src/main.ts": """import { toTitleCase } from './utils.js';

// Interface demonstrating TS features
interface UserProfile {
    firstName: string;
    lastName: string;
    role: string;
}

// Class demonstrating TS features
class UserGreeting {
    private user: UserProfile;

    constructor(user: UserProfile) {
        this.user = user;
    }

    public getGreeting(): string {
        const fullName = `${this.user.firstName} ${this.user.lastName}`;
        return `Welcome, ${toTitleCase(fullName)}! Role: ${this.user.role}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello World! Vanilla TS Starter Initialized.");

    const genericUser: UserProfile = {
        firstName: "john",
        lastName: "doe",
        role: "Developer"
    };

    const greeter = new UserGreeting(genericUser);
    
    const displayElement = document.getElementById('user-display');
    if (displayElement) {
        displayElement.textContent = greeter.getGreeting();
    }
});
""",
    "tsconfig.json": """{
  "compilerOptions": {
    "target": "ESNEXT",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}""",
    "package.json": """{
  "name": "vanilla-ts-starter",
  "version": "1.0.0",
  "description": "Strict TypeScript vanilla starter template",
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}""",
    "README.md": """# Vanilla TypeScript Starter

A modern TypeScript environment showcasing strict mode, ES module compilation, interfaces, classes, and native compilation.

## Build Process & How to Run

Since browsers cannot interpret `.ts` files, we must compile them to Javascript. 
This project compiles everything from `src/` out to `dist/`, linking `dist/main.js` logically in `index.html`.

1. Ensure you have `typescript` installed globally or locally.
   *(Since this package does not run `npm install`, you may need `npm install -g typescript` or run `npm config`).*
2. Open a terminal in this directory and watch your files for changes:
   ```bash
   tsc -w
   ```
3. To view the app, like vanilla JS, you need a local server due to ES module imports causing CORS blocks natively. Open Live Server (VSCode extension) or run:
   ```bash
   npx serve .
   ```
"""
}

def write_files(base_dir, structure):
    for fpath, contents in structure.items():
        full_path = os.path.join(base_dir, fpath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(contents)

write_files(JS_DIR, js_files)
write_files(TS_DIR, ts_files)
print("Vanilla starters generated successfully!")
