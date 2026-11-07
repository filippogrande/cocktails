# Cocktails

Menu dei cocktail statico in stile menu di ristorante, tema scuro: sfondo quasi nero,
serif (Playfair Display) per i titoli, sans (Inter) per il testo. Nessun framework CSS,
nessuna build step: tre file serviti da nginx.

Otto drink principali con ricetta a parti, ingredienti e link alla ricetta originale; in fondo
la sezione piu' sobria PROBABILMENTE NON LI FACCIO con Black Russian, Cape Codder e Margarita.

## Come si lancia

    cd cocktails_site
    docker compose up -d --build

Il sito risponde su http://10.0.0.5:8096

Comandi utili:

    docker compose ps          # stato + healthcheck
    docker compose logs -f     # log (json-file, 10m x 3)
    docker compose down        # stop e rimozione container

## Come si modifica

Tutto e' dentro l'immagine, quindi dopo una modifica va ricostruito.

| File | Cosa contiene |
|---|---|
| `index.html` | struttura, testi, card dei drink, ricette e link |
| `style.css` | tema scuro, tipografia, griglia, hover, responsive |
| `script.js` | reveal on scroll (IntersectionObserver), header allo scroll, fallback immagini |
| `nginx.conf` | server block: gzip, cache, header di sicurezza |
| `Dockerfile` | immagine `nginx:alpine`, healthcheck |
| `docker-compose.yml` | servizio, porta, log rotation |

### Aggiungere o cambiare un drink

In `index.html` duplica un `<article class="card">` dentro `<div class="grid">` e cambia:

- `src` e `alt` dell'immagine;
- `--fb` nello `style` dell'article: e' il gradiente di fallback mostrato se la foto non carica;
- nome, `.ratio` (proporzioni), voci di `<ul class="ingredients">` e `href` del link.

La griglia e' automatica: 1 colonna su mobile, 2 da 640px, 3 da 1024px.

### Foto

Nessun file binario nel repository: le immagini sono URL remoti (Unsplash) e ognuna ha
`onerror="this.classList.add('is-broken')"`. Se l'immagine non risponde, l'immagine diventa
trasparente e resta visibile il gradiente CSS della card.

### Ricostruire dopo le modifiche

    docker compose up -d --build

## Struttura

    .
    |-- index.html
    |-- style.css
    |-- script.js
    |-- nginx.conf
    |-- Dockerfile
    |-- docker-compose.yml
    |-- .dockerignore
    `-- README.md

## Note

- Porta host: 8096, bindata su 10.0.0.5.
- Healthcheck: `wget --spider http://127.0.0.1/` ogni 30s.
- Log: json-file, max 10 MB per file, 3 file.
- Il sito e' statico e non espone API: nessuna variabile d'ambiente necessaria.
