import Flashcards from "./Flashcards";
import SentencesStep from "./SentencesStep";
import ExerciseStep from "./ExerciseStep";

export default function LessonView({
  lesson,
  progress,
  onProgressChange,
  onNewLesson,
}) {
  // Jeśli nie ma progress – ustawiamy domyślne wartości
  const phase = progress?.phase || "flashcards";
  const wordIndex = progress?.wordIndex ?? 0;
  const knownCount = progress?.knownCount ?? 0;
  const sentenceIndex = progress?.sentenceIndex ?? 0;

  const words = lesson.slowka || [];
  const sentences = lesson.zdania || [];
  const exercise = lesson.cwiczenie || null;

  // 🔹 dynamiczna lista kroków (jeśli brak zdań/ćwiczeń, kroki się skrócą)
  const steps = [];
  steps.push({ key: "flashcards", label: "Słówka" });
  if (sentences.length > 0) {
    steps.push({ key: "sentences", label: "Zdania" });
  }
  if (exercise) {
    steps.push({ key: "exercise", label: "Ćwiczenie" });
  }
  steps.push({ key: "summary", label: "Podsumowanie" });

  const currentStepIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === phase)
  );
  const lastStepIndex = steps.length - 1;

  function updateProgress(newData) {
    if (!onProgressChange) return;
    onProgressChange({
      phase,
      wordIndex,
      knownCount,
      sentenceIndex,
      ...newData,
    });
  }

  // 🔹 obsługa flashcards
  function handleFlashcardAnswer(known) {
    let newKnownCount = known ? knownCount + 1 : knownCount;
    let newWordIndex = wordIndex + 1;
    let newPhase = phase;
    let newSentenceIndex = sentenceIndex;

    if (newWordIndex >= words.length) {
      // koniec słówek → zmiana etapu
      newWordIndex = wordIndex; // zostajemy na ostatnim indeksie
      if (sentences.length > 0) {
        newPhase = "sentences";
      } else if (exercise) {
        newPhase = "exercise";
      } else {
        newPhase = "summary";
      }
    }

    updateProgress({
      phase: newPhase,
      wordIndex: newWordIndex,
      knownCount: newKnownCount,
      sentenceIndex: newSentenceIndex,
    });
  }

  // 🔹 obsługa zakończenia jednego zdania
  function handleSentenceDone() {
    let newSentenceIndex = sentenceIndex + 1;
    let newPhase = phase;

    if (newSentenceIndex >= sentences.length) {
      newSentenceIndex = sentenceIndex;
      if (exercise) {
        newPhase = "exercise";
      } else {
        newPhase = "summary";
      }
    }

    updateProgress({
      phase: newPhase,
      wordIndex,
      knownCount,
      sentenceIndex: newSentenceIndex,
    });
  }

  // 🔹 zakończenie ćwiczenia
  function handleExerciseFinished() {
    updateProgress({
      phase: "summary",
      wordIndex,
      knownCount,
      sentenceIndex,
    });
  }

  return (
    <div
      style={{
        marginTop: "20px",
        maxWidth: "720px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {/* 🔹 Pasek postępu lekcji */}
      <div
        style={{
          marginBottom: "16px",
          padding: "10px 12px",
          borderRadius: "999px",
          background: "#0f172a",
          boxShadow: "0 12px 25px rgba(15,23,42,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Linia w tle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "16px",
              right: "16px",
              height: "2px",
              background: "#1f2937",
              transform: "translateY(-50%)",
              zIndex: 0,
            }}
          />
          {/* Kroki */}
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            let circleColor = "#4b5563";
            if (isDone) circleColor = "#22c55e";
            if (isCurrent) circleColor = "#3b82f6";

            return (
              <div
                key={step.key}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "999px",
                    background: circleColor,
                    border: "2px solid #020617",
                    boxShadow: isCurrent
                      ? "0 0 0 3px rgba(59,130,246,0.4)"
                      : "none",
                    marginBottom: 4,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: isDone || isCurrent ? "#e5e7eb" : "#9ca3af",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Mały opis na dole paska */}
        <div
          style={{
            marginTop: 6,
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#9ca3af",
          }}
        >
          Krok {currentStepIndex + 1} z {lastStepIndex + 1}
        </div>
      </div>

      {/* Tytuł lekcji */}
      <h2 style={{ marginBottom: "4px" }}>{lesson.temat}</h2>
      <p style={{ marginTop: 0, marginBottom: "16px" }}>
        Poziom: {lesson.poziom}
      </p>

      {phase === "flashcards" && (
        <Flashcards
          words={words}
          index={wordIndex}
          knownCount={knownCount}
          onAnswer={handleFlashcardAnswer}
        />
      )}

      {phase === "sentences" && sentences.length > 0 && (
        <SentencesStep
          sentence={sentences[sentenceIndex]}
          index={sentenceIndex}
          total={sentences.length}
          onDone={handleSentenceDone}
        />
      )}

      {phase === "exercise" && exercise && (
        <ExerciseStep exercise={exercise} onFinish={handleExerciseFinished} />
      )}

      {phase === "summary" && (
        <div style={{ marginTop: "24px" }}>
          <h3>Lekcja zakończona 🎉</h3>
          {words.length > 0 && (
            <p>
              Znałeś {knownCount} z {words.length} słówek.
            </p>
          )}
          {sentences.length > 0 && <p>Przerobiłeś wszystkie zdania.</p>}
          {exercise && <p>Ukończyłeś ćwiczenie.</p>}

          <div style={{ marginTop: "16px" }}>
            {onNewLesson && (
              <button
                onClick={onNewLesson}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: "#3b82f6",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Następna lekcja
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}