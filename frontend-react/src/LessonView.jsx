import Flashcards from "./Flashcards";
import SentencesStep from "./SentencesStep";
import ExerciseStep from "./ExerciseStep";

export default function LessonView({ lesson, progress, onProgressChange, onNewLesson }) {
  // Jeśli nie ma progress – ustawiamy domyślne wartości
  const phase = progress?.phase || "flashcards";
  const wordIndex = progress?.wordIndex ?? 0;
  const knownCount = progress?.knownCount ?? 0;
  const sentenceIndex = progress?.sentenceIndex ?? 0;

  const words = lesson.slowka || [];
  const sentences = lesson.zdania || [];
  const exercise = lesson.cwiczenie || null;

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