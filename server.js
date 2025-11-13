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

// strona główna
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// 🔥 ROUTE: generowanie lekcji jako JSON
app.get('/lekcja', async (req, res) => {
  try {
    const prompt = `
Jesteś nauczycielem hiszpańskiego (poziom A1).
Przygotuj lekcję w formacie JSON **bez żadnego tekstu wokoło**.

Zwróć TYLKO JSON zgodny z tym schematem:

{
  "temat": "Powitania",
  "poziom": "A1",
  "slowka": [
    { "es": "hola", "pl": "cześć" }
  ],
  "zdania": [
    { "es": "Hola, ¿cómo estás?", "pl": "Cześć, jak się masz?" }
  ],
  "cwiczenie": {
    "typ": "tlumaczenie_pl_na_es",
    "pytania": [
      "Cześć, jak się masz?",
      "Dziękuję za pomoc."
    ],
    "odpowiedzi": [
      "Hola, ¿cómo estás?",
      "Gracias por tu ayuda."
    ]
  }
}

Ważne:
- Odpowiadasz TYLKO jednym obiektem JSON (bez komentarzy, bez markdown).
- Używaj podwójnych cudzysłowów jak w poprawnym JSON.
- Dla poziomu A1 dobierz bardzo proste słówka i zdania.
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: 'Jesteś pomocnym asystentem do nauki hiszpańskiego.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    // próbujemy sparsować JSON zwrócony przez model
    let lessonJson;
    try {
      lessonJson = JSON.parse(raw);
    } catch (e) {
      console.error('Nie udało się sparsować JSON z modelu:', e, raw);
      return res.status(500).json({
        status: 'error',
        message: 'Model zwrócił niepoprawny JSON.'
      });
    }

    // zwracamy ładną strukturę do frontu
    res.json({
      status: 'ok',
      lekcja: lessonJson
    });
  } catch (error) {
    console.error('Błąd przy generowaniu lekcji:', error);
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
