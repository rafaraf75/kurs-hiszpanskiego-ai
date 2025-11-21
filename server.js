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

// Strona główna (nieużywane po migracji na React, ale zostawiamy)
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// 🔥 ROUTE: generowanie lekcji jako JSON — TERAZ Z RÓŻNYMI TEMATAMI A1
app.get('/lekcja', async (req, res) => {
  try {

    // 🔹 Lista tematów poziomu A1 (możesz rozbudować)
    const TEMATY_A1 = [
      "Powitania i pożegnania",
      "Przedstawianie się i informacje o sobie",
      "Rodzina i bliscy",
      "W klasie / przedmioty szkolne",
      "Liczby i podawanie wieku",
      "Kolory i przymiotniki",
      "Jedzenie i napoje",
      "Zakupy i ubrania",
      "Miejsca w mieście",
      "Plan dnia i czynności codzienne",
      "Pogoda",
      "Hobby i zainteresowania"
    ];

    // 🔹 wybieramy losowy temat
    const tematLosowy = TEMATY_A1[Math.floor(Math.random() * TEMATY_A1.length)];

    // 🔥 dynamiczny prompt dla AI
    const prompt = `
Jesteś nauczycielem języka hiszpańskiego.
Przygotuj kompletną lekcję na poziomie A1.

Temat lekcji: "${tematLosowy}"

Zwróć TYLKO poprawny obiekt JSON (bez markdown, bez komentarzy, bez tekstu przed i po).

Struktura JSON musi być taka:

{
  "temat": "...",
  "poziom": "A1",
  "slowka": [
    { "es": "...", "pl": "..." }
  ],
  "zdania": [
    { "es": "...", "pl": "..." }
  ],
  "cwiczenie": {
    "pytania": ["..."],
    "odpowiedzi": ["..."]
  }
}

Wymagania:
- Używaj prostych słów i krótkich zdań odpowiednich dla poziomu A1.
- Słówka, zdania i ćwiczenie muszą pasować tematycznie do: "${tematLosowy}".
- Używaj podwójnych cudzysłowów jak w poprawnym JSON.
- Nie dodawaj żadnych wyjaśnień poza JSON.
`;

    // 🔥 zapytanie do OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: 'Jesteś pomocnym nauczycielem hiszpańskiego.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9   // większa różnorodność
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    // 🔥 próba parsowania JSON z modelu
    let lessonJson;
    try {
      lessonJson = JSON.parse(raw);
    } catch (err) {
      console.error("❌ JSON parse error:", err, "\nAI returned:", raw);
      return res.status(500).json({
        status: 'error',
        message: 'Model zwrócił niepoprawny JSON.'
      });
    }

    // 🔥 zwracamy poprawną lekcję do frontendu
    res.json({
      status: 'ok',
      lekcja: lessonJson
    });

  } catch (error) {
    console.error("❌ Błąd przy generowaniu lekcji:", error);
    res.status(500).json({
      status: 'error',
      message: 'Błąd serwera przy generowaniu lekcji.'
    });
  }
});

// 🔥 Start serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
