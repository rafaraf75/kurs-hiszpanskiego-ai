import { useState } from "react";

export default function ExerciseStep({ exercise, onFinish }) {
  // Hook ZAWSZE na górze komponentu
  const [showAnswers, setShowAnswers] = useState(false);

  if (!exercise) {
    return <p>Brak ćwiczenia w tej lekcji.</p>;
  }

  const questions = exercise.pytania || [];
  const answers = exercise.odpowiedzi || [];

  const handleToggleAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

  const handleFinish = () => {
    if (onFinish) onFinish();
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
          Przetłumacz zdania z polskiego na hiszpański (w myślach lub na kartce), a
          potem porównaj z odpowiedziami.
        </p>
      </div>

      {/* Lista pytań */}
      <div
        style={{
          padding: "20px 18px",
          borderRadius: "16px",
          background: "radial-gradient(circle at top, #111827, #020617)",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            marginTop: 0,
            marginBottom: "10px",
            fontSize: "0.95rem",
            opacity: 0.9,
          }}
        >
          Z polskiego na hiszpański:
        </p>

        <ol
          style={{
            paddingLeft: "20px",
            margin: 0,
            display: "grid",
            gap: "6px",
            fontSize: "0.98rem",
          }}
        >
          {questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </div>

      {/* Przyciski: pokaż odpowiedzi + zakończ */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: showAnswers ? "14px" : "0",
        }}
      >
        <button
          onClick={handleToggleAnswers}
          style={{
            flex: "1 1 160px",
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
          {showAnswers ? "Ukryj odpowiedzi" : "Pokaż odpowiedzi"}
        </button>

        <button
          onClick={handleFinish}
          style={{
            flex: "1 1 160px",
            padding: "8px 12px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(to right, #3b82f6, #22c55e)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Zakończ ćwiczenie
        </button>
      </div>

      {/* Odpowiedzi po hiszpańsku */}
      {showAnswers && (
        <div
          style={{
            marginTop: "10px",
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
            Proponowane odpowiedzi po hiszpańsku:
          </p>

          <ol
            style={{
              paddingLeft: "20px",
              margin: 0,
              display: "grid",
              gap: "6px",
              fontSize: "0.98rem",
            }}
          >
            {answers.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}