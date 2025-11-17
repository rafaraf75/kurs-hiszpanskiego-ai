import { useState } from "react";

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function SentencesStep({ sentence, index, total, onDone }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);

  if (!sentence) {
    return <p>Brak zdań w tej lekcji.</p>;
  }

  const isLast = index === total - 1;

  function handleCheck() {
    if (!answer.trim()) {
      setFeedback("Wpisz odpowiedź, zanim sprawdzisz.");
      return;
    }

    const correct = sentence.es;
    const ok = normalize(answer) === normalize(correct);

    if (ok) {
      setFeedback("Świetnie! Odpowiedź jest poprawna ✅");
    } else {
      setFeedback(`Prawidłowe zdanie: "${correct}". Dobra próba!`);
    }

    setChecked(true);
  }

  function handleNext() {
    setAnswer("");
    setFeedback("");
    setChecked(false);
    onDone();
  }

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        borderRadius: "12px",
        background: "#111827",
        color: "#f9fafb",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Etap 2 – Zdania</h3>
      <p style={{ marginBottom: "4px" }}>
        Zdanie {index + 1} z {total}
      </p>

      <p style={{ marginBottom: "8px" }}>
        Po polsku: <strong>{sentence.pl}</strong>
      </p>

      <label style={{ display: "block", marginBottom: "4px" }}>
        Twoja odpowiedź po hiszpańsku:
      </label>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 8px",
          borderRadius: "8px",
          border: "1px solid #4b5563",
          marginBottom: "8px",
          background: "#0b1120",
          color: "white",
        }}
      />

      <div style={{ marginBottom: "8px" }}>
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
          Sprawdź
        </button>

        <button
          onClick={handleNext}
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
          {isLast ? "Przejdź do ćwiczeń" : "Następne zdanie"}
        </button>
      </div>

      {feedback && (
        <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>{feedback}</div>
      )}
    </div>
  );
}