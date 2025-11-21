export default function ExerciseStep({ exercise, onFinish }) {
  if (!exercise) {
    return null;
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
      <h3 style={{ marginTop: 0 }}>Etap 3 – Ćwiczenie (podgląd odpowiedzi)</h3>
      <p>Spróbuj przetłumaczyć w głowie, a potem sprawdź odpowiedzi.</p>

      <div style={{ marginTop: "8px", marginBottom: "12px" }}>
        {exercise.pytania.map((q, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <p style={{ marginBottom: 0 }}>
              {i + 1}. {q}
            </p>
          </div>
        ))}
      </div>

      <details
        style={{
          marginBottom: "12px",
          padding: "8px 10px",
          borderRadius: "8px",
          background: "#0b1120",
        }}
      >
        <summary style={{ cursor: "pointer" }}>Pokaż poprawne odpowiedzi</summary>
        <div style={{ marginTop: "8px" }}>
          {exercise.odpowiedzi.map((ans, i) => (
            <p key={i} style={{ marginBottom: "4px" }}>
              {i + 1}. {ans}
            </p>
          ))}
        </div>
      </details>

      <button
        onClick={handleFinish}
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
        Zakończ lekcję
      </button>
    </div>
  );
}