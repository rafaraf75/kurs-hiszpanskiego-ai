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

let lekcja = null;
let indexSlowka = 0;
let licznikZnalem = 0;

function speakEs(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS nie działa w tej przeglądarce', e);
  }
}

function pokazSlowko() {
  if (!lekcja || !lekcja.slowka || lekcja.slowka.length === 0) return;

  const s = lekcja.slowka[indexSlowka];
  slowkoEsEl.textContent = s.es;
  slowkoPlEl.textContent = s.pl;

  postepEl.textContent = `Słówko ${indexSlowka + 1} z ${lekcja.slowka.length} • Znałem: ${licznikZnalem}`;
}

function nastepneSlowko(znalem) {
  if (znalem) licznikZnalem++;

  indexSlowka++;

  if (indexSlowka >= lekcja.slowka.length) {
    postepEl.textContent = `Koniec słówek! Znałeś ${licznikZnalem} z ${lekcja.slowka.length}.`;
    return;
  }

  pokazSlowko();
}

function pokazZdania() {
  zdaniaEl.innerHTML = '';
  if (!lekcja.zdania) return;

  lekcja.zdania.forEach((z) => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${z.es}</strong> — ${z.pl}`;
    zdaniaEl.appendChild(p);
  });
}

function pokazCwiczenie() {
  cwiczenieEl.innerHTML = '';
  if (!lekcja.cwiczenie) return;

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
  });

  cwiczenieEl.appendChild(btnOdp);
  cwiczenieEl.appendChild(odpDiv);
}

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

    tematEl.textContent = lekcja.temat || 'Lekcja hiszpańskiego';
    poziomEl.textContent = `Poziom: ${lekcja.poziom || 'A1'}`;

    pokazSlowko();
    pokazZdania();
    pokazCwiczenie();

    container.classList.remove('hidden');
    statusEl.textContent = 'Lekcja załadowana ✅';
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