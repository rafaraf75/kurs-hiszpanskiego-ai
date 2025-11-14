const btnLekcja = document.getElementById('btn-lekcja');
const statusEl = document.getElementById('status');

const container = document.getElementById('lekcja-container');
const tematEl = document.getElementById('temat-lekcji');
const poziomEl = document.getElementById('info-poziom');

const slowkoEsEl = document.getElementById('slowko-es');
const slowkoPlEl = document.getElementById('slowko-pl');
const btnAudio = document.getElementById('btn-audio');

const btnZnalem = document.getElementById('btn-znalem');
const btnNieZnalem = document.getElementById('btn-nie-znalem');
const postepEl = document.getElementById('postep');

const zdaniaEl = document.getElementById('zdania');
const cwiczenieEl = document.getElementById('cwiczenie');

// 🔹 sekcje, które chcemy chować/pokazywać
const sekcjaSlowka = document.getElementById('sekcja-slowka');
const sekcjaZdania = document.getElementById('sekcja-zdania');
const sekcjaCwiczenie = document.getElementById('sekcja-cwiczenie');
const sekcjaQuiz = document.getElementById('sekcja-quiz'); // może być null – spoko

let lekcja = null;
let indexSlowka = 0;
let licznikZnalem = 0;

// 🔹 LocalStorage – klucz i helpery
const STORAGE_KEY = 'kurs_hiszpanski_a1_progress_v1';

function zapiszPostep() {
  if (!lekcja) return;

  const dane = {
    lekcja,
    indexSlowka,
    licznikZnalem,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dane));
  } catch (e) {
    console.warn('Nie udało się zapisać postępu w localStorage', e);
  }
}

function wczytajPostep() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.warn('Nie udało się wczytać postępu z localStorage', e);
    return null;
  }
}

function wyczyscPostep() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Nie udało się usunąć postępu z localStorage', e);
  }
}

function speakEs(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS nie działa w tej przeglądarce', e);
  }
}

// 🔹 pomocnicza funkcja – ustaw widoczność sekcji
function resetEtapow() {
  if (sekcjaSlowka) sekcjaSlowka.classList.remove('hidden'); // słówka widać od razu
  if (sekcjaZdania) sekcjaZdania.classList.add('hidden');
  if (sekcjaCwiczenie) sekcjaCwiczenie.classList.add('hidden');
  if (sekcjaQuiz) sekcjaQuiz.classList.add('hidden');
}

function pokazSlowko() {
  if (!lekcja || !lekcja.slowka || lekcja.slowka.length === 0) return;

  const s = lekcja.slowka[indexSlowka];
  slowkoEsEl.textContent = s.es;
  slowkoPlEl.textContent = s.pl;

  postepEl.textContent = `Słówko ${indexSlowka + 1} z ${lekcja.slowka.length} • Znałem: ${licznikZnalem}`;
}

function nastepneSlowko(znalem) {
  if (!lekcja || !lekcja.slowka) return;

  // jeśli już skończyliśmy słówka – nic nie rób
  if (indexSlowka >= lekcja.slowka.length) {
    return;
  }

  if (znalem) licznikZnalem++;

  indexSlowka++;

  // 🔹 zapisujemy postęp po zmianie indeksu / licznika
  zapiszPostep();

  if (indexSlowka >= lekcja.slowka.length) {
    postepEl.textContent = `Koniec słówek! Znałeś ${licznikZnalem} z ${lekcja.slowka.length}.`;

    // 🔹 tu przechodzimy do “etapu 2” – odsłaniamy zdania i ćwiczenia
    if (sekcjaZdania) sekcjaZdania.classList.remove('hidden');
    if (sekcjaCwiczenie) sekcjaCwiczenie.classList.remove('hidden');

    return;
  }

  pokazSlowko();
}

function pokazZdania() {
  zdaniaEl.innerHTML = '';
  if (!lekcja || !lekcja.zdania) return;

  lekcja.zdania.forEach((z) => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${z.es}</strong> — ${z.pl}`;
    zdaniaEl.appendChild(p);
  });
}

function pokazCwiczenie() {
  cwiczenieEl.innerHTML = '';
  if (!lekcja || !lekcja.cwiczenie) return;

  const c = lekcja.cwiczenie;

  const opis = document.createElement('p');
  opis.textContent = 'Przetłumacz na hiszpański:';
  cwiczenieEl.appendChild(opis);

  c.pytania.forEach((q, i) => {
    const p = document.createElement('p');
    p.textContent = `${i + 1}. ${q}`;
    cwiczenieEl.appendChild(p);
  });

  const btnOdp = document.createElement('button');
  btnOdp.textContent = 'Pokaż odpowiedzi';
  btnOdp.style.marginTop = '8px';

  const odpDiv = document.createElement('div');
  odpDiv.style.marginTop = '8px';

  btnOdp.addEventListener('click', () => {
    odpDiv.innerHTML = '';
    c.odpowiedzi.forEach((o, i) => {
      const p = document.createElement('p');
      p.textContent = `${i + 1}. ${o}`;
      odpDiv.appendChild(p);
    });

    // 🔹 tu możemy w przyszłości włączyć quiz
    if (sekcjaQuiz) sekcjaQuiz.classList.remove('hidden');
  });

  cwiczenieEl.appendChild(btnOdp);
  cwiczenieEl.appendChild(odpDiv);
}

// 🔹 reset lekcji i postępu
function resetLekcja() {
  wyczyscPostep();

  lekcja = null;
  indexSlowka = 0;
  licznikZnalem = 0;

  slowkoEsEl.textContent = '';
  slowkoPlEl.textContent = '';
  postepEl.textContent = '';
  zdaniaEl.innerHTML = '';
  cwiczenieEl.innerHTML = '';

  resetEtapow();
  container.classList.add('hidden');

  statusEl.textContent = 'Postęp wyczyszczony. Kliknij "Nowa lekcja", żeby zacząć od początku.';
}

// 🔹 przywracanie lekcji po odświeżeniu / powrocie na stronę
document.addEventListener('DOMContentLoaded', () => {
  const zapisane = wczytajPostep();
  if (zapisane) {
    lekcja = zapisane.lekcja;
    indexSlowka = zapisane.indexSlowka || 0;
    licznikZnalem = zapisane.licznikZnalem || 0;

    // ustawiamy UI tak jak po pobraniu lekcji
    resetEtapow();

    tematEl.textContent = lekcja.temat || 'Lekcja hiszpańskiego';
    poziomEl.textContent = `Poziom: ${lekcja.poziom || 'A1'}`;

    pokazSlowko();
    pokazZdania();
    pokazCwiczenie();

    container.classList.remove('hidden');
    statusEl.textContent = 'Przywrócono ostatnią lekcję z pamięci ✅';
  } else {
    statusEl.textContent = 'Kliknij "Nowa lekcja", aby zacząć.';
  }

  const btnReset = document.getElementById('reset-lesson-btn');
  if (btnReset) {
    btnReset.addEventListener('click', resetLekcja);
  }
});

btnLekcja.addEventListener('click', async () => {
  statusEl.textContent = 'Ładuję lekcję...';
  container.classList.add('hidden');

  try {
    const res = await fetch('/lekcja');
    const data = await res.json();

    if (data.status !== 'ok') {
      statusEl.textContent = 'Błąd przy pobieraniu lekcji.';
      console.log('Odpowiedź z serwera:', data);
      return;
    }

    lekcja = data.lekcja;
    console.log('Lekcja z serwera:', lekcja);

    indexSlowka = 0;
    licznikZnalem = 0;

    // 🔹 start od etapu: tylko słówka
    resetEtapow();

    tematEl.textContent = lekcja.temat || 'Lekcja hiszpańskiego';
    poziomEl.textContent = `Poziom: ${lekcja.poziom || 'A1'}`;

    pokazSlowko();
    pokazZdania();
    pokazCwiczenie();

    container.classList.remove('hidden');
    statusEl.textContent = 'Lekcja załadowana ✅';

    // 🔹 zapisujemy świeżo pobraną lekcję
    zapiszPostep();
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Błąd połączenia z serwerem ❌';
  }
});

btnAudio.addEventListener('click', () => {
  const text = slowkoEsEl.textContent;
  if (text) speakEs(text);
});

btnZnalem.addEventListener('click', () => nastepneSlowko(true));
btnNieZnalem.addEventListener('click', () => nastepneSlowko(false));