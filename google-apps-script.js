// Google Apps Script for Captain Bond registrations
// IMPORTANT:
// 1) Paste this whole file into Apps Script (https://script.google.com).
// 2) Set the SPREADSHEET_ID constant below if you are using a standalone script (not bound to the sheet).
//    - If you leave SPREADSHEET_ID empty, the script will use the active spreadsheet (bound script).
// 3) Deploy → Manage deployments → New deployment → Select "Web app" →
//    - Execute as: Me
//    - Who has access: Anyone (even anonymous)  <-- required if the website is public
//    - Save and copy the Web app URL, then paste it into your site's script.js as GOOGLE_SCRIPT_URL

const SPREADSHEET_ID = ''; // Optional. Put your Google Spreadsheet ID here if needed, e.g. '1AbC...'
const SHEET_NAME = 'Registrations';

const HEADERS = [
  'submission_date',
  'activity_name',
  'activity_id',
  'agent_id',
  'agent_name',
  'language',
  'num_participants',
  'time_slot',
  'phone',
  'instagram',
  'custom_activity_request',
  'willing_to_pay',
  'budget_range'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    ensureHeaders_(sheet);

    const data = parseRequest_(e);
    const row = HEADERS.map(header => data[header] !== undefined && data[header] !== null ? String(data[header]) : '');

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, HEADERS.length).setValues([row]);

    return json_({ status: 'success', saved: true });
  } catch (err) {
    return json_({ status: 'error', message: err.message });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet(e) {
  // Support both JSON and JSONP (callback=...)
  const payload = { status: 'ready', message: 'Captain Bond registration endpoint is working.' };
  if (e && e.parameter && e.parameter.callback) {
    const cb = e.parameter.callback;
    return ContentService.createTextOutput(cb + '(' + JSON.stringify(payload) + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(payload);
}

function ensureHeaders_(sheet) {
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const correct = HEADERS.every((h, i) => existing[i] === h);
  if (!correct) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function parseRequest_(e) {
  let data = {};

  // Best path: website sends each field as normal form data.
  if (e && e.parameter) {
    HEADERS.forEach(h => {
      if (e.parameter[h] !== undefined) data[h] = e.parameter[h];
    });

    // Backup path: website may also send a payload JSON field.
    if (e.parameter.payload) {
      try {
        const payload = JSON.parse(e.parameter.payload);
        data = Object.assign({}, payload, data);
      } catch (err) {}
    }
  }

  // Backup path for raw JSON or raw URL-encoded body.
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (raw) {
    try {
      const json = JSON.parse(raw);
      data = Object.assign({}, json, data);
    } catch (err) {
      raw.split('&').forEach(pair => {
        const parts = pair.split('=');
        if (parts.length >= 2) {
          const key = decodeURIComponent(parts[0].replace(/\+/g, ' '));
          const value = decodeURIComponent(parts.slice(1).join('=').replace(/\+/g, ' '));
          if (key === 'payload') {
            try { data = Object.assign({}, JSON.parse(value), data); } catch (payloadErr) {}
          } else {
            data[key] = value;
          }
        }
      });
    }
  }

  if (!data.submission_date) data.submission_date = new Date().toISOString();
  return data;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
