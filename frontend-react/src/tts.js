// frontend-react/src/tts.js

export function speakEs(text) {
  if (!text) return;

  if (typeof window === "undefined") {
    console.warn("[TTS] Brak window – TTS tylko w przeglądarce.");
    return;
  }

  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn("[TTS] speechSynthesis niedostępne w tej przeglądarce.");
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 1;
    utterance.pitch = 1;

    // Spróbuj wybrać hiszpański głos, jeśli jest dostępny
    const voices = synth.getVoices ? synth.getVoices() : [];
    const esVoice = voices.find(
      (v) => v.lang && v.lang.toLowerCase().startsWith("es")
    );
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onstart = () => {
      console.log("[TTS] Start odtwarzania:", text);
    };
    utterance.onend = () => {
      console.log("[TTS] Koniec odtwarzania.");
    };
    utterance.onerror = (e) => {
      console.warn("[TTS] Błąd TTS:", e);
    };

    synth.speak(utterance);
  } catch (e) {
    console.warn("[TTS] Wyjątek w TTS:", e);
  }
}