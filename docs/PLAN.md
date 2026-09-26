# Plan stabilizacji i rozwoju PFM

Data: 2026-09-26. Wersja referencyjna: commit `4e59c2b6976ee11845f024fb924267d3224c55b3`.

## Cel

Zachować grywalny prototyp i stopniowo przekształcić go w aplikację z testowalnym silnikiem, bezpiecznymi zapisami, edytorem dla autora, kontami użytkowników i aktualizowaną bazą polskiego futbolu. Każdy etap pozostawia działającą grę. Nie realizujemy wszystkich etapów jednocześnie.

## Ocena stanu wyjściowego

Repozytorium zawiera `game.html`, README i historyczną instrukcję refaktoryzacji. HTML ma 22 142 linie i 9 768 956 bajtów; około 83% rozmiaru to obrazy base64. W kodzie występuje 275 `onclick=`, 211 `innerHTML` i 147 `Math.random()`.

Istnieją mechaniki meczów, taktyki, sezonów, pucharów krajowych i europejskich, transferów i negocjacji, finansów, akademii, stadionu, scoutingu, mediów i zapisu kariery. Media społecznościowe są symulacją. Nie ma backendu, kont ani integracji danych.

Najważniejsze problemy:

- Stan `G`, inne zmienne globalne, dane i DOM są silnie powiązane.
- Zmieniana przez awanse i spadki mapa `clubs` nie trafia do dotychczasowego zapisu `G`.
- `endSeason` przenosi kluby przed obliczeniem pozycji gracza, co może dać pozycję 0, błędną nagrodę i błędny kierunek zmiany ligi.
- Europejskie kwalifikacje również są obliczane po zmianach składu lig.
- Dwie różne konfiguracje FFP i podmiana funkcji przy starcie gry.
- Import sprawdza głównie obecność `myClub`; brakuje wersjonowania i pełnej walidacji.
- Treść użytkownika jest wstawiana do HTML, co tworzy ryzyko wykonania niechcianego kodu.
- Rozproszona losowość utrudnia odtwarzanie błędów i ocenę balansu.
- Aktualna piramida jest uproszczona; dolne poziomy to wybrana ścieżka mazowiecko-warszawska. Kadry są częściowo rzeczywiste i dopełniane wygenerowanymi zawodnikami do 30 osób.

Ocena początkowa była analizą statyczną, nie pełnym testem gry w przeglądarce. `REFACTOR.md` zachowujemy jako mapę sekcji; zalecenie utrzymania wszystkich globali nie jest architekturą docelową.

## Założenia produktu

- Na początek osobne kariery single-player, możliwość lokalnej gry i późniejsze opcjonalne konta/chmura.
- Zachowujemy bieżącą ścieżkę regionalną; kolejne regiony dodajemy po przygotowaniu modelu rozgrywek.
- Wspólny świat multiplayer wymaga osobnej decyzji i projektu autorytatywnej symulacji na serwerze.
- Nie wybieramy jeszcze płatnego dostawcy danych, hostingu ani docelowego frameworka UI.
- Dokładny zakres regionów, budżet danych i sposób publicznego udostępniania pozostają do ustalenia przed zależnymi etapami.

## Architektura docelowa

1. **Silnik gry:** mecze, sezony, transfery, finanse, rozwój zawodników; bez DOM i sieci. Jawne wejście/wyjście oraz kontrolowana losowość.
2. **Interfejs:** ekrany i animacje prezentujące stan oraz wysyłające polecenia do silnika.
3. **Baza świata:** kluby, zawodnicy, rozgrywki, rzeczywiste transfery, źródła oraz wersje składów.
4. **Serwer i administracja:** konta, uprawnienia, chmura, publikowanie bazy i importy.

Wystarczy jeden backend i baza danych. Silnik przenosimy stopniowo do modułów, następnie TypeScriptu. Obecny wygląd można zachować. Grafiki i CSS wydzielamy oddzielnie od zmian mechaniki.

Model danych: stałe `clubId`, `playerId`, `competitionId`, osobne sezon i przynależność drużyny do grupy. Nazwa klubu nie może być kluczem tożsamości. Awanse, spadki, baraże, punktacja i liczba rund są wersjonowaną konfiguracją. Oceny gry i potencjał pozostają własnym modelem, oddzielonym od faktów importowanych.

## Źródła rzeczywistych danych

Weryfikacja źródeł wstępna na 2026-09-26; obecność ligi w katalogu nie gwarantuje kompletnych kadr i transferów.

| Źródło | Zastosowanie | Co sprawdzić |
| --- | --- | --- |
| API-Football | Składy, identyfikatory, transfery; katalog obejmuje m.in. Ekstraklasę, I ligę i grupy III ligi | Próbka konkretnych klubów/sezonu, kompletność i opóźnienia, warunki publikacji |
| Sportmonks | Alternatywny dostawca danych | Pokrycie polskich lig i pól w wybranym planie |
| Łączy Nas Piłka / PZPN / ZPN | Regionalne rozgrywki, drużyny i zawodnicy | Dostęp uzgodniony z operatorem; nie potwierdzono publicznego API |
| 90minut.pl | Weryfikacja i uzupełnianie polskich danych | Nie potwierdzono publicznego API ani warunków automatycznego wykorzystania |
| Transfermarkt | Potencjalne źródło po uzgodnieniu dostępu | Nie potwierdzono oficjalnego publicznego API; nie budować zależności od nieoficjalnego scrapera |

Źródła:

- https://www.api-football.com/coverage
- https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginners-guide
- https://www.sportmonks.com/football-api/coverage/
- https://www.laczynaspilka.pl/rozgrywki
- https://www.90minut.pl/ligireg-6.html

Strategia: automatyzacja dobrze pokrytych lig, CSV i edytor dla pozostałych. Przed wyborem potwierdzić dostęp i możliwość publikacji danych, herbów oraz zdjęć. Wykonać pilotaż jednej ligi, oceniając braki, duplikaty, mapowanie ID, koszty zapytań i opóźnienie wykrycia transferu. Nie obiecywać aktualizacji w czasie rzeczywistym bez pomiarów dostawcy.

## Proces aktualizacji danych

1. Zaplanowane pobranie na serwerze, z limitem zapytań, ponawianiem i historią błędów.
2. Dopasowanie po ID dostawcy i własnych ID; nazwy tylko do pomocniczego wykrywania kandydatów.
3. Walidacja, wykrywanie zmian, braków i duplikatów.
4. Podgląd różnic oraz ręczne zatwierdzenie konfliktów.
5. Publikacja niezmiennej wersji bazy, np. „Składy — wrzesień 2026”.
6. Nowa kariera wybiera wersję bazy. Trwająca kariera zachowuje własny świat, transfery i historię.

Import ponowiony nie tworzy duplikatów. Ręczne poprawki mają autora i ochronę przed nadpisaniem. Najpierw zatwierdzanie ręczne; automatyczna publikacja dopiero dla sprawdzonych przypadków. Odróżniać wypożyczenie, powrót, transfer definitywny, datę obowiązywania i nieznaną kwotę.

## Panel autora i administratora

| Obszar | Funkcje |
| --- | --- |
| Użytkownicy | Zaproszenie/utworzenie konta, blokada, reset hasła, role administrator/redaktor/tester/gracz |
| Kluby i zawodnicy | Edycja składów, pozycji, ocen, potencjału, stadionów, budżetów; duplikaty; import CSV |
| Rozgrywki | Sezony, grupy, przypisania klubów, rundy, punktacja, baraże, awanse i spadki |
| Balans | Ekonomia, trening, kontuzje, transfery, akademia i poziomy trudności bez zmian kodu |
| Importy | Podgląd różnic, zatwierdzanie, nierozpoznane rekordy, data ostatniego sukcesu i błędy |
| Wydania bazy | Szkic, podgląd, publikacja, historia i powrót do poprzedniego wydania |
| Kariery i wsparcie | Kopie, diagnostyka, przywracanie, naprawy z audytem |
| Treści | Wiadomości zarządu, komentarze, wydarzenia i szablony medialne |

Tryb testera: start z wybraną konfiguracją, skok do końcówki sezonu, wymuszenie transferu/kontuzji i symulacja wielu sezonów. Modyfikacje testowe oddzielone od zwykłych karier. Uprawnienia kontrolowane na serwerze, historia zmian i możliwość cofnięcia publikacji.

## Etapy i kryteria odbioru

| Etap | Zakres | Kryterium zakończenia |
| --- | --- | --- |
| 1. Zabezpieczenie | Wersja referencyjna w Git, scenariusze ręczne, syntetyczne zapisy i regresje | Powtarzalna kontrola startu, meczu, transferu, zapisu i sezonu |
| 2. Stabilizacja | Koniec sezonu, pełny zapis świata, FFP, bezpieczne treści, walidacja i migracje | Kariera po zmianie ligi poprawnie działa po zamknięciu i odtworzeniu; kluczowe błędy mają testy |
| 3. Moduły | Grafiki/CSS/dane osobno; silnik oddzielony od DOM, kontrolowana losowość | Sezon symulowany automatycznie bez ekranów gry |
| 4. Model i edytor | ID, wersje świata, rozgrywki, CSV i publikacja | Autor publikuje nowy skład bez edycji kodu |
| 5. Konta i chmura | Logowanie, role, izolacja zapisów, backup i audyt | Dwaj użytkownicy mają niezależne kariery, administrator kontrolowane uprawnienia |
| 6. Dane automatyczne | Pilotaż jednej ligi/dostawcy, harmonogram, różnice i błędy | Powtarzalne importy nie naruszają karier |
| 7. Rozwój gry | Kolejne regiony, szczegółowe zasady, balans wielosezonowy, telefony | Każde rozszerzenie przechodzi regresje i test rozgrywki |

W panelu edycji z etapu 4 przed publicznym wdrożeniem muszą istnieć uprawnienia; etap 5 rozszerza je o konta graczy i chmurę. Do tego czasu edytor jest lokalnym narzędziem autora.

## Automatyzacja jakości

- Przy zmianach uruchamiać składnię/testy/regresje w CI.
- Sprawdzać własność zawodników, rozliczenia transferu, kompletność terminarza i spójność lig.
- Testować zapis/odczyt w nowej instancji oraz starsze formaty.
- Po wydzieleniu silnika symulować wiele sezonów ze znanym ziarnem losowości i mierzyć ekonomię, gole, kontuzje oraz awanse.
- Docelowo dodać testy przeglądarkowe i monitorowanie błędów wdrożonej aplikacji.

## Dziennik realizacji

- 2026-09-26: zapisano plan i zasady AGENTS.md. Rozpoczęto etapy 1–2: regresje zapisu i końca sezonu. Szczegóły wykonania oraz ograniczenia aktualizujemy po weryfikacji.
- 2026-09-26: dodano 9 testów regresji wykonywanych na skrypcie z `game.html` w izolowanym środowisku Node z atrapą DOM. Testy przeszły; odtworzono wcześniej błędną pozycję 0, błędny kierunek spadku oraz nieprawidłową listę kwalifikacji europejskich.
- Naprawiono ustalanie pozycji i uczestników Europy przed przeniesieniem klubów; podsumowanie pokazuje ligę zakończonego sezonu, a zmiana ligi gracza wynika z tej samej listy ruchów co reszta klubów.
- Nowe zapisy zawierają `saveVersion: 1` i `clubsByTier`. Odczyt oraz import używają wspólnej podstawowej walidacji, starsze zapisy odtwarzają przynależność z tabel. Niespójne dane są odrzucane przed zmianą stanu. IndexedDB potwierdza zapis po zakończeniu transakcji.
- Dodano workflow CI i scenariusze ręczne. Workflow nie został jeszcze uruchomiony na GitHub; lokalnie testy oraz `git diff --check` przeszły. Nie wykonano testów w przeglądarce.

### Następny zakres i ograniczenia pierwszej zmiany

- Etapy 1 i 2 pozostają w toku: potrzebna kontrola przeglądarkowa startu, meczu, transferu i pełnego sezonu.
- Walidacja zapisu obejmuje wersję, klub gracza, poziom, kadry i przynależność w tabelach; nie jest jeszcze pełnym schematem wszystkich pól kariery. Zapisy już uszkodzone przez dawny błąd zmiany ligi mogą wymagać osobnego narzędzia naprawczego.
- Nie zmieniono FFP, renderowania treści użytkownika, reguł rozstrzygania remisów punktowych ani momentu nakładania kary punktowej. Te zagadnienia pozostają do odrębnej stabilizacji z testami.
- Nie wydzielono jeszcze silnika ani grafik; gra nadal uruchamia się z pojedynczego HTML. Panel, konta i integracje pozostają zaplanowane.
