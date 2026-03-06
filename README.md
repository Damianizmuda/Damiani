# Futures Bot Desktop (Windows .exe)

Ta wersja zachowuje funkcje poprzedniego UI (konfiguracja, dashboard, animacje, symulacja live ceny/PnL), ale jest już przygotowana jako aplikacja desktopowa i build do `.exe`.

## Co zostało zachowane i wmontowane

- panel konfiguracji: para, balans, dźwignia, TP, SL,
- przeliczanie notional value na żywo,
- uruchamianie dashboardu po kliknięciu `Start Trading`,
- animowana sekcja wykresu + live aktualizacja ceny/PnL,
- dodatkowo w desktopie: automatyczny zapis ustawień użytkownika.

## Uruchamianie lokalne (desktop)

1. Zainstaluj **Node.js LTS** (Windows).
2. W tym folderze uruchom:

```bash
npm install
npm run start
```

## Build `.exe` (Windows)

W tym samym katalogu:

```bash
npm install
npm run dist:win
```

Po zakończeniu instalator `.exe` znajdziesz w katalogu `dist/`.

## Struktura desktop

- `main.js` — proces główny Electron,
- `preload.js` — bezpieczne API do zapisu/odczytu ustawień,
- `index.html`, `styles.css`, `app.js` — UI i logika aplikacji.
