import path from "path";
import fs from "fs-extra";
import { GenerationError } from "@/lib/generation/errors";
import { STYLING_PRESETS, UI_LIBRARY_PRESETS } from "@/lib/generation/catalog";

function titleize(value) {
  return value
    .split(/[\s/-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function sortObject(input = {}) {
  return Object.fromEntries(
    Object.entries(input).sort(([left], [right]) => left.localeCompare(right))
  );
}

function getComponentExtension(language) {
  return language === "typescript" ? "tsx" : "jsx";
}

function getFrontendStylesPath(frontendRoot, stack, styling) {
  if (stack === "nextjs") {
    return path.join(frontendRoot, "src", "styles", `bootnode-${styling}.css`);
  }

  if (styling === "scss") {
    return path.join(frontendRoot, "src", "styles", "bootnode-theme.scss");
  }

  return path.join(frontendRoot, "src", "styles", `bootnode-${styling}.css`);
}

function getUiComponentPath(frontendRoot, language, uiLibrary) {
  const extension = getComponentExtension(language);
  return path.join(
    frontendRoot,
    "src",
    "components",
    "ui",
    `Bootnode${titleize(uiLibrary).replace(/\s+/g, "")}.${extension}`
  );
}

function insertImport(content, importLine) {
  if (content.includes(importLine)) {
    return content;
  }

  if (content.startsWith("\"use client\";")) {
    return content.replace("\"use client\";\n", `"use client";\n\n${importLine}\n`);
  }

  return `${importLine}\n${content}`;
}

function getProviderFilePath(frontendRoot, language) {
  const extension = getComponentExtension(language);
  return path.join(frontendRoot, "src", "providers", `BootnodeUiProvider.${extension}`);
}

function buildUiComponent(uiLibrary, language) {
  const isTs = language === "typescript";

  const templates = {
    shadcn: isTs
      ? `import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Array<string | undefined | false>) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-slate-900 text-white hover:bg-slate-700",
        subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

type BootnodeShadcnProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function BootnodeShadcn({ className, intent, ...props }: BootnodeShadcnProps) {
  return <button className={cn(buttonVariants({ intent }), className)} {...props} />;
}
`
      : `import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-slate-900 text-white hover:bg-slate-700",
        subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

export function BootnodeShadcn({ className, intent, ...props }) {
  return <button className={cn(buttonVariants({ intent }), className)} {...props} />;
}
`,
    mui: `import Button from "@mui/material/Button";

export function BootnodeMui() {
  return <Button variant="contained">Bootnode MUI Button</Button>;
}
`,
    radix: isTs
      ? `import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

type BootnodeRadixProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function BootnodeRadix({ asChild = false, ...props }: BootnodeRadixProps) {
  return (
    <Slot asChild={asChild}>
      <button
        {...props}
        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      />
    </Slot>
  );
}
`
      : `import { Slot } from "@radix-ui/react-slot";

export function BootnodeRadix({ asChild = false, ...props }) {
  return (
    <Slot asChild={asChild}>
      <button
        {...props}
        className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      />
    </Slot>
  );
}
`,
    ant: `import { Button } from "antd";

export function BootnodeAnt() {
  return <Button type="primary">Bootnode Ant Button</Button>;
}
`,
    nextui: `import { Button } from "@nextui-org/react";

export function BootnodeNextui() {
  return <Button color="primary">Bootnode NextUI Button</Button>;
}
`,
    mantine: `import { Button } from "@mantine/core";

export function BootnodeMantine() {
  return <Button radius="md">Bootnode Mantine Button</Button>;
}
`,
    headless: `import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export function BootnodeHeadless() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        Bootnode Menu
      </MenuButton>
      <MenuItems anchor="bottom" className="mt-2 min-w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
        <MenuItem>
          {({ focus }) => (
            <button className={focus ? "w-full rounded-lg bg-slate-100 px-3 py-2 text-left" : "w-full px-3 py-2 text-left"}>
              Starter action
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
`,
    chakra: `import { Box, Button, Heading, Text } from "@chakra-ui/react";

export function BootnodeChakra() {
  return (
    <Box rounded="xl" borderWidth="1px" p="6" shadow="sm">
      <Heading size="md">Bootnode Chakra Card</Heading>
      <Text mt="3" color="gray.600">
        This sample card ships with your generated starter.
      </Text>
      <Button mt="4" colorScheme="blue">
        Explore
      </Button>
    </Box>
  );
}
`,
  };

  return templates[uiLibrary] || null;
}

function buildStylingFile(styling) {
  const files = {
    tailwind: `@import "tailwindcss";

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased;
  }
}
`,
    bootstrap: `:root {
  --bs-primary: #0f172a;
  --bs-border-radius: 1rem;
}
`,
    scss: `$brand: #0f172a;
$surface: #f8fafc;

body {
  background: $surface;
  color: $brand;
}
`,
    unocss: `@unocss;

body {
  font-family: Inter, sans-serif;
}
`,
  };

  return files[styling] || "";
}

function buildConfigFile(styling, stack) {
  const configs = {
    tailwind:
      stack === "nextjs"
        ? {
            relativePath: "tailwind.config.js",
            content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
          }
        : {
            relativePath: "tailwind.config.js",
            content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
          },
    unocss: {
      relativePath: "uno.config.js",
      content: `import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
});
`,
    },
  };

  return configs[styling] || null;
}

function buildUiProvider(uiLibrary, language) {
  const isTs = language === "typescript";

  if (uiLibrary === "chakra") {
    return isTs
      ? `import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";

type BootnodeUiProviderProps = {
  children: ReactNode;
};

export function BootnodeUiProvider({ children }: BootnodeUiProviderProps) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
`
      : `import { ChakraProvider } from "@chakra-ui/react";

export function BootnodeUiProvider({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
`;
  }

  if (uiLibrary === "nextui") {
    return isTs
      ? `import type { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

type BootnodeUiProviderProps = {
  children: ReactNode;
};

export function BootnodeUiProvider({ children }: BootnodeUiProviderProps) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
`
      : `import { NextUIProvider } from "@nextui-org/react";

export function BootnodeUiProvider({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
`;
  }

  if (uiLibrary === "mantine") {
    return isTs
      ? `import type { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";

type BootnodeUiProviderProps = {
  children: ReactNode;
};

export function BootnodeUiProvider({ children }: BootnodeUiProviderProps) {
  return <MantineProvider>{children}</MantineProvider>;
}
`
      : `import { MantineProvider } from "@mantine/core";

export function BootnodeUiProvider({ children }) {
  return <MantineProvider>{children}</MantineProvider>;
}
`;
  }

  return null;
}

function providerImportPath(stack) {
  if (stack === "nextjs") {
    return "@/providers/BootnodeUiProvider";
  }

  return "./providers/BootnodeUiProvider";
}

export class FeatureService {
  constructor({ templatesRoot = path.join(process.cwd(), "templates") } = {}) {
    this.templatesRoot = templatesRoot;
  }

  async applyFeatures({ config, projectDir }) {
    await this.injectTests({ config, projectDir });
    await this.injectStyling({ config, projectDir });
    await this.injectUiLibrary({ config, projectDir });
    await this.injectLicense({ config, projectDir });
    await this.injectReadme({ config, projectDir });
  }

  async injectTests({ config, projectDir }) {
    if (!config.includeTests) {
      return;
    }

    const candidates = [
      path.join(this.templatesRoot, config.category, "tests", config.language, config.stack),
      path.join(this.templatesRoot, "web-dev", "tests", config.language, config.stack),
      path.join(this.templatesRoot, config.category, "tests", config.language),
      path.join(this.templatesRoot, "web-dev", "tests", config.language),
    ];

    const sourceDir = await this.findExistingDirectory(candidates);
    if (!sourceDir) {
      throw new GenerationError(`Test boilerplate missing for ${config.language}/${config.stack}.`, 404);
    }

    await fs.copy(sourceDir, path.join(projectDir, "tests"));
  }

  async injectStyling({ config, projectDir }) {
    if (!config.styling || config.styling === "none") {
      return;
    }

    const preset = STYLING_PRESETS[config.styling];
    if (!preset) {
      return;
    }

    const frontendRoot = await this.resolveFrontendRoot(projectDir);
    const packageJsonPath = await this.findPackageJson(frontendRoot);

    if (packageJsonPath) {
      await this.mergePackageSections(packageJsonPath, preset.dependencies);
    }

    const stylesPath = getFrontendStylesPath(frontendRoot, config.stack, config.styling);
    await fs.ensureDir(path.dirname(stylesPath));
    await fs.writeFile(stylesPath, buildStylingFile(config.styling), "utf8");

    const configFile = buildConfigFile(config.styling, config.stack);
    if (configFile) {
      await fs.writeFile(path.join(frontendRoot, configFile.relativePath), configFile.content, "utf8");
    }

    await this.connectStylingEntry({ config, frontendRoot, stylesPath });
  }

  async injectUiLibrary({ config, projectDir }) {
    if (!config.uiLibrary || config.uiLibrary === "none") {
      return;
    }

    const preset = UI_LIBRARY_PRESETS[config.uiLibrary];
    if (!preset) {
      return;
    }

    if (preset.requiresStyling && config.styling !== preset.requiresStyling) {
      return;
    }

    const frontendRoot = await this.resolveFrontendRoot(projectDir);
    const packageJsonPath = await this.findPackageJson(frontendRoot);

    if (packageJsonPath) {
      await this.mergePackageSections(packageJsonPath, preset.dependencies);
    }

    const snippetDir = await this.findExistingDirectory([
      path.join(this.templatesRoot, config.category, "snippets", config.uiLibrary),
      path.join(this.templatesRoot, "web-dev", "snippets", config.uiLibrary),
    ]);

    if (snippetDir) {
      await fs.copy(snippetDir, frontendRoot, { overwrite: true });
    }

    const componentContent = buildUiComponent(config.uiLibrary, config.language);
    if (componentContent) {
      const componentPath = getUiComponentPath(frontendRoot, config.language, config.uiLibrary);
      await fs.ensureDir(path.dirname(componentPath));
      await fs.writeFile(componentPath, componentContent, "utf8");
      await this.connectUiShowcase({
        config,
        frontendRoot,
        componentPath,
      });
    }

    const providerContent = buildUiProvider(config.uiLibrary, config.language);
    if (providerContent) {
      const providerPath = getProviderFilePath(frontendRoot, config.language);
      await fs.ensureDir(path.dirname(providerPath));
      await fs.writeFile(providerPath, providerContent, "utf8");
      await this.connectUiProvider({ config, frontendRoot });
    }
  }

  async injectLicense({ config, projectDir }) {
    if (!config.selectedLicense || config.selectedLicense === "none") {
      return;
    }

    const candidates = [
      path.join(this.templatesRoot, config.category, "licenses", `${config.selectedLicense}.txt`),
      path.join(this.templatesRoot, "web-dev", "licenses", `${config.selectedLicense}.txt`),
      path.join(this.templatesRoot, "licenses", `${config.selectedLicense}.txt`),
    ];

    const licensePath = await this.findExistingFile(candidates);
    if (!licensePath) {
      throw new GenerationError(`License template "${config.selectedLicense}" was not found.`, 404);
    }

    const licenseText = await fs.readFile(licensePath, "utf8");
    await fs.writeFile(path.join(projectDir, "LICENSE"), licenseText, "utf8");
  }

  async injectReadme({ config, projectDir }) {
    if (!config.includeReadme) {
      return;
    }

    const readme = config.readmeContent || this.buildReadme(config);
    await fs.writeFile(path.join(projectDir, "README.md"), readme, "utf8");
  }

  buildReadme(config) {
    const technologies = [
      titleize(config.rawStack || config.stack),
      config.language === "typescript" ? "TypeScript" : "JavaScript",
    ];

    if (config.styling && config.styling !== "none") {
      technologies.push(titleize(config.styling));
    }

    if (config.uiLibrary && config.uiLibrary !== "none") {
      technologies.push(titleize(config.uiLibrary));
    }

    if (config.includeTests) {
      technologies.push("Testing Boilerplate");
    }

    const clientDeps =
      config.clientDeps.length > 0
        ? config.clientDeps.map((dep) => `- \`${dep.name}\``).join("\n")
        : "- None selected";
    const serverDeps =
      config.serverDeps.length > 0
        ? config.serverDeps.map((dep) => `- \`${dep.name}\``).join("\n")
        : "- None selected";

    return `# ${config.projectName}

Generated by bootnode.

## Chosen Technologies

${technologies.map((item) => `- ${item}`).join("\n")}

## Client Dependencies

${clientDeps}

## Server Dependencies

${serverDeps}

## Getting Started

1. Install dependencies with your preferred package manager.
2. Review the generated configuration and environment variables.
3. Start the client and server apps as needed for your selected stack.
`;
  }

  async resolveFrontendRoot(projectDir) {
    const clientDir = path.join(projectDir, "client");
    if (await fs.pathExists(clientDir)) {
      return clientDir;
    }

    return projectDir;
  }

  async findPackageJson(baseDir) {
    const packageJsonPath = path.join(baseDir, "package.json");
    if (await fs.pathExists(packageJsonPath)) {
      return packageJsonPath;
    }

    return null;
  }

  async mergePackageSections(packageJsonPath, dependencyList) {
    const pkg = await fs.readJson(packageJsonPath);

    for (const dependency of dependencyList) {
      if (dependency.manager !== "npm") {
        continue;
      }

      const section = dependency.section || "dependencies";
      const current = { ...(pkg[section] || {}) };

      if (!current[dependency.name]) {
        current[dependency.name] = dependency.version;
      }

      pkg[section] = sortObject(current);
    }

    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  }

  async connectStylingEntry({ config, frontendRoot, stylesPath }) {
    const relativeImport = `./${path.relative(path.join(frontendRoot, "src"), stylesPath).replace(/\\/g, "/")}`;

    if (config.stack === "nextjs") {
      const layoutFile = await this.findExistingFile([
        path.join(frontendRoot, "src", "app", "layout.tsx"),
        path.join(frontendRoot, "src", "app", "layout.jsx"),
      ]);

      if (!layoutFile) {
        return;
      }

      const content = await fs.readFile(layoutFile, "utf8");
      const importPath = `../styles/${path.basename(stylesPath).replace(/\\/g, "/")}`;

      if (!content.includes(importPath)) {
        const nextContent = content.replace(
          /import "\.\/globals\.css";/,
          `import "./globals.css";\nimport "${importPath}";`
        );
        await fs.writeFile(layoutFile, nextContent, "utf8");
      }

      return;
    }

    const mainFile = await this.findExistingFile([
      path.join(frontendRoot, "src", "main.tsx"),
      path.join(frontendRoot, "src", "main.jsx"),
    ]);

    if (!mainFile) {
      return;
    }

    const content = await fs.readFile(mainFile, "utf8");
    if (!content.includes(relativeImport)) {
      const nextContent = insertImport(content, `import "${relativeImport}";`);
      await fs.writeFile(mainFile, nextContent, "utf8");
    }
  }

  async connectUiProvider({ config, frontendRoot }) {
    const importPath = providerImportPath(config.stack);

    if (config.stack === "nextjs") {
      const layoutFile = await this.findExistingFile([
        path.join(frontendRoot, "src", "app", "layout.tsx"),
        path.join(frontendRoot, "src", "app", "layout.jsx"),
      ]);

      if (!layoutFile) {
        return;
      }

      let content = await fs.readFile(layoutFile, "utf8");
      content = insertImport(content, `import { BootnodeUiProvider } from "${importPath}";`);

      if (!content.includes("<BootnodeUiProvider>")) {
        content = content.replace(
          /<ThemeProvider>\s*([\s\S]*?)\s*<\/ThemeProvider>/,
          `<ThemeProvider>\n          <BootnodeUiProvider>\n$1\n          </BootnodeUiProvider>\n        </ThemeProvider>`
        );
      }

      await fs.writeFile(layoutFile, content, "utf8");
      return;
    }

    const mainFile = await this.findExistingFile([
      path.join(frontendRoot, "src", "main.tsx"),
      path.join(frontendRoot, "src", "main.jsx"),
    ]);

    if (!mainFile) {
      return;
    }

    let content = await fs.readFile(mainFile, "utf8");
    content = insertImport(content, `import { BootnodeUiProvider } from "${importPath}";`);

    if (!content.includes("<BootnodeUiProvider>")) {
      content = content.replace(
        /<React\.StrictMode>\s*([\s\S]*?)\s*<\/React\.StrictMode>/,
        `<React.StrictMode>\n    <BootnodeUiProvider>\n$1\n    </BootnodeUiProvider>\n  </React.StrictMode>`
      );
    }

    await fs.writeFile(mainFile, content, "utf8");
  }

  async connectUiShowcase({ config, frontendRoot, componentPath }) {
    const componentName = path.basename(componentPath).replace(/\.(jsx|tsx)$/, "");
    const importPath =
      config.stack === "nextjs"
        ? `@/components/ui/${componentName}`
        : `./components/ui/${componentName}`;

    if (config.stack === "nextjs") {
      const pageFile = await this.findExistingFile([
        path.join(frontendRoot, "src", "app", "page.tsx"),
        path.join(frontendRoot, "src", "app", "page.jsx"),
      ]);

      if (!pageFile) {
        return;
      }

      let content = await fs.readFile(pageFile, "utf8");
      content = insertImport(content, `import { ${componentName} } from "${importPath}";`);

      if (!content.includes(`<${componentName} />`)) {
        content = content.replace(
          /<\/div>\s*\);\s*}$/,
          `      <div className={styles.actions}>\n        <${componentName} />\n      </div>\n    </div>\n  );\n}`
        );
      }

      await fs.writeFile(pageFile, content, "utf8");
      return;
    }

    const appFile = await this.findExistingFile([
      path.join(frontendRoot, "src", "App.tsx"),
      path.join(frontendRoot, "src", "App.jsx"),
    ]);

    if (!appFile) {
      return;
    }

    let content = await fs.readFile(appFile, "utf8");
    content = insertImport(content, `import { ${componentName} } from "${importPath}";`);

    if (!content.includes(`<${componentName} />`)) {
      if (config.stack === "mern") {
        content = content.replace(
          /<\/Routes>\s*<\/BrowserRouter>/,
          `</Routes>\n            <section style={{ padding: "1rem 1.5rem" }}>\n              <${componentName} />\n            </section>\n        </BrowserRouter>`
        );
      } else if (config.stack === "django-react") {
        content = content.replace(
          /return <AppRoutes \/>/,
          `return (\n    <>\n      <AppRoutes />\n      <div style={{ padding: "1.5rem" }}>\n        <${componentName} />\n      </div>\n    </>\n  )`
        );
      }
    }

    await fs.writeFile(appFile, content, "utf8");
  }

  async findExistingDirectory(candidates) {
    for (const candidate of candidates) {
      if (await fs.pathExists(candidate)) {
        const stats = await fs.stat(candidate);
        if (stats.isDirectory()) {
          return candidate;
        }
      }
    }

    return null;
  }

  async findExistingFile(candidates) {
    for (const candidate of candidates) {
      if (await fs.pathExists(candidate)) {
        const stats = await fs.stat(candidate);
        if (stats.isFile()) {
          return candidate;
        }
      }
    }

    return null;
  }
}
