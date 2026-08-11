# Captain Bond Static Website

A spy-themed activity registration and booking page. No build step or Node.js required — it's pure HTML, CSS, and JavaScript.

## How to run

The app is served by Python's built-in HTTP server:

```
python3 -m http.server 5000
```

This is configured as the **Start application** workflow. Just press Run or start the workflow to serve the site on port 5000.

## Project files

- `index.html` — main page
- `style.css` — all styling
- `script.js` — interactivity (agent selection, mission cards, registration form, confetti, etc.)
- `google-apps-script.js` — Apps Script code that runs server-side on Google's infrastructure to write form submissions to Google Sheets

## Google Sheets / Apps Script backend

The registration form POSTs to a deployed Google Apps Script URL (configured in `script.js`). If you need to update the script:

1. Edit `google-apps-script.js`
2. Open the Apps Script project, paste the new code
3. Deploy → Manage deployments → Edit → New version → Deploy

## User preferences

_No preferences recorded yet._
