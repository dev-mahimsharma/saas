# Vanilla TypeScript Starter

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
