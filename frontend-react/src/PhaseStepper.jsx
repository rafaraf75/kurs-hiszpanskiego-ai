// frontend-react/src/PhaseStepper.jsx

/**
 * Pasek etapów (Start / Słówka / Zdania / Ćwiczenie / Podsumowanie)
 * - phase: "flashcards" | "sentences" | "exercise" | "summary" | "intro?"
 * - hasSentences: czy lekcja ma zdania
 * - hasExercise: czy lekcja ma ćwiczenie
 */
export default function PhaseStepper({ phase, hasSentences, hasExercise }) {
  // mapujemy fazę na indeks kroku
  let activeIndex = 0; // 0 = Start

  if (phase === "flashcards") activeIndex = 1;
  if (phase === "sentences") activeIndex = 2;
  if (phase === "exercise") activeIndex = 3;
  if (phase === "summary") activeIndex = 4;

  const steps = [
    { key: "start", label: "Start" },
    { key: "flashcards", label: "Słówka" },
    { key: "sentences", label: "Zdania", disabled: !hasSentences },
    { key: "exercise", label: "Ćwiczenie", disabled: !hasExercise },
    { key: "summary", label: "Podsumowanie" },
  ];

  const totalVisibleSteps = steps.length;

  return (
    <div
      style={{
        marginTop: "16px",
        marginBottom: "24px",
        background: "#020617",
        borderRadius: "999px",
        padding: "16px 32px",
        boxShadow: "0 20px 40px rgba(15,23,42,0.7)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        maxWidth: 900,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          const isDisabled = step.disabled;

          let dotColor = "#6b7280"; // szary
          if (isDone) dotColor = "#22c55e"; // zielony
          if (isActive) dotColor = "#3b82f6"; // niebieski

          let labelColor = isDisabled ? "#6b7280" : "#e5e7eb";

          return (
            <div
              key={step.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                fontSize: "0.8rem",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "999px",
                  border: "2px solid " + dotColor,
                  background: isDone
                    ? "rgba(34,197,94,0.1)"
                    : isActive
                    ? "rgba(59,130,246,0.2)"
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "999px",
                    background: dotColor,
                  }}
                />
              </div>
              <span style={{ color: labelColor }}>{step.label}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#9ca3af",
        }}
      >
        Krok {activeIndex + 1} z {totalVisibleSteps}
      </div>
    </div>
  );
}