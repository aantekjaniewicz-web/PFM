# ⚽ Polish Football Manager (PFM) — Mini Football Career OMEGA v3.5

## Przebudowa aplikacji

Aktualny plan i status: [docs/PLAN.md](docs/PLAN.md). Zasady pracy: [AGENTS.md](AGENTS.md).
Scenariusze kontroli gry: [docs/TESTING.md](docs/TESTING.md).

Testy regresji: `node --test` (Node.js 24, bez instalowania paczek).
Workflow GitHub Actions uruchamia je przy push i pull request.
Wersja wyjściowa jest zachowana w Git: `4e59c2b6976ee11845f024fb924267d3224c55b3`.

Rozpoczęto stabilizację końca sezonu i zapisu przynależności klubów do lig.
Poniższa dawna struktura docelowa i `REFACTOR.md` są materiałem pomocniczym;
obowiązujący kierunek architektury opisuje aktualny plan.

Menedżer piłkarski polskich lig — od Klasy B po Ekstraklasę i puchary UEFA.

## 🎮 Jak uruchomić

Otwórz `game.html` w przeglądarce (Chrome/Firefox/Edge). Logika gry działa lokalnie;
fonty Google wymagają internetu, a bez niego przeglądarka użyje fontów zastępczych.

## 📁 Struktura projektu (aktualna)

```
PFM/
├── game.html        ← cała gra w jednym pliku (9.4MB) - DZIAŁA
├── README.md        ← ten plik
└── REFACTOR.md      ← instrukcja rozbicia na moduły (dla Antigravity)
```

## 📁 Docelowa struktura (po refaktorze)

```
PFM/
├── index.html              (szkielet HTML, ładuje resztę)
├── style.css               (cały CSS)
├── images/                 (loga klubów jako pliki .jpg/.png)
│   ├── ekstraklasa/
│   ├── 1liga/
│   ├── 2liga/
│   └── ...
├── data/
│   ├── teams.js            (składy, nazwy klubów, logi)
│   ├── comments.js         (ULTRA_COMMENTS, headlineTemplates)
│   ├── scout-notes.js      (ULTRA_SCOUT_NOTES)
│   ├── europe-dialogues.js (EUROPE_DIALOGUES_DB)
│   ├── twitter-personas.js (CLUB_TWITTER_PERSONAS)
│   ├── referees.js         (REFEREES_BY_TIER)
│   ├── stadiums.js         (CLUB_STADIUMS_DB)
│   ├── euro-clubs.js       (EURO_CLUBS)
│   └── journalists.js      (LEAGUE_JOURNALISTS)
├── js/
│   ├── config.js           (tierNames, FFP_LIMITS, stałe)
│   ├── game-state.js       (zapis/odczyt IndexedDB + localStorage)
│   ├── match-engine.js     (symulacja meczu, getTeamStrength)
│   ├── match-ui.js         (intro, zmiany, taktyka w trakcie meczu)
│   ├── league.js           (tabela, awanse, spadki, kolejki)
│   ├── transfers.js        (rynek transferowy, AI transfery, FFP)
│   ├── scouting.js         (skauci, oceny, archetypes)
│   ├── europe.js           (puchary UEFA, eliminacje)
│   ├── cup.js              (Puchar Polski, Superpuchar)
│   ├── academy.js          (akademia, juniorzy)
│   ├── media.js            (Twitter, dziennikarze, gala)
│   ├── tactics.js          (formacje, style, role, boisko 2D)
│   ├── weather.js          (generator pogody)
│   ├── tv.js               (stacje telewizyjne)
│   ├── set-pieces.js       (stałe fragmenty gry)
│   ├── contracts.js        (negocjacje kontraktów)
│   ├── calendar.js         (kalendarz sezonu)
│   ├── ui.js               (nawigacja, renderowanie paneli)
│   └── main.js             (init gry, start, łączenie modułów)
└── README.md
```

## 🛠️ Jak zrobić refaktor

Otwórz `REFACTOR.md` i przekaż treść Antigravity (lub innemu AI). Instrukcja jest krok po kroku.

## 👤 Autor

Game design & koncept: [Twoje imię]  
Kod: Antigravity AI  
Wersja: OMEGA v3.5
