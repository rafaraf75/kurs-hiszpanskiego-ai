// frontend-react/src/ReviewView.jsx
import { useState } from "react";
import { speakEs } from "./tts";

export default function ReviewView({ words, onBack, onClear }) {
  // na razie powtarzamy wszystkie słówka z listy
  const hardWords = words || [];

  const [index, setIndex] = useState(0);
  const total = hardWords.length;
  const current = total > 0 ? hardWords[Math.min(index, total - 1)] : null;

  // nic do powtórki
  if (total === 0) {
    return (
      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          borderRadius: "16px",
          background: "#020617",
          color: "#e5e7eb",
          maxWidth: "720px",
          marginInline: "auto",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
          Nie ma słówek do powtórki 🎉
        </h2>
        <p style={{ marginBottom: "20px" }}>
          W tej lekcji wszystkie słówka oznaczyłeś jako znane.
        </p>
        <button
          onClick={onBack}
          style={{
            padding: "10px 16px",
            borderRadius: "999px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Wróć do lekcji
        </button>
      </div>
    );
  }

  const progress = ((index + 1) / total) * 100;

  function handleNext() {
    setIndex((prev) => (prev + 1 < total ? prev + 1 : prev));
  }

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "24px",
        borderRadius: "16px",
        background: "#020617",
        color: "#e5e7eb",
        maxWidth: "720px",
        marginInline: "auto",
      }}
    >
      <p style={{ marginTop: 0, marginBottom: "8px", fontSize: "0.9rem" }}>
        Powtórka słówek –{" "}
        <span style={{ fontWeight: 600 }}>
          {index + 1} z {total}
        </span>
      </p>

      {/* pasek postępu */}
      <div
        style={{
          height: "6px",
          borderRadius: "999px",
          background: "#111827",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(to right, #22c55e, #0ea5e9)",
            transition: "width 0.2s ease-out",
          }}
        />
      </div>

      {/* karta ze słówkiem */}
      <div
        style={{
          padding: "32px 24px",
          borderRadius: "16px",
          background:
            "radial-gradient(circle at top, #020617, #020617 40%, #020617 100%)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          {current?.es}
        </div>
        <div
          style={{
            fontSize: "1.1rem",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          {current?.pl}
        </div>
      </div>

      {/* przycisk audio */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <button
          onClick={() => speakEs(current?.es)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1px solid #4b5563",
            background: "#020617",
            color: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          <span role="img" aria-label="audio">
            🔊
          </span>
          Odtwórz wymowę
        </button>
      </div>

      {/* nawigacja */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: "999px",
            border: "none",
            background: "#374151",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Wróć do lekcji
        </button>

        <button
          onClick={handleNext}
          disabled={index + 1 >= total}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: "999px",
            border: "none",
            background: index + 1 >= total ? "#4b5563" : "#22c55e",
            color: "white",
            fontWeight: 600,
            cursor: index + 1 >= total ? "not-allowed" : "pointer",
          }}
        >
          {index + 1 >= total ? "Koniec powtórki" : "Następne słówko"}
        </button>
      </div>

      {/* opcjonalnie przycisk do wyczyszczenia listy powtórek */}
      {onClear && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={onClear}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "none",
              background: "#6b7280",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Wyczyść listę powtórek
          </button>
        </div>
      )}
    </div>
  );
}