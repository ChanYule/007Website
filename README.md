# Captain Bond Static Website — Enhanced Version

This version does not need Node.js or npm.

## How to run
1. Unzip the folder.
2. Open `index.html` by double-clicking it.
3. For a more realistic test, open PowerShell in this folder and run:
   ```powershell
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

## Google Sheets connection
The registration form is already connected to this Apps Script URL:

`https://script.google.com/macros/s/AKfycbzD_se-4dl1uYb--4VdMK0fiSr7cgxJblKKdPYEQKo9sd54Ky_XGnC120oSUAwduC3KaQ/exec`

## Added professional features
- Language bar stays at the top
- Agent selection appears first
- Mission progress tracker
- Loading / access granted screen
- Agent selection animation
- Recommended missions based on selected agent
- More interactive mission cards
- Availability bar and per-timeslot spaces based on local registrations
- Typewriter-style mission briefing
- Mission accepted reference number
- Achievement badges
- Confetti success animation

Note: Google Sheets stores submitted registrations. Live cross-user slot availability requires the Apps Script to also return existing bookings; this static version updates availability locally in the browser after a registration.


## Important Google Sheets fix
After replacing `google-apps-script.js`, you must redeploy the Apps Script:
1. Apps Script > Deploy > Manage deployments.
2. Click the pencil/edit icon.
3. Select **New version**.
4. Click **Deploy**.

The script now writes these columns correctly: submission date, activity, agent, language, pax, time slot, phone, Instagram, custom request, willingness to pay, and budget range.
