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

  const isLast = index === total - 1;

  function handleNext() {
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
      <h3 style={{ marginTop: 0 }}>Etap 2 – Zdania do odsłuchu</h3>

      <p style={{ marginBottom: "4px" }}>
        Zdanie {index + 1} z {total}
      </p>

      <div
        style={{
          padding: "16px",
          borderRadius: "10px",
          background: "#020617",
          marginBottom: "8px",
        }}
      >
        <p style={{ fontSize: "1.3rem", marginBottom: "4px" }}>
          <strong>{sentence.es}</strong>
        </p>
        <p style={{ opacity: 0.9 }}>({sentence.pl})</p>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <button
          onClick={() => speakEs(sentence.es)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#4b5563",
            color: "white",
            fontWeight: 600,
          }}
        >
          🔊 Odtwórz zdanie
        </button>
      </div>

      <button
        onClick={handleNext}
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#10b981",
          color: "white",
          fontWeight: 600,
        }}
      >
        {isLast ? "Przejdź do ćwiczeń" : "Następne zdanie"}
      </button>
    </div>
  );
}