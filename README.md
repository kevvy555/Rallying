# Rallying — The Rally Archive

A lightweight, responsive personal rallying website. No framework or build step required.

## Site sections

- Home, with a photograph of the number 64 Peugeot 205 rally car.
- Rally cars > Peugeot 205 GTi 1.9 > Overview, History, Testing & Procedures, Events.
- Testing procedures organised by vehicle system. Initial procedure: Braking system > Brake servo & vacuum circuit.

## Run locally

Open `index.html` in a browser, or run `python -m http.server 8000` from this directory and visit `http://localhost:8000/`.

## Hosting on GitHub Pages

In repository **Settings > Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save. GitHub Pages can serve this site directly.

## Add more procedures

The system categories and procedure registry live at the top of `app.js` (`CATEGORIES` and `PROCEDURES`). Add a corresponding page renderer and route in `getPage` for each new procedure. History and Events are starter sections intentionally awaiting confirmed dates and details.

## Imagery

`assets/peugeot-205-rally.webp` is the owner-supplied photograph. Copyright remains with its owner. The site uses it for the home hero and car pages.

## Brake safety

Workshop procedures are diagnostic notes, not a substitute for manufacturer instructions or professional inspection. Never drive with compromised brake assistance.