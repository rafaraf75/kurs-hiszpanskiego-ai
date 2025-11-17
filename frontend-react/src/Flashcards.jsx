function speakEs(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("TTS nie działa w tej przeglądarce", e);
  }
}

export default function Flashcards({ words, index, knownCount, onAnswer }) {
  if (!words || words.length === 0) {
    return <p>Brak słówek w tej lekcji.</p>;
  }

  const isFinished = index >= words.length;
  const current = words[Math.min(index, words.length - 1)];

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "#1f2933",
        color: "#f9fafb",
      }}
    >
      {!isFinished ? (
        <>
          <p style={{ marginBottom: "8px" }}>
            Słówko {index + 1} z {words.length} • Znałem: {knownCount}
          </p>

          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: "#111827",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {current.es}
            </div>
            <div style={{ fontSize: "1.1rem", opacity: 0.85 }}>
              {current.pl}
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <button
              onClick={() => speakEs(current.es)}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#4b5563",
                color: "white",
              }}
            >
              🔊 Odtwórz
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onAnswer(true)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#10b981",
                color: "white",
                fontWeight: 600,
              }}
            >
              Znałem
            </button>
            <button
              onClick={() => onAnswer(false)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#ef4444",
                color: "white",
                fontWeight: 600,
              }}
            >
              Nie znałem
            </button>
          </div>
        </>
      ) : (
        <p>
          Koniec słówek! Znałeś {knownCount} z {words.length}. 🎉
        </p>
      )}
    </div>
  );
}