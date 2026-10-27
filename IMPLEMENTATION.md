# Programme implementation report

Both **Memories Meet Digital** and **Travelling without Borders** are added to the existing Captain Bond Activity Directory. All six original activities remain, with unchanged IDs, mission briefs and agent fit scores. Featured programme cards use factual information rather than fabricated recommendations or remaining vacancies.

- Added `programmes.js`, two local SVG illustrations in `images/`, and two regression scripts in `tests/`.
- Updated `index.html`, `script.js`, `style.css` and `README.md`.
- Fixed theme filters to match existing category names, added digital/cultural/family facets and a clear action, corrected empty results visibility, and restored saved agent selections instead of deleting them on load.
- Added keyboard focus trapping, background inertness, focus return, close-button, backdrop and Escape closing. Programme details scroll within the existing modal. Session selection and a telephone summary are on the same screen.

## Registration

No original posters or verified programme registration URLs were present in the project or supplied attachment. The Apps Script source exists, but the website does not actually submit to it; its deployed service and spreadsheet were not verified. Its configuration and columns were left unchanged.

The new programmes therefore use clearly labelled telephone registration at **8687 0039** (Memories) and **6347 2801** (Travelling). Families select a date and 1–4 family dyads, then read the selected programme, date, fixed time, full venue and dyad/people count to staff. Staff collect name/contact details directly and confirm availability. No personal contact data is collected or stored in the browser, and no success message or reservation is generated. Invalid or elapsed session selections cannot produce a valid booking summary; telephone enquiries remain available.

No backend setup is needed for this telephone flow. To offer online submission later, staff must supply an official registration link or verify a service with validation, duplicate handling, network error handling, and server-side booking limits. No genuine end-to-end registration submission or telephone call was performed.

## Staff scheduling check

All **15 supplied sessions** are retained as explicit ISO calendar dates in Asia/Singapore. The advertised Memories dates **23 December 2026, 30 December 2026 and 6 January 2027 are Wednesdays**. Staff should verify this discrepancy against the poster's Thursday wording. The interface displays actual weekdays and never promises weekly Thursdays. Every session runs **1:30 PM to 3:30 PM**. At its start time, a session becomes unavailable for new registration but remains visible. Four dyads is capacity, not remaining availability.

## Verification results

- **2/2 Node tests passed:** all 15 advertised dates, official addresses and numbers, fixed hours, fee/capacity, Singapore midnight boundary, session-start cutoff and Wednesday dates.
- **98 browser checks passed in headless Chromium:** cards/images, search, all filter groups, empty/clear states, detail content, session/dyad summaries and invalid selections, official telephone targets, all six original mission briefs, agent sorting and persistence, community voting/persistence, unrelated localStorage retention, focus trapping/return, Escape/button/backdrop closing, and past-session retention.
- Page and both programme modals checked at **320, 375, 768, 1024 and 1440px** with no clipped visible elements or horizontal overflow.
- JavaScript syntax checks passed. No browser JavaScript errors or missing local asset responses in the regression run. Original externally hosted activity images loaded during visual inspection; their ongoing hosting is external.
- Desktop directory and mobile modal screenshots were visually inspected. These checks used a local HTTP server and desktop Chromium emulation, not physical phones/tablets or a production deployment.

The original activity demonstration registration remains outside the new programme telephone flow. It should not be treated as evidence of a live Google Sheets booking service.
