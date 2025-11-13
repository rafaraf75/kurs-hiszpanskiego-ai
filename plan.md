# Plan projektu Hiszpanski AI

## Cel projektu

Aplikacja ma umożliwiać naukę języka hiszpańskiego na poziomie A1.
Użytkownik dostaje:

- nowe słówka i zdania generowane przez model LLM,
- proste ćwiczenia (np. dopasowanie tłumaczenia),
- powtórki według algorytmu SRS,
- codzienne przypomnienia (n8n).

Na początku robimy tylko wersję A1 i tylko język hiszpański.

## Zakres pierwszej wersji (MVP)

- poziom: A1 (później łatwo rozszerzymy o A2, B1 itd. bez zmiany architektury),
- język: hiszpański (docelowo wiele języków, ale mechanika zostaje ta sama),
- jedna prosta ścieżka nauki:
  - użytkownik dostaje pakiet nowych słówek/zdań wygenerowanych przez LLM,
  - rozwiązuje proste ćwiczenia (np. dopasowanie tłumaczenia),
  - wynik ćwiczeń zapisujemy i aktualizujemy harmonogram powtórek (SRS),
  - n8n wysyła przypomnienie, gdy są nowe rzeczy do nauki/powtórki.

## Jak wygląda dzień użytkownika

1. Użytkownik otwiera aplikację.
2. Aplikacja sprawdza, czy są:
   - nowe słówka/zdania wygenerowane przez LLM (jeśli limit dzienny nie został jeszcze wykorzystany),
   - powtórki zaplanowane przez algorytm SRS.
3. Użytkownik robi krótką sesję:
   - najpierw powtórki,
   - potem nowe słówka/zdania.
4. Po każdym ćwiczeniu zapisujemy wynik (poprawnie/niepoprawnie).
5. Po zakończeniu sesji aktualizujemy:
   - daty następnych powtórek (SRS),
   - licznik „zrobione dzisiaj”.
6. n8n wysyła powiadomienie, jeśli:
   - użytkownik nie zrobił sesji dzisiaj,
   - pojawiły się nowe powtórki,
   - minęła godzina, o której użytkownik zwykle się uczy (np. 19:00).

## Jakie dane przechowuje aplikacja

### 1. Dane o użytkowniku
- imię lub nick (opcjonalnie),
- język interfejsu (np. polski),
- poziom nauki (A1),
- ustawiona godzina powiadomień,
- ile nowych słówek dziennie (np. 5),
- kiedy użytkownik ostatnio zrobił sesję.

### 2. Dane o każdym słówku / zdaniu
- unikalny identyfikator,
- tekst po hiszpańsku (es),
- tekst po polsku (pl),
- przykład zdania,
- poziom (A1),
- tag lub temat (np. „powitania”, „jedzenie”).

### 3. Dane o postępie użytkownika (SRS)
Dla każdego słówka użytkownik ma osobny stan:
- ease (łatwość zapamiętania),
- interval (co ile dni powtórka),
- dueDate (kiedy ma się pojawić kolejna powtórka),
- licznik powtórek (reps),
- wynik ostatniego ćwiczenia (poprawnie/niepoprawnie).

### 4. Dane do generacji lekcji (LLM)
- historia tego, co użytkownik już dostał,
- lista słówek, które LLM nie powinien powtarzać,
- parametry do promptu (poziom A1, temat lekcji, liczba słówek).

### 5. Dane do przypomnień (n8n)
- ostatnia wykonana sesja,
- ile powtórek jest zaległych,
- czy wygenerowano już powiadomienie dzisiaj.

## Struktura lekcji generowanej przez LLM

Każda lekcja składa się z:

### 1. Informacji o lekcji
- temat lekcji (np. "Powitania", "Liczby", "Jedzenie"),
- poziom (A1),
- liczba elementów (np. 5–10).

### 2. Lista elementów do nauki
Każdy element zawiera:
- id (tworzone automatycznie),
- tekst po hiszpańsku (es),
- tłumaczenie po polsku (pl),
- jedno bardzo proste zdanie przykładowe po hiszpańsku,
- tag/temat (np. "powitania").

### 3. Ćwiczenia na podstawie elementów
Na koniec lekcji generujemy proste ćwiczenia, np.:
- dopasowanie tłumaczenia (es → pl),
- uzupełnianie brakującego słowa,
- wybór poprawnego zdania.

### 4. Wynik lekcji
Aplikacja zapisuje:
- które elementy użytkownik znał,
- które były trudne,
- harmonogram następnych powtórek (SRS).

## Format danych zwracanych przez LLM (JSON)

Model LLM zwraca jedną lekcję w formacie JSON:

{
  "topic": "Powitania",
  "level": "A1",
  "items": [
    {
      "id": "hola",
      "es": "hola",
      "pl": "cześć",
      "example": "Hola, ¿cómo estás?",
      "tag": "powitania"
    },
    {
      "id": "buenos-dias",
      "es": "buenos días",
      "pl": "dzień dobry",
      "example": "Buenos días, señor.",
      "tag": "powitania"
    }
  ],
  "exercises": [
    {
      "type": "match",
      "question": "Wybierz tłumaczenie: 'hola'",
      "options": ["cześć", "proszę", "dzień dobry"],
      "correct": "cześć"
    }
  ]
}

### Zasady:
- zawsze zwracamy poprawny JSON,
- bez komentarzy,
- bez dodatkowego tekstu poza JSON,
- wszystkie pola muszą istnieć,
- `items` zawiera 5–10 elementów,
- `exercises` zawiera 1–2 proste zadania.

## Prompt dla LLM – generowanie lekcji

Twoje zadanie:

Wygeneruj lekcję języka hiszpańskiego na poziomie A1 w formacie JSON.
Temat lekcji: {{topic}}
Liczba elementów: {{count}} (zwykle 5–10)

Wymagania:

1. Zwróć tylko poprawny JSON, bez komentarzy i bez dodatkowego tekstu.
2. Każdy element musi zawierać pola:
   - id (małe litery, myślniki zamiast spacji),
   - es (hiszpański),
   - pl (tłumaczenie na polski),
   - example (proste zdanie z użyciem elementu),
   - tag (taki sam jak temat).
3. Ćwiczenia mają być bardzo proste:
   - typ: "match",
   - 1 pytanie,
   - 3 odpowiedzi (1 poprawna, 2 błędne).
4. Poziom językowy: A1
5. Używaj prostych zdań, łatwego słownictwa i krótkich przykładów.

Przykład wywołania:

Temat: Powitania
Liczba elementów: 5

Oczekiwany format:

{
  "topic": "Powitania",
  "level": "A1",
  "items": [...],
  "exercises": [...]
}

Zwróć tylko JSON.
