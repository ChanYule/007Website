// Advertised dates are explicit Singapore calendar dates; never infer recurrence.
const scheduledProgrammes = [
  {
    id: "memories-meet-digital", type: "scheduled-programme", accent: "rose",
    title: "Memories Meet Digital", subtitle: "Turn treasured family memories into meaningful keepsakes.",
    desc: "Turn treasured family memories into meaningful digital keepsakes. Senior parents and adult children will create photo collages, personalised keychains, and motion videos while sharing family stories and spending quality time together.",
    description: "Adult children and senior parents are invited to create, share, and rediscover family stories through fun digital activities. Learn together, create meaningful keepsakes, and strengthen family bonds.",
    categories: ["digital", "family"], categoryLabel: "Digital Creativity / Family Bonding",
    highlights: [["▧", "Create motion videos using family photographs"], ["♡", "Design personalised photo keychains"], ["▦", "Create family photo collages"], ["♧", "Share meaningful family memories"], ["✦", "Learn simple digital creative skills together"]],
    sessions: ["2026-11-12", "2026-11-19", "2026-11-26", "2026-12-10", "2026-12-17", "2026-12-23", "2026-12-30", "2027-01-06"],
    venue: { name: "Tzu Chi SEEN @ Bukit Batok (Golden Daisy)", street: "230A Bukit Batok Street 21", unit: "#02-423", postal: "651230" },
    contact: { display: "8687 0039", telephone: "+6586870039" },
    image: "images/Memories%20Meet%20Digital.png", imageAlt: "Original Memories Meet Digital programme poster with family keepsake activities, session details and registration QR code"
  },
  {
    id: "travelling-without-borders", type: "scheduled-programme", accent: "sky",
    title: "Travelling without Borders", subtitle: "Explore the world together.",
    desc: "Explore different countries and cultures together without leaving Singapore. Senior parents and adult children will enjoy virtual travel experiences, interactive games, meaningful conversations, and shared discoveries.",
    description: "A virtual travel and cultural discovery programme that takes seniors on journeys around the world through videos, discussions, games, and shared memories. Join your parent or adult child to discover new places, share stories, and strengthen family connections.",
    categories: ["cultural", "family"], categoryLabel: "Virtual Travel / Cultural Discovery / Family Bonding",
    highlights: [["◎", "Virtual travel experiences"], ["✦", "Cultural discovery activities"], ["◇", "Interactive games"], ["♡", "Meaningful family conversations"], ["♧", "Sharing travel memories and experiences"]],
    sessions: ["2026-11-30", "2026-12-02", "2026-12-03", "2026-12-07", "2026-12-09", "2026-12-10", "2027-01-06"],
    venue: { name: "GLOW Bukit Batok", street: "212 Bukit Batok Street 21", unit: "#01-237", postal: "650212" },
    contact: { display: "6347 2801", telephone: "+6563472801" },
    image: "images/Travelling%20Without%20Borders.png", imageAlt: "Original Travelling without Borders programme poster with virtual travel activities, session details and registration QR code"
  }
].map(programme => ({
  ...programme, timezone: "Asia/Singapore", startTime: "13:30", endTime: "15:30", durationMinutes: 120,
  fee: 0, capacityDyads: 4, audience: "Senior parents and adult children",
  registration: { method: "telephone", advanceRequired: true },
  supporters: ["Tzu Chi Foundation", "Families for Life", "Connecting Our Generations"]
}));

function singaporeToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = type => parts.find(item => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function sessionUnavailable(programme, date, now = new Date()) {
  // Stop offering the session when it starts. Keep every date visible in details.
  return now >= new Date(`${date}T${programme.startTime}:00+08:00`);
}
function programmeDate(date, weekday = false) {
  return new Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", ...(weekday ? { weekday: "short" } : {}), day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00+08:00`));
}
function programmeTime(programme) {
  const format = time => new Intl.DateTimeFormat("en-US", { timeZone: programme.timezone, hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(`2026-01-01T${time}:00+08:00`));
  return `${format(programme.startTime)} to ${format(programme.endTime)}`;
}
function renderProgrammeCard(programme) {
  const ended = programme.sessions.every(date => sessionUnavailable(programme, date));
  return `<article class="activity-card programme-card programme-${programme.accent}">
    <div class="programme-art"><span class="programme-featured">Featured programme</span><img src="${programme.image}" alt="${programme.imageAlt}" width="768" height="2048" loading="lazy" /></div>
    <div class="activity-body"><span class="card-label">${esc(programme.categoryLabel)}</span><h3>${esc(programme.title)}</h3>
      <p class="programme-desc">${esc(programme.desc)}</p>
      <div class="programme-badges"><span>FREE</span><span>2 hours per session</span></div>
      <dl class="programme-facts"><div><dt>Dates</dt><dd>${programmeDate(programme.sessions[0])} – ${programmeDate(programme.sessions.at(-1))}</dd></div>
      <div><dt>Time</dt><dd>${programmeTime(programme)} (SGT)</dd></div><div><dt>Venue</dt><dd>${esc(programme.venue.name)}</dd></div>
      <div><dt>For</dt><dd>${esc(programme.audience)}</dd></div></dl>
      <p class="programme-capacity">Limited places · Maximum 4 family dyads per session.<br /><small>${ended ? "Sessions completed. Contact staff for enquiries." : "Advance registration required. Call to check availability."}</small></p>
      <button class="button primary full-button" type="button" data-programme="${programme.id}">View Programme <span aria-hidden="true">→</span></button>
    </div></article>`;
}
function openProgramme(programme) {
  $("#activityModalContent").innerHTML = `<div class="programme-details programme-${programme.accent}">
    <div class="activity-modal-head"><div><span class="eyebrow">Featured family programme · FREE</span><h2 id="activityModalTitle">${esc(programme.title)}</h2></div><button class="modal-close" type="button" aria-label="Close programme details" data-close-activity>×</button></div>
    <div class="activity-modal-main"><figure class="programme-poster"><img class="programme-detail-image" src="${programme.image}" alt="${programme.imageAlt}" width="768" height="2048" /><figcaption><a class="programme-poster-link" href="${programme.image}" target="_blank" rel="noopener">View Full Poster <span class="sr-only">for ${esc(programme.title)} (opens in a new tab)</span><span aria-hidden="true">&nearr;</span></a><p>Open the original poster to zoom in or scan its registration QR code.</p></figcaption></figure>
      <h3 class="programme-subtitle">${esc(programme.subtitle)}</h3><p>${esc(programme.description)}</p>
      <button class="button primary programme-shortcut" type="button" data-programme-dates>Choose a date &amp; register by phone &darr;</button>
      <h3>What you’ll do together</h3><ul class="programme-highlights">${programme.highlights.map(([icon, text]) => `<li><span aria-hidden="true">${icon}</span>${esc(text)}</li>`).join("")}</ul>
      <h3>Choose a session date</h3><p id="sessionHelp">Each date is a separate 2-hour session. All dates and times are in Singapore time.</p>
      <label class="programme-field" for="programmeSession">Available session dates<select id="programmeSession" aria-describedby="sessionHelp" required><option value="">Choose a date</option>${programme.sessions.map(date => `<option value="${date}" ${sessionUnavailable(programme, date) ? "disabled" : ""}>${programmeDate(date, true)}${sessionUnavailable(programme, date) ? " — Completed / unavailable" : ""}</option>`).join("")}</select></label>
      <ul class="programme-date-list" aria-label="All advertised session dates">${programme.sessions.map(date => `<li><time datetime="${date}">${programmeDate(date, true)}</time>${sessionUnavailable(programme, date) ? " · Completed / unavailable" : ""}</li>`).join("")}</ul>
      <h3>Session time</h3><p>${programmeTime(programme)} (Asia/Singapore) · 2 hours per session.</p>
      <h3>Venue</h3><address><strong>${esc(programme.venue.name)}</strong><br />${esc(programme.venue.street)}<br />${esc(programme.venue.unit)}<br />Singapore ${programme.venue.postal}</address>
      <h3>Who can join</h3><p>${esc(programme.audience)}. One family dyad consists of one senior parent and one adult child.</p>
      <h3>Fee &amp; places</h3><p><strong>FREE · Maximum ${programme.capacityDyads} family dyads per session (8 people).</strong> Advance registration is required. This is the session capacity; staff will confirm current availability.</p>
      <section class="programme-registration" aria-labelledby="phoneRegistrationTitle"><h3 id="phoneRegistrationTitle">Register by telephone</h3><p>Choose a date and the number of family dyads below. Call staff with this summary and give them your name and contact number to request a booking.</p>
        <label class="programme-field" for="programmeDyads">Number of family dyads<select id="programmeDyads">${[1, 2, 3, 4].map(count => `<option value="${count}">${count} ${count === 1 ? "dyad" : "dyads"} · ${count * 2} people</option>`).join("")}</select></label>
        <p id="programmeBookingSummary" class="programme-summary" role="status">Choose a session date above to prepare your telephone registration.</p>
        <p>You can also open the full poster above and scan its original registration QR code.</p><p>This website does not submit or reserve a booking. Staff must confirm your place by telephone. Your contact details are shared directly with staff during the call.</p>
        <a class="button primary programme-call" href="tel:${programme.contact.telephone}">Call ${programme.contact.display} to register / enquire</a>
      </section>
      <h3>Contact</h3><p>Registration and enquiries: <a class="programme-contact" href="tel:${programme.contact.telephone}">${programme.contact.display}</a></p>
      <p class="programme-supporters">Supporting organisations: ${programme.supporters.map(esc).join(" · ")}</p>
    </div></div>`;
  showActivityModal();
  $("[data-programme-dates]").addEventListener("click", () => $("#programmeSession").focus());
  const updateSummary = () => {
    const date = $("#programmeSession").value;
    const dyads = Number($("#programmeDyads").value);
    const valid = programme.sessions.includes(date) && !sessionUnavailable(programme, date) && Number.isInteger(dyads) && dyads >= 1 && dyads <= programme.capacityDyads;
    $("#programmeBookingSummary").textContent = valid ? `${programme.title} · ${programmeDate(date, true)} · ${programmeTime(programme)} (SGT) · ${programme.venue.name}, ${programme.venue.street}, ${programme.venue.unit}, Singapore ${programme.venue.postal} · ${dyads} family ${dyads === 1 ? "dyad" : "dyads"} (${dyads * 2} people). Give staff your name and contact number when you call. Booking awaiting staff confirmation.` : "Choose an available session date and 1–4 family dyads to prepare your telephone registration.";
    return valid;
  };
  $("#programmeSession").addEventListener("change", updateSummary);
  $("#programmeDyads").addEventListener("change", updateSummary);
  // Recheck time on use, including pages left open across a session start.
  $(".programme-call").addEventListener("click", () => { updateSummary(); });
}
