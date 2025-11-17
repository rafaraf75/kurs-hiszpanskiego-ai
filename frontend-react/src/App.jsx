import { useState, useEffect } from "react";
import LessonView from "./LessonView";

const STORAGE_KEY = "kurs_hiszpanski_a1_react_progress_v1";

function App() {
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 wczytanie stanu z localStorage przy starcie
  useEffect(() => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) return;
      const saved = JSON.parse(json);

      if (saved && saved.lesson) {
        setLesson(saved.lesson);
        setProgress(saved.progress || null);
      }
    } catch (e) {
      console.warn("Nie udało się wczytać stanu z localStorage", e);
    }
  }, []);

  // 🔹 zapis stanu do localStorage, gdy zmienia się lekcja lub progress
  useEffect(() => {
    if (!lesson) return;

    const data = {
      lesson,
      progress,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Nie udało się zapisać stanu do localStorage", e);
    }
  }, [lesson, progress]);

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

      const newLesson = data.lekcja;
      setLesson(newLesson);

      // 🔹 nowa lekcja = reset postępu
      setProgress({
        phase: "flashcards",
        wordIndex: 0,
        knownCount: 0,
        sentenceIndex: 0,
      });
    } catch (err) {
      console.error("Błąd pobierania lekcji:", err);
      setError("Nie udało się pobrać lekcji.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 callback z LessonView – aktualizuje stan postępu
  function handleProgressChange(newProgress) {
    setProgress(newProgress);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Kurs hiszpańskiego AI – React</h1>

      <button onClick={loadLesson} disabled={loading}>
        {loading ? "Ładowanie..." : "Pobierz nową lekcję"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {lesson ? (
        <LessonView
          lesson={lesson}
          progress={progress}
          onProgressChange={handleProgressChange}
        />
      ) : (
        <p style={{ marginTop: "10px" }}>
          Kliknij przycisk, aby pobrać pierwszą lekcję.
        </p>
      )}
    </div>
  );
}

export default App;