// frontend-react/src/Flashcards.jsx
import { speakEs } from "./tts";

export default function Flashcards({ words, index, knownCount, onAnswer }) {
  if (!words || words.length === 0) {
    return <p>Brak słówek w tej lekcji.</p>;
  }

  const isFinished = index >= words.length;
  const current = words[Math.min(index, words.length - 1)];

  const currentIndexSafe = Math.min(index, words.length);
  const progressPercent = (currentIndexSafe / words.length) * 100;

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
      {/* Pasek postępu */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            fontSize: "0.9rem",
            marginBottom: "4px",
            opacity: 0.9,
          }}
        >
          Słówko {currentIndexSafe + (isFinished ? 0 : 1)} z {words.length} •
          Znałem: {knownCount}
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "999px",
            background: "#1f2937",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              transition: "width 0.25s ease-out",
              background: "linear-gradient(to right, #22c55e, #22d3ee)",
            }}
          />
        </div>
      </div>

      {!isFinished ? (
        <>
          {/* Karta ze słówkiem */}
          <div
            style={{
              padding: "28px 20px",
              borderRadius: "16px",
              background: "radial-gradient(circle at top, #111827, #020617)",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "2.1rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                marginBottom: "10px",
              }}
            >
              {current.es}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                opacity: 0.9,
              }}
            >
              {current.pl}
            </div>
          </div>

          {/* Audio */}
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => speakEs(current.es)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid #4b5563",
                cursor: "pointer",
                background: "#020617",
                color: "white",
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🔊</span>
              <span>Odtwórz wymowę</span>
            </button>
          </div>

          {/* Przyciski odpowiedzi */}
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => onAnswer(true)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(to right, #22c55e, #16a34a)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              Znałem
            </button>
            <button
              onClick={() => onAnswer(false)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(to right, #f97316, #ef4444)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              Nie znałem
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            padding: "24px 18px",
            borderRadius: "16px",
            background: "radial-gradient(circle at top, #111827, #020617)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.3rem", marginBottom: "8px" }}>
            Koniec słówek! 🎉
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.96 }}>
            Znałeś {knownCount} z {words.length} słówek.
          </div>
        </div>
      )}
    </div>
  );
}