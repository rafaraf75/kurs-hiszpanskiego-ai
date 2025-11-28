import { useState } from "react";
import Flashcards from "./Flashcards";

export default function ReviewView({ words, onExit, onClear }) {
  const [index, setIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);

  if (!words || words.length === 0) {
    return (
      <div
        style={{
          marginTop: 24,
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2>Powtórka słówek</h2>
        <p>Nie masz jeszcze żadnych słówek do powtórki.</p>
        <button
          onClick={onExit}
          style={{
            marginTop: 12,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#3b82f6",
            color: "white",
            fontWeight: 600,
          }}
        >
          Wróć do lekcji
        </button>
      </div>
    );
  }

  const isFinished = index >= words.length;

  function handleAnswer(known) {
    if (isFinished) return;

    if (known) setKnownCount((prev) => prev + 1);
    setIndex((prev) => prev + 1);
  }

  return (
    <div
      style={{
        marginTop: 24,
        maxWidth: 900,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2>Powtórka słówek</h2>
      <p style={{ marginTop: 0, marginBottom: 16, color: "#e5e7eb" }}>
        Słówka, których wcześniej nie znałeś. Spróbuj je powtórzyć, a potem
        wróć do nowych lekcji.
      </p>

      {!isFinished ? (
        <Flashcards
          words={words}
          index={index}
          knownCount={knownCount}
          onAnswer={handleAnswer}
        />
      ) : (
        <div
          style={{
            background: "#020617",
            padding: "20px 24px",
            borderRadius: 18,
            boxShadow: "0 18px 40px rgba(0,0,0,0.65)",
            marginTop: 12,
          }}
        >
          <h3>Powtórka zakończona 🎉</h3>
          <p>
            Znałeś teraz {knownCount} z {words.length} słówek do powtórki.
          </p>
          <p style={{ marginTop: 8, color: "#d1d5db" }}>
            Możesz wrócić do kolejnych lekcji albo wyczyścić listę powtórek.
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={onExit}
              style={{
                flex: 1,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#3b82f6",
                color: "white",
                fontWeight: 600,
              }}
            >
              Wróć do lekcji
            </button>
            <button
              onClick={onClear}
              style={{
                flex: 1,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#ef4444",
                color: "white",
                fontWeight: 600,
              }}
            >
              Wyczyść listę powtórek
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
