import Flashcards from "./Flashcards";
import SentencesStep from "./SentencesStep";
import ExerciseStep from "./ExerciseStep";

export default function LessonView({
  lesson,
  progress,
  onProgressChange,
  onNewLesson,
  onUnknownWord,
}) {
  // Jeśli nie ma progress – ustawiamy domyślne wartości
  const phase = progress?.phase || "intro"; // startujemy od ekranu startowego
  const wordIndex = progress?.wordIndex ?? 0;
  const knownCount = progress?.knownCount ?? 0;
  const sentenceIndex = progress?.sentenceIndex ?? 0;

  const words = lesson.slowka || [];
  const sentences = lesson.zdania || [];
  const exercise = lesson.cwiczenie || null;

  const totalSteps = 5;
  const currentStepIndex =
    phase === "intro"
      ? 0
      : phase === "flashcards"
      ? 1
      : phase === "sentences"
      ? 2
      : phase === "exercise"
      ? 3
      : 4;

  const stepLabels = ["Start", "Słówka", "Zdania", "Ćwiczenie", "Podsumowanie"];

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

  // 🔹 przejście ze „Start” do fiszek
  function handleStartLesson() {
    updateProgress({
      phase: "flashcards",
      wordIndex: 0,
      knownCount: 0,
      sentenceIndex: 0,
    });
  }

  // 🔹 obsługa flashcards
  function handleFlashcardAnswer(known) {
    const currentWord = words[wordIndex];

    // jeśli NIE znałeś – zgłaszamy do powtórek
    if (!known && currentWord && onUnknownWord) {
      onUnknownWord({
        es: currentWord.es,
        pl: currentWord.pl,
        temat: lesson.temat,
      });
    }

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

  // 🔹 mały helper – opis liczbowy kroku
  const stepNumberLabel = `Krok ${currentStepIndex + 1} z ${totalSteps}`;

  return (
    <div
      style={{
        marginTop: "20px",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {/* Pasek etapów na górze */}
      <div
        style={{
          background: "#020617",
          padding: "16px 24px",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          marginBottom: "24px",
        }}
      >
        {stepLabels.map((label, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <div
              key={label}
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
                  width: 26,
                  height: 26,
                  borderRadius: "999px",
                  border: "2px solid #4b5563",
                  background: isActive
                    ? "#3b82f6"
                    : isDone
                    ? "#22c55e"
                    : "#020617",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginBottom: 4,
                }}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                style={{
                  color: isActive ? "#e5e7eb" : "#9ca3af",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}

        <div
          style={{
            width: 120,
            textAlign: "right",
            fontSize: "0.8rem",
            color: "#9ca3af",
          }}
        >
          {stepNumberLabel}
        </div>
      </div>

      {/* Nagłówek lekcji */}
      <h2 style={{ marginBottom: "4px" }}>{lesson.temat}</h2>
      <p style={{ marginTop: 0, marginBottom: "16px" }}>Poziom: {lesson.poziom}</p>

      {/* Ekran „Start” */}
      {phase === "intro" && (
        <div
          style={{
            background: "#020617",
            padding: "20px 24px 24px",
            borderRadius: "18px",
            boxShadow: "0 18px 40px rgba(0,0,0,0.65)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>
            Ta lekcja zawiera:
          </h3>
          <ul style={{ marginTop: 0, marginBottom: 12, paddingLeft: "20px" }}>
            {words.length > 0 && <li>{words.length} słówek</li>}
            {sentences.length > 0 && <li>{sentences.length} zdań</li>}
            {exercise && exercise.pytania && (
              <li>{exercise.pytania.length} zdań w ćwiczeniu tłumaczeniowym</li>
            )}
          </ul>
          <p style={{ marginBottom: 16, color: "#e5e7eb" }}>
            Zacznij od fiszek ze słówkami, potem przejdziesz do zdań i krótkiego
            ćwiczenia.
          </p>
          <button
            onClick={handleStartLesson}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Rozpocznij lekcję
          </button>
        </div>
      )}

      {/* Etap 2 – słówka */}
      {phase === "flashcards" && (
        <Flashcards
          words={words}
          index={wordIndex}
          knownCount={knownCount}
          onAnswer={handleFlashcardAnswer}
        />
      )}

      {/* Etap 3 – zdania */}
      {phase === "sentences" && sentences.length > 0 && (
        <SentencesStep
          sentence={sentences[sentenceIndex]}
          index={sentenceIndex}
          total={sentences.length}
          onDone={handleSentenceDone}
        />
      )}

      {/* Etap 4 – ćwiczenie */}
      {phase === "exercise" && exercise && (
        <ExerciseStep exercise={exercise} onFinish={handleExerciseFinished} />
      )}

      {/* Etap 5 – podsumowanie */}
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