const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ Intl, Date });
vm.runInContext(readFileSync(require('node:path').join(__dirname, '../programmes.js'), 'utf8') + '\nthis.programmes = scheduledProgrammes;', context);
const [memories, travel] = context.programmes;
test('preserves all 15 advertised sessions, official venues and phone numbers', () => {
 assert.equal(JSON.stringify(memories.sessions), JSON.stringify(['2026-11-12','2026-11-19','2026-11-26','2026-12-10','2026-12-17','2026-12-23','2026-12-30','2027-01-06']));
 assert.equal(JSON.stringify(travel.sessions), JSON.stringify(['2026-11-30','2026-12-02','2026-12-03','2026-12-07','2026-12-09','2026-12-10','2027-01-06']));
 assert.equal(memories.venue.street, '230A Bukit Batok Street 21'); assert.equal(memories.venue.unit, '#02-423'); assert.equal(memories.venue.postal, '651230'); assert.equal(memories.contact.telephone, '+6586870039');
 assert.equal(travel.venue.street, '212 Bukit Batok Street 21'); assert.equal(travel.venue.unit, '#01-237'); assert.equal(travel.venue.postal, '650212'); assert.equal(travel.contact.telephone, '+6563472801');
 for (const programme of context.programmes) { assert.equal(context.programmeTime(programme), '1:30 PM to 3:30 PM'); assert.equal(programme.capacityDyads, 4); assert.equal(programme.fee, 0); }
});
test('uses Singapore dates at midnight and stops registration at the session start', () => {
 assert.equal(context.singaporeToday(new Date('2026-11-11T16:01:00Z')), '2026-11-12');
 assert.equal(context.sessionUnavailable(memories, '2026-11-12', new Date('2026-11-12T05:29:59Z')), false);
 assert.equal(context.sessionUnavailable(memories, '2026-11-12', new Date('2026-11-12T05:30:00Z')), true);
 assert.equal(context.sessionUnavailable(memories, '2026-11-12', new Date('2027-02-01T00:00:00Z')), true);
 assert.equal(memories.sessions.length, 8);
 for(const date of ['2026-12-23','2026-12-30','2027-01-06']) assert.match(context.programmeDate(date, true), /Wed/);
});
