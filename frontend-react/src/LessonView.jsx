import { useState } from "react";
import Flashcards from "./Flashcards";

export default function LessonView({ lesson }) {
  const [phase, setPhase] = useState("flashcards"); // 'flashcards' | 'sentences' | ...
  const [wordIndex, setWordIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);

  const words = lesson.slowka || [];

  function handleAnswer(known) {
    // zliczamy znane słówka
    if (known) {
      setKnownCount((prev) => prev + 1);
    }

    setWordIndex((prev) => {
      const next = prev + 1;

      // jeśli skończyliśmy słówka → zmiana etapu
      if (next >= words.length) {
        setPhase("sentences"); // na razie tylko placeholder
        return prev; // zostajemy na ostatnim indeksie
      }

      return next;
    });
  }

  return (
    <div style={{ marginTop: "20px", maxWidth: "640px" }}>
      <h2 style={{ marginBottom: "4px" }}>{lesson.temat}</h2>
      <p style={{ marginTop: 0, marginBottom: "16px" }}>
        Poziom: {lesson.poziom}
      </p>

      {phase === "flashcards" && (
        <Flashcards
          words={words}
          index={wordIndex}
          knownCount={knownCount}
          onAnswer={handleAnswer}
        />
      )}

      {phase === "sentences" && (
        <div style={{ marginTop: "24px" }}>
          <h3>Koniec słówek 🎉</h3>
          <p>
            Znałeś {knownCount} z {words.length} słówek.
          </p>
          <p>
            W następnym kroku dodamy tu etap ze zdaniami (Etap 2) – na razie
            to tylko informacja końcowa.
          </p>
        </div>
      )}
    </div>
  );
}