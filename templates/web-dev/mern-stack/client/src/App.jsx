import { Navbar } from "./components/Navbar.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: "40rem" }}>
        <h1 style={{ marginTop: 0 }}>Hello from Bootnode</h1>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          Client runs on Vite. Point fetches to <code>http://localhost:5000/api</code>{" "}
          (see server folder).
        </p>
      </main>
    </>
  );
}
