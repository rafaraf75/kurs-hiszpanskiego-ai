import { useState, useEffect } from "react";
import LessonView from "./LessonView";
import ReviewView from "./ReviewView";

const STORAGE_KEY = "kurs_hiszpanski_a1_react_progress_v1";

function App() {
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [reviewWords, setReviewWords] = useState([]);
  const [mode, setMode] = useState("lesson"); // "lesson" | "review"
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
      if (saved && Array.isArray(saved.reviewWords)) {
        setReviewWords(saved.reviewWords);
      }
    } catch (e) {
      console.warn("Nie udało się wczytać stanu z localStorage", e);
    }
  }, []);

  // 🔹 zapis stanu do localStorage, gdy zmienia się lekcja / progress / reviewWords
  useEffect(() => {
    if (!lesson && reviewWords.length === 0) return;

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
    setMode("lesson");

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

      // 🔹 nowa lekcja = reset postępu (ale NIE resetujemy powtórek!)
      setProgress({
        phase: "intro",
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

  // 🔹 reset – czyści localStorage i stan w pamięci (łącznie z powtórkami)
  function resetLesson() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Nie udało się usunąć stanu z localStorage", e);
    }
    setLesson(null);
    setProgress(null);
    setReviewWords([]);
    setMode("lesson");
    setError("");
  }

  // 🔹 callback z LessonView – aktualizuje stan postępu
  function handleProgressChange(newProgress) {
    setProgress(newProgress);
  }

  // 🔹 callback z LessonView – dodawanie słówek do powtórki
  function handleUnknownWord(word) {
    setReviewWords((prev) => {
      if (!word || !word.es) return prev;
      const exists = prev.some((w) => w.es === word.es);
      if (exists) return prev;
      return [...prev, word];
    });
  }

  // 🔹 przejście do trybu powtórki
  function openReview() {
    if (reviewWords.length === 0) return;
    setMode("review");
  }

  function exitReview() {
    setMode("lesson");
  }

  function clearReview() {
    setReviewWords([]);
  }

  const hasLesson = !!lesson;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif", color: "#f9fafb", background: "#020617", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "16px" }}>Kurs hiszpańskiego AI – React</h1>

      {/* Górne przyciski */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          onClick={loadLesson}
          disabled={loading}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            background: "#111827",
            color: "#f9fafb",
          }}
        >
          {loading
            ? "Ładowanie..."
            : hasLesson
            ? "Pobierz inną lekcję"
            : "Pobierz pierwszą lekcję"}
        </button>

        <button
          onClick={resetLesson}
          disabled={!hasLesson && reviewWords.length === 0}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor:
              !hasLesson && reviewWords.length === 0 ? "not-allowed" : "pointer",
            background: "#111827",
            color:
              !hasLesson && reviewWords.length === 0 ? "#6b7280" : "#f9fafb",
          }}
        >
          Rozpocznij od nowa
        </button>

        <button
          onClick={openReview}
          disabled={reviewWords.length === 0}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: reviewWords.length === 0 ? "not-allowed" : "pointer",
            background:
              reviewWords.length === 0 ? "#111827" : "#16a34a",
            color: reviewWords.length === 0 ? "#6b7280" : "white",
            marginLeft: "auto",
          }}
        >
          Powtórz słówka ({reviewWords.length})
        </button>
      </div>

      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {/* Główna zawartość: tryb lekcji vs tryb powtórki */}
      {mode === "lesson" ? (
        hasLesson ? (
          <LessonView
            lesson={lesson}
            progress={progress}
            onProgressChange={handleProgressChange}
            onNewLesson={loadLesson}
            onUnknownWord={handleUnknownWord}
          />
        ) : (
          <p style={{ marginTop: "10px" }}>
            Kliknij „Pobierz lekcję”, aby zacząć.
          </p>
        )
      ) : (
        <ReviewView
          words={reviewWords}
          onExit={exitReview}
          onClear={clearReview}
        />
      )}
    </div>
  );
}

export default App;