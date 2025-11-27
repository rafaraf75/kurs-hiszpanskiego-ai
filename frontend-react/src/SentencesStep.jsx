// frontend-react/src/SentencesStep.jsx
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

  const progressPercent = ((index + 1) / total) * 100;

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: "#0b1220",
        color: "#e5e7eb",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        marginTop: "16px",
      }}
    >
      {/* Pasek postępu dla zdań */}
      <div style={{ marginBottom: "12px" }}>
        <p
          style={{
            margin: 0,
            marginBottom: "4px",
            fontSize: "0.9rem",
            opacity: 0.85,
          }}
        >
          Zdanie {index + 1} z {total}
        </p>
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "999px",
            background: "#111827",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #22c55e 0%, #2dd4bf 50%, #60a5fa 100%)",
              transition: "width 0.25s ease-out",
            }}
          />
        </div>
      </div>

      <h3 style={{ marginTop: "8px", marginBottom: "4px", fontSize: "1.1rem" }}>
        Etap 2 – Zdania do odsłuchu
      </h3>
      <p
        style={{
          marginTop: 0,
          marginBottom: "16px",
          fontSize: "0.9rem",
          opacity: 0.85,
        }}
      >
        Słuchaj zdania po hiszpańsku i przeczytaj tłumaczenie.
      </p>

      {/* Karta ze zdaniem */}
      <div
        style={{
          borderRadius: "14px",
          background:
            "radial-gradient(circle at top left, #1f2937 0, #020617 55%)",
          padding: "20px 22px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "1.4rem",
            margin: 0,
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          {sentence.es}
        </p>
        <p
          style={{
            margin: 0,
            opacity: 0.85,
            fontSize: "0.95rem",
            fontStyle: "italic",
          }}
        >
          ({sentence.pl})
        </p>
      </div>

      {/* Przyciski: audio + następne zdanie */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          marginTop: "8px",
        }}
      >
        <button
          onClick={() => speakEs(sentence.es)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "999px",
            border: "1px solid rgba(148, 163, 184, 0.6)",
            background: "#020617",
            color: "#e5e7eb",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "0.95rem",
          }}
        >
          <span role="img" aria-label="głośnik">
            🔊
          </span>
          Odtwórz zdanie
        </button>

        <button
          onClick={onDone}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #22c55e 100%)",
            color: "#052e16",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Następne zdanie
        </button>
      </div>
    </div>
  );
}