import { useState } from "react";
import LessonView from "./LessonView";

function App() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadLesson() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/lekcja");
      const data = await res.json();

      if (data.status !== "ok") {
        console.error("Błędna odpowiedź z serwera", data);
        setError("Serwer zwrócił błąd.");
        return;
      }

      setLesson(data.lekcja);
    } catch (err) {
      console.error("Błąd pobierania lekcji:", err);
      setError("Nie udało się pobrać lekcji.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Kurs hiszpańskiego AI – React</h1>

      <button onClick={loadLesson} disabled={loading}>
        {loading ? "Ładowanie..." : "Pobierz nową lekcję"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {lesson ? (
        <LessonView lesson={lesson} />
      ) : (
        <p style={{ marginTop: "10px" }}>
          Kliknij przycisk, aby pobrać pierwszą lekcję.
        </p>
      )}
    </div>
  );
}

export default App;
