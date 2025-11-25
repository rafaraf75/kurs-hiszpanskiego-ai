function speakEs(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("TTS nie działa w tej przeglądarce", e);
  }
}

export default function SentencesStep({ sentence, index, total, onDone }) {
  if (!sentence) {
    return <p>Brak zdań w tej lekcji.</p>;
  }

  const currentNumber = index + 1;

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
          Etap 2 – Zdania do odsłuchu
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            opacity: 0.9,
          }}
        >
          Zdanie {currentNumber} z {total}
        </p>
      </div>

      {/* Karta ze zdaniem */}
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
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          {sentence.es}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            opacity: 0.9,
            fontStyle: "italic",
          }}
        >
          ({sentence.pl})
        </p>
      </div>

      {/* Audio */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "flex-start",
          gap: "12px",
        }}
      >
        <button
          onClick={() => speakEs(sentence.es)}
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
          <span>Odtwórz zdanie</span>
        </button>
      </div>

      {/* Przyciski nawigacji */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onDone}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: "#22c55e",
            color: "white",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Następne zdanie
        </button>
      </div>
    </div>
  );
}