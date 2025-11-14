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
let etapLekcji = 'slowka'; // 'slowka' | 'zdania' | 'cwiczenie'

// 🔹 nowy indeks zdania dla etapu 2
let indexZdania = 0;

// 🔹 LocalStorage – klucz i helpery
const STORAGE_KEY = 'kurs_hiszpanski_a1_progress_v1';

function zapiszPostep() {
  if (!lekcja) return;

  const dane = {
    lekcja,
    indexSlowka,
    licznikZnalem,
    etapLekcji,
    indexZdania,
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

// 🔹 pomocnicza funkcja – ustaw widoczność sekcji na start
function resetEtapow() {
  if (sekcjaSlowka) sekcjaSlowka.classList.remove('hidden'); // słówka widać od razu
  if (sekcjaZdania) sekcjaZdania.classList.add('hidden');
  if (sekcjaCwiczenie) sekcjaCwiczenie.classList.add('hidden');
  if (sekcjaQuiz) sekcjaQuiz.classList.add('hidden');
}

function pokazSlowko() {
  if (!lekcja || !lekcja.slowka || lekcja.slowka.length === 0) return;

  // jeśli jesteśmy już "po słówkach", nie pokazujemy konkretnego słowa,
  // tylko komunikat o końcu
  if (indexSlowka >= lekcja.slowka.length) {
    slowkoEsEl.textContent = '';
    slowkoPlEl.textContent = '';
    postepEl.textContent = `Koniec słówek! Znałeś ${licznikZnalem} z ${lekcja.slowka.length}.`;
    return;
  }

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

  // jeśli po zwiększeniu indeksu przekroczyliśmy liczbę słówek → koniec etapu słówek
  if (indexSlowka >= lekcja.slowka.length) {
    etapLekcji = 'zdania';

    // komunikat o końcu słówek
    pokazSlowko();

    // odsłaniamy zdania, ćwiczenia zostawmy na później
    if (sekcjaZdania) sekcjaZdania.classList.remove('hidden');

    // zaczynamy od pierwszego zdania
    indexZdania = 0;
    pokazZdania();

    // zapisujemy postęp z nowym etapem
    zapiszPostep();
    return;
  }

  // wciąż jesteśmy w etapie słówek → zapis i pokazanie kolejnego
  zapiszPostep();
  pokazSlowko();
}

// 🔹 proste czyszczenie inputu i feedbacku w sekcji zdań
function wyczyscSekcjeZdan() {
  zdaniaEl.innerHTML = '';
}

// 🔹 Etap 2 – jedno zdanie naraz + input
function pokazZdania() {
  wyczyscSekcjeZdan();

  if (!lekcja || !lekcja.zdania || lekcja.zdania.length === 0) {
    zdaniaEl.textContent = 'Brak zdań w tej lekcji.';
    return;
  }

  const zdania = lekcja.zdania;

  // jeśli wszystkie zdania przerobione
  if (indexZdania >= zdania.length) {
    const podsumowanie = document.createElement('p');
    podsumowanie.textContent =
      'Ukończyłeś etap zdań. Przejdź niżej do ćwiczenia.';
    zdaniaEl.appendChild(podsumowanie);

    // przełączamy etap na ćwiczenie i pokazujemy sekcję
    etapLekcji = 'cwiczenie';
    if (sekcjaCwiczenie) sekcjaCwiczenie.classList.remove('hidden');
    zapiszPostep();
    return;
  }

  const aktualne = zdania[indexZdania];

  const naglowek = document.createElement('p');
  naglowek.innerHTML = `<strong>Zdanie ${indexZdania + 1} z ${
    zdania.length
  }</strong>`;
  zdaniaEl.appendChild(naglowek);

  const polski = document.createElement('p');
  polski.textContent = `Po polsku: ${aktualne.pl}`;
  zdaniaEl.appendChild(polski);

  const label = document.createElement('label');
  label.setAttribute('for', 'odp-zdanie');
  label.textContent = 'Twoja odpowiedź po hiszpańsku:';
  zdaniaEl.appendChild(label);

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'odp-zdanie';
  input.autocomplete = 'off';
  input.style.display = 'block';
  input.style.marginTop = '4px';
  input.style.width = '100%';
  zdaniaEl.appendChild(input);

  const przyciskiDiv = document.createElement('div');
  przyciskiDiv.style.marginTop = '8px';

  const btnSprawdz = document.createElement('button');
  btnSprawdz.textContent = 'Sprawdź';

  const btnNastepne = document.createElement('button');
  btnNastepne.textContent =
    indexZdania === zdania.length - 1 ? 'Zakończ zdania' : 'Następne zdanie';
  btnNastepne.style.marginLeft = '8px';
  btnNastepne.disabled = true; // najpierw trzeba kliknąć "Sprawdź"

  przyciskiDiv.appendChild(btnSprawdz);
  przyciskiDiv.appendChild(btnNastepne);

  zdaniaEl.appendChild(przyciskiDiv);

  const feedback = document.createElement('div');
  feedback.style.marginTop = '8px';
  zdaniaEl.appendChild(feedback);

  // Funkcja pomocnicza do prostego porównania tekstu
  function normalize(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  btnSprawdz.addEventListener('click', () => {
    const odp = input.value.trim();
    if (!odp) {
      feedback.textContent = 'Wpisz odpowiedź, zanim sprawdzisz.';
      return;
    }

    const poprawna = aktualne.es;
    const ok = normalize(odp) === normalize(poprawna);

    if (ok) {
      feedback.textContent = 'Świetnie! Odpowiedź jest poprawna ✅';
    } else {
      feedback.textContent = `Dobra próba! Poprawna odpowiedź: "${poprawna}".`;
    }

    // po sprawdzeniu można przejść dalej
    btnNastepne.disabled = false;

    // zapisujemy, że to zdanie zostało przerobione (ale index zmienimy dopiero po kliknięciu "Następne")
    zapiszPostep();
  });

  btnNastepne.addEventListener('click', () => {
    indexZdania++;

    // zapisujemy nowy indeks zdania
    zapiszPostep();

    // odświeżamy widok zdań (kolejne zdanie albo podsumowanie)
    pokazZdania();
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
  etapLekcji = 'slowka';
  indexZdania = 0;

  slowkoEsEl.textContent = '';
  slowkoPlEl.textContent = '';
  postepEl.textContent = '';
  zdaniaEl.innerHTML = '';
  cwiczenieEl.innerHTML = '';

  resetEtapow();
  container.classList.add('hidden');

  statusEl.textContent =
    'Postęp wyczyszczony. Kliknij "Pobierz nową lekcję", żeby zacząć od początku.';
}

// 🔹 przywracanie lekcji po odświeżeniu / powrocie na stronę
document.addEventListener('DOMContentLoaded', () => {
  const zapisane = wczytajPostep();
  if (zapisane) {
    lekcja = zapisane.lekcja;
    indexSlowka = zapisane.indexSlowka || 0;
    licznikZnalem = zapisane.licznikZnalem || 0;
    etapLekcji = zapisane.etapLekcji || 'slowka';
    indexZdania = zapisane.indexZdania || 0;

    // ustawiamy UI tak jak po pobraniu lekcji
    resetEtapow();

    // jeśli byliśmy już dalej, odsłaniamy odpowiednie sekcje
    if (etapLekcji === 'zdania') {
      if (sekcjaZdania) sekcjaZdania.classList.remove('hidden');
    }
    if (etapLekcji === 'cwiczenie') {
      if (sekcjaZdania) sekcjaZdania.classList.remove('hidden');
      if (sekcjaCwiczenie) sekcjaCwiczenie.classList.remove('hidden');
    }

    tematEl.textContent = lekcja.temat || 'Lekcja hiszpańskiego';
    poziomEl.textContent = `Poziom: ${lekcja.poziom || 'A1'}`;

    pokazSlowko();
    pokazZdania();
    pokazCwiczenie();

    container.classList.remove('hidden');
    statusEl.textContent = 'Przywrócono ostatnią lekcję z pamięci ✅';
  } else {
    statusEl.textContent = 'Kliknij "Pobierz nową lekcję", aby zacząć.';
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
    etapLekcji = 'slowka';
    indexZdania = 0;

    // 🔹 start od etapu: tylko słówka
    resetEtapow();

    tematEl.textContent = lekcja.temat || 'Lekcja hiszpańskiego';
    poziomEl.textContent = `Poziom: ${lekcja.poziom || 'A1'}`;

    pokazSlowko();
    pokazZdania();    // na razie przygotowujemy strukturę, ale sekcja będzie ukryta
    pokazCwiczenie(); // to też

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