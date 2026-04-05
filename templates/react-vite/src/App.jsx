import { Header } from "./components/Header.jsx";

export default function App() {
  return (
    <main className="app">
      <Header />
      <section className="content">
        <h1>Hello from Bootnode</h1>
        <p>
          Start editing <code>src/App.jsx</code>. Reusable UI lives in{" "}
          <code>src/components/</code>.
        </p>
      </section>
    </main>
  );
}
