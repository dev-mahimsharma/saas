"use client";

/**
 * src/app/page.tsx: The default entry point of your application.
 */
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/common/Button";
import styles from "./page.module.css";

export default function Home() {
  const { width, height } = useWindowSize();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      <h1>Welcome to the Professional Architecture</h1>
      
      <div className={styles.infoCard}>
        <h2>System Info</h2>
        <p>Current Window Dimensions:</p>
        <p>
          <strong>Width:</strong> {width}px | <strong>Height:</strong> {height}px
        </p>
        <p><strong>Theme:</strong> {theme}</p>
      </div>

      <div className={styles.actions}>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
    </div>
  );
}
