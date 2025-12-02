// frontend-react/src/App.jsx
import { useState, useEffect } from "react";
import LessonView from "./LessonView";
import ReviewView from "./ReviewView";

const STORAGE_KEY = "kurs_hiszpanski_a1_react_progress_v2";

function App() {
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [reviewWords, setReviewWords] = useState([]); // słówka do powtórki
  const [view, setView] = useState("lesson"); // "lesson" | "review"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // wczytanie stanu z localStorage przy starcie
  useEffect(() => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) return;

      const saved = JSON.parse(json);

      if (saved && saved.lesson) {
        setLesson(saved.lesson);
        setProgress(saved.progress || null);
        setReviewWords(saved.reviewWords || []);
      }
    } catch (e) {
      console.warn("Nie udało się wczytać stanu z localStorage", e);
    }
  }, []);

  // zapis stanu do localStorage, gdy zmienia się lekcja / progres / powtórki
  useEffect(() => {
    if (!lesson) return;

    const data = {
      lesson,
      progress,
      reviewWords,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Nie udało się zapisać stanu do localStorage", e);
    }
  }, [lesson, progress, reviewWords]);

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

      // nowa lekcja = reset postępu
      setProgress({
        phase: "flashcards",
        wordIndex: 0,
        knownCount: 0,
        sentenceIndex: 0,
      });

      // i czyścimy listę powtórek
      setReviewWords([]);
      setView("lesson");
    } catch (err) {
      console.error("Błąd pobierania lekcji:", err);
      setError("Nie udało się pobrać lekcji.");
    } finally {
      setLoading(false);
    }
  }

  // reset – czyści localStorage i stan w pamięci
  function resetLesson() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Nie udało się usunąć stanu z localStorage", e);
    }
    setLesson(null);
    setProgress(null);
    setReviewWords([]);
    setError("");
    setView("lesson");
  }

  // callback z LessonView – aktualizuje stan postępu
  function handleProgressChange(newProgress) {
    setProgress(newProgress);
  }

  const hasLesson = !!lesson;
  const reviewCount = reviewWords.length;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Kurs hiszpańskiego AI – React</h1>

      {/* Górne przyciski */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button onClick={loadLesson} disabled={loading}>
          {loading
            ? "Ładowanie..."
            : hasLesson
            ? "Pobierz inną lekcję"
            : "Pobierz pierwszą lekcję"}
        </button>

        <button
          onClick={resetLesson}
          disabled={!hasLesson}
          style={{
            opacity: hasLesson ? 1 : 0.5,
            cursor: hasLesson ? "pointer" : "not-allowed",
          }}
        >
          Rozpocznij od nowa
        </button>

        <button
          onClick={() => {
            if (reviewCount > 0) {
              setView("review");
            }
          }}
          disabled={reviewCount === 0}
          style={{
            opacity: reviewCount === 0 ? 0.4 : 1,
            cursor: reviewCount === 0 ? "not-allowed" : "pointer",
          }}
        >
          Powtórz słówka ({reviewCount})
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!lesson && (
        <p style={{ marginTop: "10px" }}>
          Kliknij „Pobierz lekcję”, aby zacząć.
        </p>
      )}

      {lesson && view === "lesson" && (
        <LessonView
          lesson={lesson}
          progress={progress}
          onProgressChange={handleProgressChange}
          onNewLesson={loadLesson}
          reviewWords={reviewWords}
          onReviewWordsChange={setReviewWords}
        />
      )}

      {lesson && view === "review" && (
        <ReviewView
          words={reviewWords}
          onBack={() => setView("lesson")}
          onClear={() => setReviewWords([])}
        />
      )}
    </div>
  );
}

export default App;