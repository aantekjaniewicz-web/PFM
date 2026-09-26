const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../game.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function game() {
    const elements = new Map();
    const context = vm.createContext({ console, setTimeout: () => {}, document: {
        addEventListener() {},
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, { style: {}, innerHTML: '' });
            return elements.get(id);
        }
    }});
    context.window = context;
    vm.runInContext(source, context);
    return { context, run: code => vm.runInContext(code, context), elements };
}
function seasonGame(position) {
    const instance = game();
    instance.run(`
        G.myTier = 2; G.myClub = 'T2C${position}'; G.canBeFired = false;
        G.currentTarget = ''; G.leagueData = {}; G.playersDatabase = {};
        for (let t = 1; t <= 9; t++) {
            clubs[t] = []; G.leagueData[t] = {};
            for (let p = 1; p <= 10; p++) {
                let name = 'T' + t + 'C' + p;
                clubs[t].push(name);
                G.leagueData[t][name] = { pts: 100 - p, gs: 20, gt: 10 };
                G.playersDatabase[name] = [];
            }
        }
        awardClubPrizeMoney = (club, amount, reason) => { window.prizeReason = reason; };
        calculateLeagueEndOfSeasonPrize = (tier, pos) => { window.prizePosition = pos; return 100; };
        appendLog = () => {}; addMail = () => {};
        relegationSquadSelloff = () => {}; evolveAllClubsSeason = () => {};
        runGoldenEagleGala = () => {};
        resolveEuropeanAccess = standings => { window.europeStandings = standings; return {}; };
    `);
    return instance;
}
for (const [position, tier] of [[1, 1], [5, 2], [10, 3]]) {
    test(`koniec sezonu: pozycja ${position}, docelowa liga ${tier}`, () => {
        const { run, elements } = seasonGame(position);
        run('endSeason()');
        assert.equal(run('G.myTier'), tier);
        assert.equal(run('prizePosition'), position);
        assert.equal(run('clubs[G.myTier].includes(G.myClub)'), true);
        assert.match(elements.get('board-content').innerHTML, new RegExp(`Pozycja: ${position} w Betclic 1`));
        assert.equal(run('europeStandings.length'), 10);
        assert.equal(run('europeStandings.every(c => c.startsWith("T1"))'), true);
    });
}
test('zapis po spadku odtwarza ligi w nowej instancji gry', () => {
    const first = seasonGame(10);
    first.run('endSeason()');
    const serialized = first.run('JSON.stringify(prepareSavePayload(G))');
    const second = game();
    second.context.serialized = serialized;
    second.run('restoreCareerState(JSON.parse(serialized))');
    assert.equal(second.run('G.myTier'), 3);
    assert.equal(second.run('clubs[3].includes(G.myClub)'), true);
    assert.equal(second.run('clubs[2].includes(G.myClub)'), false);
    assert.equal(second.run('JSON.stringify(clubs)'), first.run('JSON.stringify(clubs)'));
});
test('stary zapis odtwarza przynależność z tabel ligowych', () => {
    const first = seasonGame(1);
    first.run('endSeason()');
    const second = game();
    second.context.serialized = first.run('JSON.stringify(G)');
    second.run('restoreCareerState(JSON.parse(serialized))');
    assert.equal(second.run('clubs[1].includes(G.myClub)'), true);
    assert.equal(second.run('clubs[2].includes(G.myClub)'), false);
});
test('błędny zapis nie zmienia bieżącej kariery ani lig', () => {
    const { run, context } = seasonGame(5);
    const before = run('JSON.stringify({G, clubs})');
    for (const value of [null, {}, {myClub: 'x'}, {saveVersion: 999, myClub: 'x'}]) {
        context.bad = value;
        assert.throws(() => run('restoreCareerState(bad)'), /zapis|Zapis/);
        assert.equal(run('JSON.stringify({G, clubs})'), before);
    }
});

test('niespójna przynależność i brak kadry są odrzucane przed zmianą stanu', () => {
    const { run } = seasonGame(5);
    const before = run('JSON.stringify({G, clubs})');
    for (const change of [
        'bad.clubsByTier[2].push(bad.clubsByTier[1][0])',
        'bad.myTier = 1',
        'delete bad.playersDatabase[bad.myClub]',
        'bad.leagueData[2][bad.myClub].pts = "oops"'
    ]) {
        run('var bad = prepareSavePayload(G); ' + change);
        assert.throws(() => run('restoreCareerState(bad)'));
        assert.equal(run('JSON.stringify({G, clubs})'), before);
    }
});

test('eksport nie modyfikuje kariery, a następny sezon używa odtworzonych lig', () => {
    const { run } = seasonGame(10);
    run('endSeason()');
    const before = run('JSON.stringify(G)');
    run('var payload = prepareSavePayload(G)');
    assert.equal(run('JSON.stringify(G)'), before);
    run('restoreCareerState(payload); initLeagueData()');
    assert.equal(run('Object.hasOwn(G.leagueData[3], G.myClub)'), true);
    assert.equal(run('Object.hasOwn(G.leagueData[2], G.myClub)'), false);
});

test('IndexedDB potwierdza zapis dopiero po zatwierdzeniu transakcji', async () => {
    const { context, run } = game();
    const request = {};
    const transaction = { objectStore: () => ({ put: () => request }) };
    let closed = false;
    context.fakeDb = { transaction: () => transaction, close: () => { closed = true; } };
    run('openSaveDatabase = () => Promise.resolve(fakeDb)');
    let saved = false;
    const pending = run('idbSaveData("test", {})').then(() => { saved = true; });
    await Promise.resolve();
    if (request.onsuccess) request.onsuccess();
    await Promise.resolve();
    assert.equal(saved, false);
    transaction.oncomplete();
    await pending;
    assert.equal(saved, true);
    assert.equal(closed, true);
});
