# 🔧 Instrukcja Refaktoru — dla Antigravity / AI

## CEL

Rozbić `game.html` (9.4MB, jeden plik) na modularną strukturę wieloplikową.  
Gra MUSI działać identycznie po rozbijeniu.

---

## KROK 1: Wyodrębnij CSS

1. Wytnij wszystko między `<style>` a `</style>` z `game.html`
2. Zapisz jako `style.css`
3. W `index.html` dodaj `<link rel="stylesheet" href="style.css">`

---

## KROK 2: Wyodrębnij obrazki base64

1. Znajdź obiekt z logami klubów (szukaj `"data:image/jpeg;base64,"`). To jest w obiekcie `COMP_WALLPAPERS` i/lub w innym obiekcie z logami.
2. Dla każdego klucza (np. `"ekstraklasa"`, `"supercup"`) zapisz obrazek jako plik `.jpg` w katalogu `images/`
3. Zamień w kodzie `"data:image/jpeg;base64,..."` na `"images/nazwa.jpg"`
4. To zmniejszy plik z ~9MB do ~1.5MB

---

## KROK 3: Wyodrębnij dane do osobnych plików

Każdy duży obiekt `const` z danymi wyciągnij do osobnego pliku w `data/`:

| Zmienna w kodzie | Nowy plik | Opis |
|-----------------|-----------|------|
| `COMP_WALLPAPERS` | `data/wallpapers.js` | tapety/loga |
| `EUROPE_DIALOGUES_DB` | `data/europe-dialogues.js` | dialogi UEFA |
| `CLUB_TWITTER_PERSONAS` | `data/twitter-personas.js` | persony twitterowe |
| `REFEREES_BY_TIER` | `data/referees.js` | baza sędziów |
| `CLUB_STADIUMS_DB` | `data/stadiums.js` | stadiony |
| `LEAGUE_JOURNALISTS` | `data/journalists.js` | dziennikarze |
| `SCOUT_ARCHETYPES` | `data/scout-archetypes.js` | archetypy skautów |
| `EURO_CLUBS` | `data/euro-clubs.js` | kluby europejskie |
| Dane drużyn (wielki JSON na początku) | `data/teams.js` | składy wszystkich klubów |
| `headlineTemplates` | (w teams.js) | szablony nagłówków |

Format pliku `data/XXX.js`:
```js
// data/referees.js
const REFEREES_BY_TIER = {
    // ... dane ...
};
```

---

## KROK 4: Wyodrębnij logikę do modułów JS

Każdy blok oznaczony `// ====` wyciągnij do osobnego pliku w `js/`:

| Sekcja | Nowy plik |
|--------|-----------|
| Fullscreen engine | `js/fullscreen.js` |
| Superpuchar | `js/supercup.js` |
| Weather engine | `js/weather.js` |
| Pre-match intro + in-match substitutions | `js/match-ui.js` |
| Nagrody finansowe (EUR_TO_PLN_RATE...) | `js/finances.js` |
| TV broadcasters | `js/tv.js` |
| Transfer value table + relegation | `js/squad-management.js` |
| Starting XI OVR calculator | `js/ovr-calculator.js` |
| Season evolution | `js/season-evolution.js` |
| Akademia | `js/academy.js` |
| Club profile modal | `js/club-profile.js` |
| Match engine (getTeamStrength...) | `js/match-engine.js` |
| Half-time tactics | `js/tactics-live.js` |
| Dziennikarze + media | `js/media.js` |
| Twitter/X feed | `js/twitter.js` |
| Scouting (3 skautów) | `js/scouting.js` |
| Analityk taktyczny | `js/analyst.js` |
| Set pieces (SFG) | `js/set-pieces.js` |
| Taktyka + formacje + boisko 2D | `js/tactics.js` |
| Positional OVR calculator | `js/position-ovr.js` |
| IndexedDB save system | `js/save-system.js` |
| Gala Złotego Orła | `js/gala.js` |
| Contract negotiations | `js/contracts.js` |
| Transfer bids (4 phases) | `js/transfer-bids.js` |
| European access + qualifiers | `js/europe.js` |
| European competition (initEuropeSeason) | `js/europe-season.js` |
| Calendar | `js/calendar.js` |
| Advanced transfer options | `js/transfer-options.js` |
| UI, nawigacja, setup screen | `js/ui.js` |
| Main init (startGame, advanceSeason) | `js/main.js` |

---

## KROK 5: Stwórz `index.html`

```html
<!doctype html>
<html lang='pl'>
<head>
    <meta charset='utf-8'>
    <title>Mini Football Career OMEGA v3.5</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- HTML body z game.html (divy, setup-screen etc.) -->

    <!-- Dane -->
    <script src="data/teams.js"></script>
    <script src="data/wallpapers.js"></script>
    <script src="data/europe-dialogues.js"></script>
    <script src="data/twitter-personas.js"></script>
    <script src="data/referees.js"></script>
    <script src="data/stadiums.js"></script>
    <script src="data/journalists.js"></script>
    <script src="data/scout-archetypes.js"></script>
    <script src="data/euro-clubs.js"></script>

    <!-- Logika gry -->
    <script src="js/config.js"></script>
    <script src="js/fullscreen.js"></script>
    <script src="js/weather.js"></script>
    <script src="js/tv.js"></script>
    <script src="js/finances.js"></script>
    <script src="js/ovr-calculator.js"></script>
    <script src="js/position-ovr.js"></script>
    <script src="js/squad-management.js"></script>
    <script src="js/season-evolution.js"></script>
    <script src="js/academy.js"></script>
    <script src="js/match-engine.js"></script>
    <script src="js/match-ui.js"></script>
    <script src="js/tactics.js"></script>
    <script src="js/tactics-live.js"></script>
    <script src="js/set-pieces.js"></script>
    <script src="js/scouting.js"></script>
    <script src="js/analyst.js"></script>
    <script src="js/media.js"></script>
    <script src="js/twitter.js"></script>
    <script src="js/transfers.js"></script>
    <script src="js/transfer-bids.js"></script>
    <script src="js/transfer-options.js"></script>
    <script src="js/contracts.js"></script>
    <script src="js/supercup.js"></script>
    <script src="js/cup.js"></script>
    <script src="js/europe.js"></script>
    <script src="js/europe-season.js"></script>
    <script src="js/gala.js"></script>
    <script src="js/save-system.js"></script>
    <script src="js/calendar.js"></script>
    <script src="js/club-profile.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

---

## WAŻNE ZASADY

1. **Nie zmieniaj nazw zmiennych/funkcji** — inne moduły mogą się do nich odwoływać
2. **Wszystkie zmienne `const`/`let`/`function` muszą być globalne** (bez `export`) — tak jak teraz
3. **Kolejność `<script>` w index.html MA ZNACZENIE** — dane przed logiką, config przed resztą
4. **Testuj po każdym kroku** — otwórz `index.html` w przeglądarce, sprawdź czy gra startuje
5. **Zachowaj `game.html` jako backup** — zawsze można wrócić

---

## OPTYMALIZACJA (później, opcjonalnie)

- Zdeduplikuj `headlineTemplates` (500 wpisów → 11 unikalnych)
- Zamień inline `onclick="..."` na event listenery w JS
- Dodaj `escapeHtml()` przy renderowaniu danych użytkownika (managerName, tweety)
- Self-host Google Fonts (dla pełnego offline)
