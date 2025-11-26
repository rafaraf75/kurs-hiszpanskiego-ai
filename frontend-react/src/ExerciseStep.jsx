import { useState } from "react";

export default function ExerciseStep({ exercise, onFinish }) {
  // hooki muszą być na górze komponentu
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!exercise) {
    return <p>Brak ćwiczenia w tej lekcji.</p>;
  }

  const questions = exercise.pytania || [];
  const answers = exercise.odpowiedzi || [];

  // zabezpieczenie, gdyby tablice były różnej długości
  const total = Math.min(questions.length, answers.length);

  if (total === 0) {
    return <p>Brak pytań w ćwiczeniu.</p>;
  }

  const isLast = currentIndex === total - 1;

  const question = questions[currentIndex];
  const answer = answers[currentIndex];

  const handleToggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleNext = () => {
    if (isLast) {
      if (onFinish) onFinish();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setShowAnswer(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: "#0f172a",
        color: "#f9fafb",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.65)",
      }}
    >
      {/* Nagłówek etapu */}
      <div style={{ marginBottom: "12px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "1.1rem",
            marginBottom: "4px",
          }}
        >
          Etap 3 – Ćwiczenie tłumaczeniowe
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            opacity: 0.9,
          }}
        >
          Przetłumacz zdanie z polskiego na hiszpański (w myślach lub na kartce), a
          potem porównaj z odpowiedzią.
        </p>
      </div>

      {/* Informacja o numerze pytania */}
      <p
        style={{
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "0.9rem",
          opacity: 0.9,
        }}
      >
        Pytanie {currentIndex + 1} z {total}
      </p>

      {/* Karta z pytaniem */}
      <div
        style={{
          padding: "24px 20px",
          borderRadius: "16px",
          background: "radial-gradient(circle at top, #111827, #020617)",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "1.05rem",
          }}
        >
          {question}
        </p>
      </div>

      {/* Przyciski: pokaż odpowiedź i następne */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: showAnswer ? "14px" : "4px",
        }}
      >
        <button
          onClick={handleToggleAnswer}
          style={{
            padding: "8px 12px",
            borderRadius: "999px",
            border: "1px solid #4b5563",
            cursor: "pointer",
            background: "#020617",
            color: "#f9fafb",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {showAnswer ? "Ukryj odpowiedź" : "Pokaż odpowiedź"}
        </button>

        <button
          onClick={handleNext}
          style={{
            padding: "10px 12px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(to right, #3b82f6, #22c55e)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {isLast ? "Zakończ ćwiczenie" : "Następne pytanie"}
        </button>
      </div>

      {/* Odpowiedź po hiszpańsku */}
      {showAnswer && (
        <div
          style={{
            marginTop: "8px",
            padding: "16px 18px",
            borderRadius: "14px",
            background: "#020617",
          }}
        >
          <p
            style={{
              marginTop: 0,
              marginBottom: "8px",
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            Proponowana odpowiedź po hiszpańsku:
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "1.02rem",
              fontWeight: 500,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}