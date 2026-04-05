/**
 * Nested folder trees for UI preview. File nodes may include `snippet` (sample boilerplate).
 * Must stay roughly in sync with /templates/* layout.
 */

export const structureTrees = {
  html: [
    {
      type: "folder",
      name: "assets",
      children: [{ type: "file", name: ".gitkeep", snippet: "# static assets\n" }],
    },
    {
      type: "folder",
      name: "css",
      children: [
        {
          type: "file",
          name: "style.css",
          snippet:
            "body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  background: #0f172a;\n  color: #f8fafc;\n}",
        },
      ],
    },
    {
      type: "folder",
      name: "js",
      children: [
        {
          type: "file",
          name: "config.js",
          snippet:
            "export const APP_NAME = \"Bootnode App\";\nexport const API_URL = \"/api\";",
        },
        {
          type: "file",
          name: "script.js",
          snippet:
            "import { APP_NAME } from \"./config.js\";\n\ndocument.querySelector(\"#app-title\").textContent = APP_NAME;\nconsole.log(\"Bootnode ready\");",
        },
      ],
    },
    {
      type: "file",
      name: "index.html",
      snippet:
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <title>Bootnode App</title>\n  <link rel=\"stylesheet\" href=\"css/style.css\" />\n</head>\n<body>\n  <h1 id=\"app-title\">Loading…</h1>\n  <script type=\"module\" src=\"js/script.js\"></script>\n</body>\n</html>",
    },
    { type: "file", name: "README.md", snippet: "# Bootnode HTML starter\n\nOpen `index.html` or run `npx serve .`.\n" },
  ],

  react: [
    { type: "file", name: "index.html", snippet: "<!doctype html>\n<html lang=\"en\">\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.jsx\"></script>\n  </body>\n</html>" },
    {
      type: "file",
      name: "vite.config.js",
      snippet:
        "import { defineConfig } from \"vite\";\nimport react from \"@vitejs/plugin-react\";\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 5173 },\n});",
    },
    {
      type: "file",
      name: "package.json",
      snippet:
        "{\n  \"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\" },\n  \"dependencies\": { \"react\": \"^19\", \"react-dom\": \"^19\" }\n}",
    },
    {
      type: "folder",
      name: "src",
      children: [
        {
          type: "file",
          name: "main.jsx",
          snippet:
            "import { StrictMode } from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport App from \"./App.jsx\";\nimport \"./index.css\";\n\ncreateRoot(document.getElementById(\"root\")).render(\n  <StrictMode><App /></StrictMode>\n);",
        },
        {
          type: "file",
          name: "App.jsx",
          snippet:
            "import { Header } from \"./components/Header.jsx\";\n\nexport default function App() {\n  return (\n    <main className=\"app\">\n      <Header />\n      <p>Start editing <code>src/App.jsx</code></p>\n    </main>\n  );\n}",
        },
        {
          type: "file",
          name: "index.css",
          snippet: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui; }\n.app { padding: 2rem; }",
        },
        {
          type: "folder",
          name: "components",
          children: [
            {
              type: "file",
              name: "Header.jsx",
              snippet:
                "export function Header() {\n  return (\n    <header>\n      <h1>Hello from Bootnode</h1>\n    </header>\n  );\n}",
            },
          ],
        },
        {
          type: "folder",
          name: "hooks",
          children: [
            {
              type: "file",
              name: "useLocalStorage.js",
              snippet:
                "import { useEffect, useState } from \"react\";\n\nfunction readStored(key, initial) {\n  try {\n    const raw = localStorage.getItem(key);\n    return raw != null ? JSON.parse(raw) : initial;\n  } catch {\n    return initial;\n  }\n}\n\nexport function useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => readStored(key, initial));\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}",
            },
          ],
        },
      ],
    },
  ],

  vue: [
    { type: "file", name: "index.html", snippet: "<div id=\"app\"></div>\n<script type=\"module\" src=\"/src/main.js\"></script>" },
    {
      type: "file",
      name: "vite.config.js",
      snippet: "import { defineConfig } from \"vite\";\nimport vue from \"@vitejs/plugin-vue\";\nexport default defineConfig({ plugins: [vue()] });",
    },
    { type: "file", name: "package.json", snippet: "{ \"scripts\": { \"dev\": \"vite\" }, \"dependencies\": { \"vue\": \"^3.5\" } }" },
    {
      type: "folder",
      name: "src",
      children: [
        {
          type: "file",
          name: "main.js",
          snippet: "import { createApp } from \"vue\";\nimport App from \"./App.vue\";\nimport \"./style.css\";\ncreateApp(App).mount(\"#app\");",
        },
        {
          type: "file",
          name: "App.vue",
          snippet: "<script setup>\nimport HelloWorld from \"./components/HelloWorld.vue\";\n</script>\n\n<template>\n  <HelloWorld />\n</template>",
        },
        { type: "file", name: "style.css", snippet: "body { margin: 0; font-family: system-ui; }\n#app { padding: 2rem; }" },
        {
          type: "folder",
          name: "components",
          children: [
            {
              type: "file",
              name: "HelloWorld.vue",
              snippet: "<template>\n  <h1>Hello from Bootnode</h1>\n</template>",
            },
          ],
        },
        {
          type: "folder",
          name: "composables",
          children: [
            {
              type: "file",
              name: "useCounter.js",
              snippet: "import { ref } from \"vue\";\n\nexport function useCounter(initial = 0) {\n  const n = ref(initial);\n  const inc = () => n.value++;\n  return { n, inc };\n}",
            },
          ],
        },
      ],
    },
  ],

  next: [
    {
      type: "file",
      name: "package.json",
      snippet:
        "{ \"scripts\": { \"dev\": \"next dev\", \"build\": \"next build\" }, \"dependencies\": { \"next\": \"16\" } }",
    },
    {
      type: "file",
      name: "next.config.mjs",
      snippet:
        "/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;",
    },
    {
      type: "file",
      name: "postcss.config.mjs",
      snippet:
        "export default { plugins: { \"@tailwindcss/postcss\": {} } };",
    },
    {
      type: "file",
      name: "eslint.config.mjs",
      snippet: "import nextVitals from \"eslint-config-next/core-web-vitals\";\nexport default [...nextVitals];",
    },
    {
      type: "folder",
      name: "app",
      children: [
        {
          type: "file",
          name: "globals.css",
          snippet: '@import "tailwindcss";\n\nbody {\n  @apply antialiased text-slate-900 bg-slate-50;\n}',
        },
        {
          type: "file",
          name: "layout.js",
          snippet:
            "import \"./globals.css\";\nimport { Header } from \"@/components/Header\";\nimport { Footer } from \"@/components/Footer\";\n\nexport const metadata = { title: \"Bootnode App\" };\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <Header />\n        {children}\n        <Footer />\n      </body>\n    </html>\n  );\n}",
        },
        {
          type: "file",
          name: "page.js",
          snippet:
            "export default function Home() {\n  return (\n    <main className=\"mx-auto max-w-3xl px-4 py-16\">\n      <h1 className=\"text-3xl font-bold\">Hello from Bootnode</h1>\n      <p className=\"mt-4 text-slate-600\">Edit app/page.js to get started.</p>\n    </main>\n  );\n}",
        },
        {
          type: "file",
          name: "loading.js",
          snippet: "export default function Loading() {\n  return <p className=\"p-8 text-slate-500\">Loading…</p>;\n}",
        },
      ],
    },
    {
      type: "folder",
      name: "components",
      children: [
        {
          type: "file",
          name: "Header.js",
          snippet:
            "import Link from \"next/link\";\n\nexport function Header() {\n  return (\n    <header className=\"border-b border-slate-200 bg-white\">\n      <nav className=\"mx-auto flex max-w-5xl gap-4 px-4 py-3\">\n        <Link href=\"/\" className=\"font-semibold\">Home</Link>\n      </nav>\n    </header>\n  );\n}",
        },
        {
          type: "file",
          name: "Footer.js",
          snippet:
            "export function Footer() {\n  return (\n    <footer className=\"mt-auto border-t py-6 text-center text-sm text-slate-500\">\n      Built with Bootnode\n    </footer>\n  );\n}",
        },
      ],
    },
    { type: "folder", name: "public", children: [{ type: "file", name: ".gitkeep", snippet: "" }] },
    { type: "file", name: "jsconfig.json", snippet: '{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }' },
    { type: "file", name: "README.md", snippet: "# Next.js (Bootnode)\n\nnpm install && npm run dev\n" },
  ],

  mern: [
    { type: "file", name: "README.md", snippet: "# MERN (Bootnode)\n\n`cd server && npm i && npm start`\n\n`cd client && npm i && npm run dev`\n" },
    {
      type: "folder",
      name: "server",
      children: [
        { type: "file", name: "package.json", snippet: "{ \"scripts\": { \"start\": \"node index.js\" } }" },
        {
          type: "file",
          name: "index.js",
          snippet:
            "const express = require(\"express\");\nconst cors = require(\"cors\");\nconst apiRoutes = require(\"./routes/api\");\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.use(\"/api\", apiRoutes);\napp.get(\"/\", (_, res) => res.json({ message: \"API running\" }));\n\napp.listen(process.env.PORT || 5000);",
        },
        {
          type: "folder",
          name: "routes",
          children: [
            {
              type: "file",
              name: "api.js",
              snippet:
                "const { Router } = require(\"express\");\nconst r = Router();\n\nr.get(\"/health\", (_, res) => res.json({ ok: true }));\n\nmodule.exports = r;",
            },
          ],
        },
        {
          type: "file",
          name: "config.js",
          snippet: "module.exports = {\n  port: process.env.PORT || 5000,\n};",
        },
      ],
    },
    {
      type: "folder",
      name: "client",
      children: [
        {
          type: "file",
          name: "package.json",
          snippet: "{ \"scripts\": { \"dev\": \"vite\" } }",
        },
        {
          type: "file",
          name: "vite.config.js",
          snippet:
            "import react from \"@vitejs/plugin-react\";\nimport { defineConfig } from \"vite\";\nexport default defineConfig({ plugins: [react()] });",
        },
        {
          type: "file",
          name: "index.html",
          snippet: "<div id=\"root\"></div>\n<script type=\"module\" src=\"/src/main.jsx\"></script>",
        },
        {
          type: "folder",
          name: "src",
          children: [
            {
              type: "file",
              name: "main.jsx",
              snippet: "import { createRoot } from \"react-dom/client\";\nimport App from \"./App.jsx\";\nimport \"./index.css\";\ncreateRoot(document.getElementById(\"root\")).render(<App />);",
            },
            {
              type: "file",
              name: "App.jsx",
              snippet:
                "import { Navbar } from \"./components/Navbar.jsx\";\n\nexport default function App() {\n  return (\n    <>\n      <Navbar />\n      <main className=\"p-8\">\n        <h1>Hello from Bootnode</h1>\n      </main>\n    </>\n  );\n}",
            },
            { type: "file", name: "index.css", snippet: "body { margin: 0; font-family: system-ui; }" },
            {
              type: "folder",
              name: "components",
              children: [
                {
                  type: "file",
                  name: "Navbar.jsx",
                  snippet: "export function Navbar() {\n  return <header className=\"border-b px-4 py-3\">MERN Client</header>;\n}",
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  svelte: [
    {
      type: "file",
      name: "package.json",
      snippet:
        "{ \"scripts\": { \"dev\": \"vite dev\" }, \"devDependencies\": { \"svelte\": \"^4\", \"vite\": \"^5\" } }",
    },
    {
      type: "file",
      name: "vite.config.js",
      snippet:
        "import { svelte } from \"@sveltejs/vite-plugin-svelte\";\nimport { defineConfig } from \"vite\";\nexport default defineConfig({ plugins: [svelte()] });",
    },
    {
      type: "file",
      name: "svelte.config.js",
      snippet:
        "import { vitePreprocess } from \"@sveltejs/vite-plugin-svelte\";\nexport default { preprocess: vitePreprocess() };",
    },
    {
      type: "file",
      name: "index.html",
      snippet:
        "<div id=\"app\"></div>\n<script type=\"module\" src=\"/src/main.js\"></script>",
    },
    {
      type: "folder",
      name: "src",
      children: [
        {
          type: "file",
          name: "main.js",
          snippet:
            "import App from \"./App.svelte\";\nimport \"./app.css\";\n\nconst app = new App({ target: document.getElementById(\"app\") });\nexport default app;",
        },
        {
          type: "file",
          name: "App.svelte",
          snippet:
            "<script>\n  import Counter from \"./lib/Counter.svelte\";\n</script>\n\n<main>\n  <h1>Hello from Bootnode</h1>\n  <Counter />\n</main>",
        },
        {
          type: "file",
          name: "app.css",
          snippet: "body { margin: 0; font-family: system-ui; }\nmain { padding: 2rem; }",
        },
        {
          type: "folder",
          name: "lib",
          children: [
            {
              type: "file",
              name: "Counter.svelte",
              snippet:
                "<script>\n  let count = 0;\n</script>\n\n<button type=\"button\" on:click={() => count++}>\n  count: {count}\n</button>",
            },
          ],
        },
      ],
    },
  ],

  astro: [
    { type: "file", name: "package.json", snippet: "{ \"scripts\": { \"dev\": \"astro dev\", \"build\": \"astro build\" } }" },
    { type: "file", name: "astro.config.mjs", snippet: "import { defineConfig } from \"astro/config\";\nexport default defineConfig({});" },
    {
      type: "folder",
      name: "src",
      children: [
        {
          type: "folder",
          name: "layouts",
          children: [
            {
              type: "file",
              name: "Layout.astro",
              snippet:
                "---\nconst { title = \"Bootnode\" } = Astro.props;\n---\n\n<html lang=\"en\">\n  <head><meta charset=\"utf-8\" /><title>{title}</title></head>\n  <body>\n    <slot />\n  </body>\n</html>",
            },
          ],
        },
        {
          type: "folder",
          name: "pages",
          children: [
            {
              type: "file",
              name: "index.astro",
              snippet:
                "---\nimport Layout from \"../layouts/Layout.astro\";\n---\n\n<Layout title=\"Home\">\n  <main style=\"padding:2rem\">\n    <h1>Hello from Bootnode</h1>\n  </main>\n</Layout>",
            },
          ],
        },
      ],
    },
    { type: "folder", name: "public", children: [{ type: "file", name: ".gitkeep", snippet: "" }] },
  ],

  api: [
    { type: "file", name: "package.json", snippet: "{ \"scripts\": { \"start\": \"node src/index.js\" } }" },
    { type: "file", name: "README.md", snippet: "# REST API (Bootnode)\n\nnpm install && npm start\n" },
    {
      type: "folder",
      name: "src",
      children: [
        {
          type: "file",
          name: "index.js",
          snippet:
            "const express = require(\"express\");\nconst cors = require(\"cors\");\nconst usersRouter = require(\"./routes/users\");\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.use(\"/users\", usersRouter);\napp.get(\"/health\", (_, res) => res.json({ ok: true }));\n\nconst port = process.env.PORT || 4000;\napp.listen(port, () => console.log(`API on ${port}`));",
        },
        {
          type: "folder",
          name: "routes",
          children: [
            {
              type: "file",
              name: "users.js",
              snippet:
                "const { Router } = require(\"express\");\nconst r = Router();\n\nr.get(\"/\", (_, res) => res.json([{ id: 1, name: \"Ada\" }]));",
            },
          ],
        },
        {
          type: "folder",
          name: "middleware",
          children: [
            {
              type: "file",
              name: "logger.js",
              snippet:
                "module.exports = function logger(req, res, next) {\n  console.log(req.method, req.path);\n  next();\n};",
            },
          ],
        },
      ],
    },
  ],

  "react-native": [
    { type: "folder", name: "android", children: [{ type: "file", name: "build.gradle", snippet: "// Native Gradle build scripts" }] },
    { type: "folder", name: "ios", children: [{ type: "file", name: "Podfile", snippet: "# Xcode project & CocoaPods" }] },
    {
      type: "folder",
      name: "src",
      children: [
        { type: "folder", name: "assets", children: [{ type: "file", name: "splash.png" }] },
        { type: "folder", name: "components", children: [{ type: "file", name: "Button.js", snippet: "export default function Button() {}" }] },
        { type: "folder", name: "navigation", children: [{ type: "file", name: "AppNavigator.js", snippet: "export default function AppNavigator() {}" }] },
        { type: "folder", name: "store", children: [{ type: "file", name: "index.js", snippet: "export const store = {};" }] }
      ],
    },
    { type: "file", name: "app.json", snippet: "{ \"name\": \"mobile-app\" }" },
    { type: "file", name: "package.json", snippet: "{ \"dependencies\": { \"react-native\": \"^0.72\" } }" },
    { type: "file", name: "metro.config.js", snippet: "module.exports = {};" }
  ],

  flutter: [
    { type: "folder", name: "android", children: [] },
    { type: "folder", name: "ios", children: [] },
    { type: "folder", name: "lib", children: [
        { type: "file", name: "main.dart", snippet: "void main() => runApp(MyApp());" },
        { type: "folder", name: "widgets" },
        { type: "folder", name: "screens" }
      ]
    },
    { type: "file", name: "pubspec.yaml", snippet: "name: flutter_app" }
  ],

  swift: [
    { type: "folder", name: "AppCore", children: [
        { type: "file", name: "AppDelegate.swift", snippet: "@main\nclass AppDelegate: UIResponder, UIApplicationDelegate {}" },
        { type: "file", name: "SceneDelegate.swift", snippet: "class SceneDelegate: UIResponder, UIWindowSceneDelegate {}" }
      ]
    },
    { type: "folder", name: "Views", children: [{ type: "file", name: "ContentView.swift", snippet: "import SwiftUI\n\nstruct ContentView: View {}" }] },
    { type: "file", name: "Info.plist", snippet: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" }
  ],

  kotlin: [
    { type: "folder", name: "app", children: [
        { type: "folder", name: "src", children: [
            { type: "folder", name: "main", children: [
                { type: "folder", name: "java", children: [{ type: "file", name: "MainActivity.kt", snippet: "class MainActivity : AppCompatActivity() {}" }] },
                { type: "folder", name: "res", children: [{ type: "folder", name: "layout" }] },
                { type: "file", name: "AndroidManifest.xml", snippet: "<manifest></manifest>" }
              ]
            }
          ]
        },
        { type: "file", name: "build.gradle.kts", snippet: "plugins { id(\"com.android.application\") }" }
      ]
    },
    { type: "file", name: "gradle.properties" }
  ]
};

export function getStructureTree(stack) {
  return structureTrees[stack] ?? structureTrees.next;
}
