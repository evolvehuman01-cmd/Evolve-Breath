var U = require('../utils.js');

module.exports = function(test, suite, assert) {

  /* ── addMins ─────────────────────────────────────── */
  suite('addMins', function() {
    test('adds minutes within same hour', function() {
      assert.strictEqual(U.addMins('07:00', 30), '07:30');
    });
    test('adds minutes crossing the hour', function() {
      assert.strictEqual(U.addMins('07:45', 30), '08:15');
    });
    test('midnight wraparound (forward)', function() {
      assert.strictEqual(U.addMins('23:50', 20), '00:10');
    });
    test('midnight wraparound (backward) — evening reminder calc', function() {
      assert.strictEqual(U.addMins('00:00', -15), '23:45');
    });
    test('negative offset within same hour', function() {
      assert.strictEqual(U.addMins('22:30', -15), '22:15');
    });
    test('zero offset is a no-op', function() {
      assert.strictEqual(U.addMins('12:00', 0), '12:00');
    });
    test('pads single-digit hours', function() {
      assert.strictEqual(U.addMins('00:30', 0), '00:30');
    });
    test('pads single-digit minutes', function() {
      assert.strictEqual(U.addMins('09:55', 6), '10:01');
    });
    test('standard morning reminder (+30 from 06:30)', function() {
      assert.strictEqual(U.addMins('06:30', 30), '07:00');
    });
    test('standard evening reminder (-15 from 22:30)', function() {
      assert.strictEqual(U.addMins('22:30', -15), '22:15');
    });
  });

  /* ── fmtTime ─────────────────────────────────────── */
  suite('fmtTime', function() {
    test('morning time omits :00', function() {
      assert.strictEqual(U.fmtTime('07:00'), '7 am');
    });
    test('noon is 12 pm', function() {
      assert.strictEqual(U.fmtTime('12:00'), '12 pm');
    });
    test('midnight is 12 am', function() {
      assert.strictEqual(U.fmtTime('00:00'), '12 am');
    });
    test('afternoon with minutes', function() {
      assert.strictEqual(U.fmtTime('13:30'), '1:30 pm');
    });
    test('late evening', function() {
      assert.strictEqual(U.fmtTime('23:59'), '11:59 pm');
    });
    test('noon with minutes', function() {
      assert.strictEqual(U.fmtTime('12:05'), '12:05 pm');
    });
    test('midnight with minutes', function() {
      assert.strictEqual(U.fmtTime('00:15'), '12:15 am');
    });
    test('single-digit minute padded in output', function() {
      assert.strictEqual(U.fmtTime('14:05'), '2:05 pm');
    });
    test('11:00 am', function() {
      assert.strictEqual(U.fmtTime('11:00'), '11 am');
    });
  });

  /* ── parseRounds ─────────────────────────────────── */
  suite('parseRounds', function() {
    test('plain count', function() {
      assert.strictEqual(U.parseRounds('10 rounds'), 10);
    });
    test('range — returns last (upper) number', function() {
      assert.strictEqual(U.parseRounds('7-8 rounds'), 8);
    });
    test('wide range', function() {
      assert.strictEqual(U.parseRounds('7-15 rounds'), 15);
    });
    test('large count', function() {
      assert.strictEqual(U.parseRounds('100 rounds'), 100);
    });
    test('two-digit range', function() {
      assert.strictEqual(U.parseRounds('37-38 rounds'), 38);
    });
    test('no number defaults to 10', function() {
      assert.strictEqual(U.parseRounds('no numbers here'), 10);
    });
    test('single number no label', function() {
      assert.strictEqual(U.parseRounds('5'), 5);
    });
  });

  /* ── calcStreak ──────────────────────────────────── */
  suite('calcStreak', function() {
    var REF = new Date('2024-06-15T12:00:00');   /* Saturday */
    function ts(dateStr) { return new Date(dateStr + 'T08:00:00').getTime(); }

    test('empty sessions returns 0', function() {
      assert.strictEqual(U.calcStreak([], REF), 0);
    });
    test('single session today returns 1', function() {
      assert.strictEqual(U.calcStreak([{ts:ts('2024-06-15')}], REF), 1);
    });
    test('session yesterday but not today returns 0', function() {
      assert.strictEqual(U.calcStreak([{ts:ts('2024-06-14')}], REF), 0);
    });
    test('two consecutive days ending today returns 2', function() {
      var sessions=[{ts:ts('2024-06-15')},{ts:ts('2024-06-14')}];
      assert.strictEqual(U.calcStreak(sessions, REF), 2);
    });
    test('three consecutive days ending today returns 3', function() {
      var sessions=[{ts:ts('2024-06-15')},{ts:ts('2024-06-14')},{ts:ts('2024-06-13')}];
      assert.strictEqual(U.calcStreak(sessions, REF), 3);
    });
    test('gap breaks the streak', function() {
      /* Today + 3 days ago (gap at yesterday and 2 days ago) */
      var sessions=[{ts:ts('2024-06-15')},{ts:ts('2024-06-12')}];
      assert.strictEqual(U.calcStreak(sessions, REF), 1);
    });
    test('multiple sessions on same day count as one streak day', function() {
      var sessions=[{ts:ts('2024-06-15')},{ts:ts('2024-06-15')},{ts:ts('2024-06-14')}];
      assert.strictEqual(U.calcStreak(sessions, REF), 2);
    });
  });

  /* ── friendlyAuthError ───────────────────────────── */
  suite('friendlyAuthError', function() {
    test('user not found', function() {
      assert.strictEqual(U.friendlyAuthError('auth/user-not-found'), 'No account found with that email.');
    });
    test('wrong password', function() {
      assert.strictEqual(U.friendlyAuthError('auth/wrong-password'), 'Incorrect password. Please try again.');
    });
    test('email in use', function() {
      assert.strictEqual(U.friendlyAuthError('auth/email-already-in-use'), 'An account with this email already exists.');
    });
    test('invalid credential (new Firebase SDK code)', function() {
      assert.strictEqual(U.friendlyAuthError('auth/invalid-credential'), 'Incorrect email or password.');
    });
    test('unknown code falls back to generic message', function() {
      assert.strictEqual(U.friendlyAuthError('auth/some-new-code'), 'Something went wrong. Please try again.');
    });
    test('empty string falls back to generic message', function() {
      assert.strictEqual(U.friendlyAuthError(''), 'Something went wrong. Please try again.');
    });
  });

  /* ── getSoundForPhase ────────────────────────────── */
  suite('getSoundForPhase', function() {
    test('Inhale → inhale sound', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Inhale'), {type:'inhale',freq:196});
    });
    test('Belly in → inhale (Dirga first phase)', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Belly in'), {type:'inhale',freq:196});
    });
    test('Ribs & chest → inhale (Dirga second phase)', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Ribs & chest'), {type:'inhale',freq:196});
    });
    test('Inhale & expand → inhale (Breath-Paced Mobility)', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Inhale & expand'), {type:'inhale',freq:196});
    });
    test('Inhale steps → inhale (Nasal Walking)', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Inhale steps'), {type:'inhale',freq:196});
    });
    test('Hold → hold sound', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Hold'), {type:'hold',freq:55});
    });
    test('Hum out → hum sound', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Hum out'), {type:'hum',freq:123});
    });
    test('Sigh out → hum sound (Soft Sigh Exhale)', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Sigh out'), {type:'hum',freq:123});
    });
    test('Exhale → exhale sound', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Exhale'), {type:'exhale',freq:165});
    });
    test('Exhale & return → exhale sound', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Exhale & return'), {type:'exhale',freq:165});
    });
    test('Exhale steps → exhale sound', function() {
      assert.deepStrictEqual(U.getSoundForPhase('Exhale steps'), {type:'exhale',freq:165});
    });
    test('case-insensitive matching', function() {
      assert.deepStrictEqual(U.getSoundForPhase('INHALE'), {type:'inhale',freq:196});
    });
  });

  /* ── shouldFireReminder ──────────────────────────── */
  suite('shouldFireReminder', function() {
    test('fires when time matches and not yet fired today', function() {
      assert.strictEqual(U.shouldFireReminder('07:30', '07:30', false), true);
    });
    test('does not fire when time does not match', function() {
      assert.strictEqual(U.shouldFireReminder('07:30', '07:31', false), false);
    });
    test('does not fire when already fired today', function() {
      assert.strictEqual(U.shouldFireReminder('07:30', '07:30', true), false);
    });
    test('does not fire when reminder is null/not set', function() {
      assert.strictEqual(U.shouldFireReminder(null, '07:30', false), false);
    });
    test('does not fire when reminder is empty string', function() {
      assert.strictEqual(U.shouldFireReminder('', '07:30', false), false);
    });
  });

  /* ── formatHHMM ──────────────────────────────────── */
  suite('formatHHMM', function() {
    test('pads hours and minutes below 10', function() {
      assert.strictEqual(U.formatHHMM(new Date('2024-01-01T07:05:00')), '07:05');
    });
    test('midnight', function() {
      assert.strictEqual(U.formatHHMM(new Date('2024-01-01T00:00:00')), '00:00');
    });
    test('noon', function() {
      assert.strictEqual(U.formatHHMM(new Date('2024-01-01T12:00:00')), '12:00');
    });
    test('late evening', function() {
      assert.strictEqual(U.formatHHMM(new Date('2024-01-01T23:59:00')), '23:59');
    });
  });

  /* ── makeCrumbs ──────────────────────────────────── */
  suite('makeCrumbs', function() {
    test('last item gets active class', function() {
      var html = U.makeCrumbs(['flare']);
      assert.ok(html.indexOf('crumb active') >= 0, 'last item should have active class');
    });
    test('energy levels are mapped to labels', function() {
      var html = U.makeCrumbs(['flare']);
      assert.ok(html.indexOf('Flare Day') >= 0);
    });
    test('separator dot between items', function() {
      var html = U.makeCrumbs(['flare', 'Calm Down']);
      assert.ok(html.indexOf('crumb-dot') >= 0);
    });
    test('passthrough for non-energy strings', function() {
      var html = U.makeCrumbs(['good', 'My Goal']);
      assert.ok(html.indexOf('My Goal') >= 0);
    });
    test('only last item is active in multi-item list', function() {
      var html = U.makeCrumbs(['flare', 'Calm Down', '1 minute']);
      var activeCount = (html.match(/crumb active/g) || []).length;
      assert.strictEqual(activeCount, 1);
    });
  });

  /* ── dotHTML ─────────────────────────────────────── */
  suite('dotHTML', function() {
    test('includes energy class', function() {
      var html = U.dotHTML('flare', 'Flare Day');
      assert.ok(html.indexOf('flare') >= 0);
    });
    test('includes title attribute', function() {
      var html = U.dotHTML('good', 'Box Breathing');
      assert.ok(html.indexOf('title="Box Breathing"') >= 0);
    });
    test('wraps in chart-dot div', function() {
      var html = U.dotHTML('moderate', 'test');
      assert.ok(html.indexOf('chart-dot') >= 0);
    });
  });

  /* ── buildSummary ────────────────────────────────── */
  suite('buildSummary', function() {
    test('empty sessions returns empty string', function() {
      assert.strictEqual(U.buildSummary([], 'This week'), '');
    });
    test('total count is present', function() {
      var sessions = [{energy:'flare'},{energy:'good'}];
      var html = U.buildSummary(sessions, 'Test');
      assert.ok(html.indexOf('>2<') >= 0, 'should show total count of 2');
    });
    test('energy breakdown counts are correct', function() {
      var sessions = [{energy:'flare'},{energy:'flare'},{energy:'good'}];
      var html = U.buildSummary(sessions, 'Test');
      /* Flare count = 2 */
      assert.ok(html.indexOf('color:'+U.ENERGY_COLOUR.flare+'">2<') >= 0);
      /* Good count = 1 */
      assert.ok(html.indexOf('color:'+U.ENERGY_COLOUR.good+'">1<') >= 0);
    });
    test('label parameter appears in output', function() {
      var html = U.buildSummary([{energy:'moderate'}], 'June');
      assert.ok(html.indexOf('June') >= 0);
    });
    test('defaults label to Sessions when omitted', function() {
      var html = U.buildSummary([{energy:'good'}]);
      assert.ok(html.indexOf('Sessions') >= 0);
    });
  });

};
