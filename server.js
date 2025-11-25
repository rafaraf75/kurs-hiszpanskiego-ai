import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Strona główna (raczej nieużywane po migracji na React, ale nie szkodzi)
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// 🔹 helper: delikatna „naprawa” stringa z JSON-em
function repairJsonString(str) {
  let s = str;

  if (typeof s !== 'string') {
    s = String(s);
  }

  // zamiana dziwnych cudzysłowów na zwykłe
  s = s.replace(/[“”„]/g, '"');

  // usuwamy znaczniki markdown, jeśli się pojawią
  s = s.replace(/```json/gi, '').replace(/```/g, '');

  // usuwamy znaki nowych linii (nie musimy, ale porządkujemy)
  s = s.replace(/(\r\n|\n|\r)/g, ' ');

  // usuwamy zbędne przecinki przed } albo ]
  // np.  {"a":1,}  -> {"a":1}
  //      [1,2,]   -> [1,2]
  s = s.replace(/,\s*([}\]])/g, '$1');

  // dodajemy przecinek między obiektami jeśli AI zrobiło:  {...}{...}
  // zamiast {...},{...}
  s = s.replace(/}\s*{/g, '},{');

  return s;
}

// 🔹 helper: próba „miękkiego” parsowania jako JS, gdy JSON.parse zawodzi
function parseLenientJs(jsonLike) {
  const code = jsonLike.trim();
  // Uwaga: to uruchamia kod JS zwrócony przez model – OK na lokalne dev/testy
  // Przy produkcji trzeba by przejść na model z gwarantowanym JSON.
  // eslint-disable-next-line no-new-func
  const fn = new Function('"use strict"; return (' + code + ');');
  return fn();
}

// 🔹 helper: wyciąga i parsuje JSON z odpowiedzi modelu
function extractJsonFromModel(raw) {
  if (!raw) {
    throw new Error('Brak contentu z modelu');
  }

  let text = typeof raw === 'string' ? raw : String(raw);

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Nie znaleziono poprawnego fragmentu JSON w odpowiedzi modelu');
  }

  let jsonString = text.slice(start, end + 1);
  jsonString = repairJsonString(jsonString);

  // najpierw klasyczny JSON.parse
  try {
    return JSON.parse(jsonString);
  } catch (e1) {
    console.warn('JSON.parse nie powiódł się, próba parsowania lenient:', e1.message);
  }

  // fallback: parser „lenient” jako JS
  try {
    return parseLenientJs(jsonString);
  } catch (e2) {
    console.error('Lenient parser też poległ:', e2.message);
    throw e2;
  }
}

// ROUTE: generowanie lekcji jako JSON — z różnymi tematami A1
app.get('/lekcja', async (req, res) => {
  try {
    const TEMATY_A1 = [
      'Powitania i pożegnania',
      'Przedstawianie się i informacje o sobie',
      'Rodzina i bliscy',
      'W klasie / przedmioty szkolne',
      'Liczby i podawanie wieku',
      'Kolory i przymiotniki',
      'Jedzenie i napoje',
      'Zakupy i ubrania',
      'Miejsca w mieście',
      'Plan dnia i czynności codzienne',
      'Pogoda',
      'Hobby i zainteresowania',
    ];

    const tematLosowy = TEMATY_A1[Math.floor(Math.random() * TEMATY_A1.length)];

    const prompt = `
Jesteś nauczycielem języka hiszpańskiego.
Przygotuj kompletną lekcję na poziomie A1.

Temat lekcji: "${tematLosowy}"

Zwróć TYLKO poprawny obiekt JSON (bez markdown, bez komentarzy, bez tekstu przed i po).

Struktura JSON musi być taka:

{
  "temat": "krótki tytuł po polsku",
  "poziom": "A1",
  "slowka": [
    { "es": "hola", "pl": "cześć" },
    { "es": "gracias", "pl": "dziękuję" }
  ],
  "zdania": [
    { "es": "Hola, ¿cómo estás?", "pl": "Cześć, jak się masz?" }
  ],
  "cwiczenie": {
    "pytania": ["..."],
    "odpowiedzi": ["..."]
  }
}

BARDZO WAŻNE ZASADY DOTYCZĄCE SŁÓWEK:

- Pole "es" ZAWSZE zawiera słowo po HISZPAŃSKU.
- Pole "pl" ZAWSZE zawiera tłumaczenie po POLSKU.
- W normalnych przypadkach tekst w "es" i "pl" jest INNY.
- TYLKO w oczywistych przypadkach zapożyczeń wolno użyć tego samego słowa
  w obu polach, np.: "hotel", "internet", "taxi", "park".

Przykład poprawnej pary:
{ "es": "farmacia", "pl": "apteka" }  ✅

Przykład NIEPOPRAWNEJ pary (tak NIE rób):
{ "es": "apteka", "pl": "apteka" }  ❌

Wymagania:
- Używaj prostych słów i krótkich zdań odpowiednich dla poziomu A1.
- Słówka, zdania i ćwiczenie muszą pasować tematycznie do: "${tematLosowy}".
- Używaj podwójnych cudzysłowów jak w poprawnym JSON.
- Nie dodawaj żadnych wyjaśnień poza JSON.
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: 'Jesteś pomocnym nauczycielem hiszpańskiego.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;

    let lessonJson;
    try {
      lessonJson = extractJsonFromModel(raw);
    } catch (err) {
      console.error('Nie udało się sparsować JSON z modelu (po wszystkich próbach):', err);
      console.error('AI returned:', raw);
      return res.status(500).json({
        status: 'error',
        message: 'Model zwrócił niepoprawny JSON.',
      });
    }

    res.json({
      status: 'ok',
      lekcja: lessonJson,
    });
  } catch (error) {
    console.error('Błąd przy generowaniu lekcji:', error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd serwera przy generowaniu lekcji.',
    });
  }
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});