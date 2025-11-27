// frontend-react/src/ExerciseStep.jsx
import { useState } from "react";

export default function ExerciseStep({ exercise, onFinish }) {
  // przygotowanie danych ćwiczenia
  const hasExercise = exercise && exercise.pytania && exercise.pytania.length > 0;
  const questions = hasExercise ? exercise.pytania : [];
  const answers = hasExercise ? exercise.odpowiedzi || [] : [];
  const total = questions.length;

  // hooki MUSZĄ być zawsze wywołane
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // jeśli jednak nie ma ćwiczenia – dopiero teraz zwracamy
  if (!hasExercise) {
    return <p>Brak ćwiczenia w tej lekcji.</p>;
  }

  const question = questions[currentIndex];
  const answer = answers[currentIndex] || "Brak odpowiedzi";

  const isLast = currentIndex === total - 1;
  const progressPercent = ((currentIndex + 1) / total) * 100;

  function handleToggleAnswer() {
    setShowAnswer((prev) => !prev);
  }

  function handleNext() {
    if (isLast) {
      if (onFinish) onFinish();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setShowAnswer(false);
  }

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "24px",
        borderRadius: "16px",
        background: "#020617",
        boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
        color: "#e5e7eb",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
        Etap 3 – Ćwiczenie tłumaczeniowe
      </h3>
      <p style={{ marginTop: 0, marginBottom: "16px", opacity: 0.85 }}>
        Przetłumacz zdanie z polskiego na hiszpański (w myślach lub na kartce), a
        potem porównaj z odpowiedzią.
      </p>

      {/* Pasek postępu */}
      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            fontSize: "0.9rem",
            opacity: 0.9,
          }}
        >
          <span>
            Pytanie {currentIndex + 1} z {total}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "999px",
            background: "rgba(148, 163, 184, 0.4)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #22c55e, #4ade80, #a7f3d0)",
              transition: "width 0.35s ease",
            }}
          />
        </div>
      </div>

      {/* Karta ćwiczenia */}
      <div
        style={{
          marginTop: "18px",
          padding: "24px",
          borderRadius: "16px",
          background:
            "radial-gradient(circle at top, #020617 0%, #020617 35%, #020617 60%, #020617 100%)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            marginTop: 0,
            marginBottom: "10px",
            opacity: 0.8,
          }}
        >
          Pytanie {currentIndex + 1} z {total}
        </p>

        <div
          style={{
            fontSize: "1.1rem",
            marginBottom: "18px",
            lineHeight: 1.5,
          }}
        >
          {question}
        </div>

        {/* Odpowiedź – pokaż / ukryj */}
        <button
          onClick={handleToggleAnswer}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(148, 163, 184, 0.8)",
            background: showAnswer ? "rgba(15, 23, 42, 0.9)" : "transparent",
            color: "#e5e7eb",
            cursor: "pointer",
            fontWeight: 500,
            marginBottom: showAnswer ? "14px" : 0,
            transition: "background 0.2s ease, transform 0.05s ease",
          }}
        >
          {showAnswer ? "Ukryj odpowiedź" : "Pokaż odpowiedź"}
        </button>

        {showAnswer && (
          <div
            style={{
              marginTop: "4px",
              padding: "14px 16px",
              borderRadius: "12px",
              background:
                "radial-gradient(circle at top, #022c22 0%, #022c22 40%, #052e16 100%)",
              border: "1px solid rgba(74, 222, 128, 0.4)",
              fontSize: "1rem",
            }}
          >
            <p
              style={{
                margin: 0,
                marginBottom: "4px",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.8,
              }}
            >
              Proponowana odpowiedź po hiszpańsku:
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {answer}
            </p>
          </div>
        )}
      </div>

      {/* Przyciski na dole */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleNext}
          style={{
            padding: "10px 24px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: isLast
              ? "linear-gradient(90deg, #3b82f6, #6366f1)"
              : "linear-gradient(90deg, #22c55e, #16a34a)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.95rem",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.6)",
          }}
        >
          {isLast ? "Zakończ ćwiczenie" : "Następne pytanie"}
        </button>
      </div>
    </div>
  );
}