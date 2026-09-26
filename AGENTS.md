# Zasady pracy nad PFM

## Cel i zakres

- Rozwijamy polski menedżer piłkarski, zachowując istniejące mechaniki i kariery.
- Plan oraz status prac: `docs/PLAN.md`. Historyczny `REFACTOR.md` jest mapą kodu, nie docelową architekturą. Te zasady zastępują jego zalecenie utrzymywania globalnych zmiennych.
- Wprowadzaj małe, sprawdzalne zmiany. Nie przepisuj całej gry przy okazji naprawy błędu.
- Zachowuj polski język interfejsu i dokumentacji. Informuj uczciwie, co sprawdzono automatycznie, a czego nie uruchomiono.

## Architektura

- Oddzielaj silnik symulacji, interfejs, dane świata, przechowywanie karier i integracje.
- Nowe moduły powinny mieć jawne zależności. Nie dodawaj monkey patchy ani nowych zmiennych globalnych bez uzasadnienia migracyjnego.
- Docelowo silnik działa bez DOM i sieci. Losowość i zegar powinny być przekazywane jako zależności.
- Kluby, zawodnicy i rozgrywki otrzymają stałe ID. Nazwa nie jest identyfikatorem.
- Rozgrywki opisuj przez sezon, poziom, region, grupę i wersjonowane zasady.
- Nie dodawaj infrastruktury ani frameworków bez konkretnej potrzeby. Zachowuj uruchamianie `game.html` do czasu świadomej migracji opisanej w README.

## Dane i zapisy

- Zapis musi obejmować cały zmienny świat kariery, mieć wersję formatu oraz migrację wcześniejszych obsługiwanych wersji.
- Waliduj import przed zmianą aktywnej kariery. Nie zgaduj brakujących danych, jeśli mogłoby to uszkodzić karierę; zwróć zrozumiały błąd.
- Aktualizacje rzeczywistych składów tworzą nowe wersje bazy startowej. Nie nadpisują trwających karier.
- Importy mają być powtarzalne bez duplikatów, z pochodzeniem danych, podglądem różnic i ochroną ręcznych poprawek.
- Nie łącz rzeczywistych faktów z ocenami symulacji bez oznaczenia ich źródła.
- Nie dodawaj kluczy API, haseł ani prywatnych zapisów graczy do repozytorium. Integracje i uprawnienia administratora kontroluje serwer.
- Tekst użytkownika wyświetlaj przez `textContent` lub kontekstowo bezpieczne kodowanie. Nie wstawiaj go bezpośrednio do HTML lub kodu obsługi zdarzeń.

## Weryfikacja i proces

- Dla napraw logiki dodawaj test odtwarzający błąd. Testuj zachowanie, nie szczegóły implementacji.
- Uruchamiaj `node --test` oraz `git diff --check`. Testy obecnego kodu nie wymagają zależności zewnętrznych.
- Testy z atrapą DOM nie zastępują sprawdzenia gry w przeglądarce. Scenariusze ręczne: `docs/TESTING.md`.
- Przy zmianie sezonu sprawdzaj awans, spadek, pozostanie w lidze, nagrody i kwalifikację do Europy.
- Przy zmianie zapisu sprawdzaj eksport/import, stary format, błędny plik, ponowne uruchomienie i zachowanie lig po awansach.
- Nie zmieniaj balansu ani zasad rozgrywek niejawnie w ramach refaktoryzacji. Zapisuj takie decyzje w planie.
- Aktualizuj dokumentację i status etapów po wykonanej pracy. Nie deklaruj ukończenia etapu bez jego kryteriów odbioru.
- Zachowaj referencję do wersji wyjściowej w Git. Nie kopiuj wielomegabajtowego HTML jako kolejnych backupów do repozytorium.
