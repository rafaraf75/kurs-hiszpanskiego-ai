import { useState } from "react";

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function ExerciseStep({ exercise, onFinish }) {
  const [answers, setAnswers] = useState(
    exercise.pytania.map(() => "")
  );
  const [feedback, setFeedback] = useState(
    exercise.pytania.map(() => "")
  );
  const [checked, setChecked] = useState(false);

  function updateAnswer(index, value) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  function handleCheck() {
    const newFeedback = exercise.pytania.map((_, i) => {
      const user = answers[i].trim();
      const correct = exercise.odpowiedzi[i];

      if (!user) return "Uzupełnij odpowiedź.";

      if (normalize(user) === normalize(correct)) {
        return "OK ✅";
      } else {
        return `Nie do końca. Poprawna odpowiedź: ${correct}`;
      }
    });

    setFeedback(newFeedback);
    setChecked(true);
  }

  function handleShowAll() {
    const newFeedback = exercise.pytania.map(
      (_, i) => `Poprawna odpowiedź: ${exercise.odpowiedzi[i]}`
    );
    setFeedback(newFeedback);
    setChecked(true);
  }

  function handleFinish() {
    onFinish();
  }

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        borderRadius: "12px",
        background: "#020617",
        color: "#f9fafb",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Etap 3 – Ćwiczenie</h3>
      <p>Przetłumacz na hiszpański:</p>

      <div style={{ marginTop: "8px" }}>
        {exercise.pytania.map((q, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <p style={{ marginBottom: "4px" }}>
              {i + 1}. {q}
            </p>
            <input
              type="text"
              value={answers[i]}
              onChange={(e) => updateAnswer(i, e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                background: "#0b1120",
                color: "white",
                marginBottom: "4px",
              }}
            />
            {feedback[i] && (
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                {feedback[i]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "8px" }}>
        <button
          onClick={handleCheck}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#3b82f6",
            color: "white",
            fontWeight: 600,
          }}
        >
          Sprawdź odpowiedzi
        </button>

        <button
          onClick={handleShowAll}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#6b7280",
            color: "white",
            fontWeight: 600,
            marginLeft: "8px",
          }}
        >
          Pokaż poprawne odpowiedzi
        </button>

        <button
          onClick={handleFinish}
          disabled={!checked}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: checked ? "pointer" : "not-allowed",
            background: checked ? "#10b981" : "#4b5563",
            color: "white",
            fontWeight: 600,
            marginLeft: "8px",
          }}
        >
          Zakończ lekcję
        </button>
      </div>
    </div>
  );
}