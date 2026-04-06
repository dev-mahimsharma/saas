const npmDependency = (name, version, extras = {}) => ({
  name,
  version,
  manager: "npm",
  section: "dependencies",
  ...extras,
});

const npmDevDependency = (name, version, extras = {}) => ({
  name,
  version,
  manager: "npm",
  section: "devDependencies",
  ...extras,
});

const pythonDependency = (name, version = "", extras = {}) => ({
  name,
  version,
  manager: "python",
  section: "requirements",
  ...extras,
});

export const STARTER_DEPENDENCIES = {
  next: {
    js: {
      frontend: [
        npmDependency("next", "^16.2.2"),
        npmDependency("react", "^19.2.4"),
        npmDependency("react-dom", "^19.2.4"),
      ],
      backend: [],
    },
    ts: {
      frontend: [
        npmDependency("next", "^16.2.2"),
        npmDependency("react", "^19.2.4"),
        npmDependency("react-dom", "^19.2.4"),
        npmDevDependency("typescript", "^5.6.3"),
        npmDevDependency("@types/react", "^19.0.7"),
        npmDevDependency("@types/react-dom", "^19.0.3"),
      ],
      backend: [],
    },
  },
  mern: {
    js: {
      frontend: [
        npmDependency("axios", "^1.5.0"),
        npmDependency("react", "^18.2.0"),
        npmDependency("react-dom", "^18.2.0"),
        npmDependency("react-router-dom", "^6.16.0"),
        npmDevDependency("@vitejs/plugin-react", "^4.0.4"),
        npmDevDependency("vite", "^4.4.9"),
      ],
      backend: [
        npmDependency("bcryptjs", "^2.4.3"),
        npmDependency("cors", "^2.8.5"),
        npmDependency("dotenv", "^16.3.1"),
        npmDependency("express", "^4.18.2"),
        npmDependency("jsonwebtoken", "^9.0.2"),
        npmDependency("mongoose", "^7.5.0"),
        npmDevDependency("nodemon", "^3.0.1"),
      ],
    },
    ts: {
      frontend: [
        npmDependency("axios", "^1.5.0"),
        npmDependency("react", "^18.2.0"),
        npmDependency("react-dom", "^18.2.0"),
        npmDependency("react-router-dom", "^6.16.0"),
        npmDevDependency("@types/react", "^18.2.21"),
        npmDevDependency("@types/react-dom", "^18.2.7"),
        npmDevDependency("@vitejs/plugin-react", "^4.0.4"),
        npmDevDependency("typescript", "^5.2.2"),
        npmDevDependency("vite", "^4.4.9"),
        npmDevDependency("vite-tsconfig-paths", "^4.2.1"),
      ],
      backend: [
        npmDependency("bcryptjs", "^2.4.3"),
        npmDependency("cors", "^2.8.5"),
        npmDependency("dotenv", "^16.3.1"),
        npmDependency("express", "^4.18.2"),
        npmDependency("jsonwebtoken", "^9.0.2"),
        npmDependency("mongoose", "^7.5.0"),
        npmDevDependency("@types/bcryptjs", "^2.4.4"),
        npmDevDependency("@types/cors", "^2.8.14"),
        npmDevDependency("@types/express", "^4.17.17"),
        npmDevDependency("@types/jsonwebtoken", "^9.0.3"),
        npmDevDependency("nodemon", "^3.0.1"),
        npmDevDependency("ts-node", "^10.9.1"),
        npmDevDependency("tsconfig-paths", "^4.2.0"),
        npmDevDependency("typescript", "^5.2.2"),
      ],
    },
  },
  django: {
    js: {
      frontend: [
        npmDependency("axios", "^1.6.0"),
        npmDependency("react", "^18.2.0"),
        npmDependency("react-dom", "^18.2.0"),
        npmDependency("react-router-dom", "^6.20.0"),
        npmDevDependency("@vitejs/plugin-react", "^4.2.1"),
        npmDevDependency("eslint", "^8.55.0"),
        npmDevDependency("eslint-plugin-react", "^7.33.2"),
        npmDevDependency("eslint-plugin-react-hooks", "^4.6.0"),
        npmDevDependency("eslint-plugin-react-refresh", "^0.4.5"),
        npmDevDependency("vite", "^5.0.8"),
      ],
      backend: [
        pythonDependency("Django", ">=4.2"),
        pythonDependency("djangorestframework"),
        pythonDependency("django-cors-headers"),
        pythonDependency("djangorestframework-simplejwt"),
        pythonDependency("python-dotenv"),
      ],
    },
    ts: {
      frontend: [
        npmDependency("axios", "^1.6.0"),
        npmDependency("react", "^18.2.0"),
        npmDependency("react-dom", "^18.2.0"),
        npmDependency("react-router-dom", "^6.20.0"),
        npmDevDependency("@types/react", "^18.2.43"),
        npmDevDependency("@types/react-dom", "^18.2.17"),
        npmDevDependency("@typescript-eslint/eslint-plugin", "^6.14.0"),
        npmDevDependency("@typescript-eslint/parser", "^6.14.0"),
        npmDevDependency("@vitejs/plugin-react", "^4.2.1"),
        npmDevDependency("eslint", "^8.55.0"),
        npmDevDependency("eslint-plugin-react-hooks", "^4.6.0"),
        npmDevDependency("eslint-plugin-react-refresh", "^0.4.5"),
        npmDevDependency("typescript", "^5.2.2"),
        npmDevDependency("vite", "^5.0.8"),
      ],
      backend: [
        pythonDependency("Django", ">=4.2"),
        pythonDependency("djangorestframework"),
        pythonDependency("django-cors-headers"),
        pythonDependency("djangorestframework-simplejwt"),
        pythonDependency("python-dotenv"),
      ],
    },
  },
  vanilla: {
    js: { frontend: [], backend: [] },
    ts: {
      frontend: [npmDevDependency("typescript", "^5.0.0")],
      backend: [],
    },
  },
};

export const STYLING_PRESETS = {
  tailwind: {
    label: "Tailwind CSS",
    dependencies: [
      npmDevDependency("tailwindcss", "^4.1.3"),
      npmDevDependency("@tailwindcss/postcss", "^4.1.3"),
    ],
  },
  bootstrap: {
    label: "Bootstrap",
    dependencies: [npmDependency("bootstrap", "^5.3.3")],
  },
  scss: {
    label: "SCSS",
    dependencies: [npmDevDependency("sass", "^1.83.4")],
  },
  unocss: {
    label: "UnoCSS",
    dependencies: [npmDevDependency("unocss", "^0.65.4")],
  },
};

export const UI_LIBRARY_PRESETS = {
  shadcn: {
    label: "Shadcn UI",
    requiresStyling: "tailwind",
    dependencies: [
      npmDependency("class-variance-authority", "^0.7.1"),
      npmDependency("clsx", "^2.1.1"),
      npmDependency("lucide-react", "^0.477.0"),
      npmDependency("tailwind-merge", "^2.6.0"),
    ],
  },
  mui: {
    label: "Material UI",
    dependencies: [
      npmDependency("@emotion/react", "^11.14.0"),
      npmDependency("@emotion/styled", "^11.14.0"),
      npmDependency("@mui/material", "^6.4.4"),
    ],
  },
  radix: {
    label: "Radix UI",
    dependencies: [npmDependency("@radix-ui/react-slot", "^1.1.2")],
  },
  ant: {
    label: "Ant Design",
    dependencies: [npmDependency("antd", "^5.24.1")],
  },
  nextui: {
    label: "NextUI",
    dependencies: [
      npmDependency("@nextui-org/react", "^2.6.11"),
      npmDependency("framer-motion", "^12.4.7"),
    ],
  },
  mantine: {
    label: "Mantine",
    dependencies: [
      npmDependency("@mantine/core", "^7.16.2"),
      npmDependency("@mantine/hooks", "^7.16.2"),
    ],
  },
  headless: {
    label: "Headless UI",
    dependencies: [npmDependency("@headlessui/react", "^2.2.0")],
  },
  chakra: {
    label: "Chakra UI",
    dependencies: [
      npmDependency("@chakra-ui/react", "^3.8.0"),
      npmDependency("@emotion/react", "^11.14.0"),
      npmDependency("framer-motion", "^12.4.7"),
    ],
  },
};

export function getStarterDependencies(stack, language) {
  return STARTER_DEPENDENCIES[stack]?.[language] || { frontend: [], backend: [] };
}
