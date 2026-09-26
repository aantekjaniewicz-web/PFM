# Sprawdzanie PFM

## Automatycznie

Wymagany Node.js 24 (bez instalowania paczek): `node --test`.
Przed zakończeniem zmian: `git diff --check`.
Testy logiki z atrapami interfejsu nie zastępują testów przeglądarkowych.

## Ręczne scenariusze odbioru

1. Otwórz `game.html`, rozpocznij karierę w najwyższej i najniższej lidze, przejdź główne zakładki.
2. Rozegraj sparing i mecz ligowy, zmień taktykę i zawodnika, sprawdź wynik oraz tabelę.
3. Kup, sprzedaj i zwolnij zawodnika; sprawdź składy, budżet, płace i historię.
4. Zapisz lokalnie i do pliku, zamknij stronę, otwórz ponownie, odtwórz obie kopie.
5. Sprawdź koniec sezonu dla awansu, spadku i pozostania: pozycja, premia, liga, uczestnicy Europy oraz oferty pracy.
6. Po zmianie sezonu zapisz, zamknij stronę i wczytaj. Sprawdź przynależność wszystkich klubów i kolejny terminarz.
7. Spróbuj importować uszkodzony JSON i nieobsługiwaną wersję. Aktywna kariera powinna pozostać bez zmian.
8. Sprawdź tekst z polskimi znakami, apostrofami i znacznikami HTML w nazwie trenera i mediach; powinien być tekstem, nie wykonywanym kodem (naprawa tego obszaru pozostaje w etapie 2).

Używaj syntetycznych karier. Nie umieszczaj prywatnych zapisów graczy w repozytorium.
