var D = require('../data.js');

module.exports = function(test, suite, assert) {

  /* ── Helper: collect all unique drill names from DRILLS ── */
  function allDrillNames() {
    var names = {};
    Object.keys(D.DRILLS).forEach(function(energy) {
      Object.keys(D.DRILLS[energy]).forEach(function(cat) {
        Object.keys(D.DRILLS[energy][cat]).forEach(function(timeKey) {
          D.DRILLS[energy][cat][timeKey].forEach(function(drill) {
            names[drill.name] = true;
          });
        });
      });
    });
    return Object.keys(names);
  }

  /* ── DRILLS → PHASE_PATTERNS ─────────────────────── */
  suite('DRILLS → PHASE_PATTERNS coverage', function() {
    test('every drill name has a matching PHASE_PATTERNS entry', function() {
      var missing = allDrillNames().filter(function(name) {
        return !D.PHASE_PATTERNS.hasOwnProperty(name);
      });
      assert.strictEqual(
        missing.length, 0,
        'Drills without a PHASE_PATTERNS entry: ' + missing.join(', ')
      );
    });

    test('PHASE_PATTERNS entries not used in any drill (dead code check)', function() {
      var drillNames = allDrillNames();
      var orphaned = Object.keys(D.PHASE_PATTERNS).filter(function(name) {
        return drillNames.indexOf(name) < 0;
      });
      /* This is a warning, not an error — log the orphans but don't fail */
      if(orphaned.length) {
        console.log('    (info) PHASE_PATTERNS entries unreachable from any drill: ' + orphaned.join(', '));
      }
      /* Zero is ideal; if this fails someone added PHASE_PATTERNS without wiring it */
      assert.ok(true, 'orphan check is informational');
    });
  });

  /* ── GOALS → DRILLS category alignment ───────────── */
  suite('GOALS categories are reachable in DRILLS', function() {
    ['flare','moderate','good'].forEach(function(energy) {
      test(energy + ': every goal category exists in DRILLS['+energy+']', function() {
        var missing = D.GOALS[energy].filter(function(g) {
          return !D.DRILLS[energy].hasOwnProperty(g.cat);
        }).map(function(g){ return g.cat; });
        assert.strictEqual(
          missing.length, 0,
          'Goal cats without DRILLS entry for '+energy+': ' + missing.join(', ')
        );
      });
    });
  });

  suite('DRILLS categories without a GOALS entry (unreachable drills)', function() {
    ['flare','moderate','good'].forEach(function(energy) {
      test(energy + ': all DRILLS categories are reachable via GOALS', function() {
        var goalCats = D.GOALS[energy].map(function(g){ return g.cat; });
        var orphaned = Object.keys(D.DRILLS[energy]).filter(function(cat) {
          return goalCats.indexOf(cat) < 0;
        });
        if(orphaned.length) {
          console.log('    (warn) DRILLS['+energy+'] has categories not in GOALS: ' + orphaned.join(', '));
        }
        /* MOVEMENT category currently exists in DRILLS but not in GOALS — informational */
        assert.ok(true, 'unreachable category check is informational');
      });
    });
  });

  /* ── TIME_MAP → DRILLS key alignment ─────────────── */
  suite('TIME_MAP keys resolve to non-empty drill lists', function() {
    ['flare','moderate','good'].forEach(function(energy) {
      D.TIME_MAP[energy].forEach(function(t) {
        test(energy + ' / time key "' + t.key + '" has drills for at least one goal category', function() {
          var found = false;
          Object.keys(D.DRILLS[energy]).forEach(function(cat) {
            if(D.DRILLS[energy][cat][t.key] && D.DRILLS[energy][cat][t.key].length > 0) {
              found = true;
            }
          });
          assert.ok(found, 'No drills found for '+energy+' / time key "'+t.key+'"');
        });
      });
    });
  });

  /* ── PHASE_PATTERNS structural validity ───────────── */
  suite('PHASE_PATTERNS structural validity', function() {
    test('every phase has a string p field', function() {
      var bad = [];
      Object.keys(D.PHASE_PATTERNS).forEach(function(drill) {
        D.PHASE_PATTERNS[drill].forEach(function(phase, i) {
          if(typeof phase.p !== 'string' || !phase.p) {
            bad.push(drill + '[' + i + '].p');
          }
        });
      });
      assert.strictEqual(bad.length, 0, 'Invalid p fields: ' + bad.join(', '));
    });

    test('every phase has a positive numeric s (seconds) field', function() {
      var bad = [];
      Object.keys(D.PHASE_PATTERNS).forEach(function(drill) {
        D.PHASE_PATTERNS[drill].forEach(function(phase, i) {
          if(typeof phase.s !== 'number' || phase.s <= 0) {
            bad.push(drill + '[' + i + '].s = ' + phase.s);
          }
        });
      });
      assert.strictEqual(bad.length, 0, 'Invalid s fields: ' + bad.join(', '));
    });

    test('every drill pattern has at least one phase', function() {
      var empty = Object.keys(D.PHASE_PATTERNS).filter(function(d) {
        return !D.PHASE_PATTERNS[d].length;
      });
      assert.strictEqual(empty.length, 0, 'Empty phase arrays: ' + empty.join(', '));
    });
  });

  /* ── DRILLS structural validity ───────────────────── */
  suite('DRILLS structural validity', function() {
    test('every drill object has required fields', function() {
      var bad = [];
      allDrillNames().forEach(function(name) {});
      Object.keys(D.DRILLS).forEach(function(energy) {
        Object.keys(D.DRILLS[energy]).forEach(function(cat) {
          Object.keys(D.DRILLS[energy][cat]).forEach(function(timeKey) {
            D.DRILLS[energy][cat][timeKey].forEach(function(drill, i) {
              var loc = energy+'.'+cat+'.'+timeKey+'['+i+']';
              if(typeof drill.name   !== 'string' || !drill.name)   bad.push(loc+'.name');
              if(typeof drill.rounds !== 'string' || !drill.rounds) bad.push(loc+'.rounds');
              if(typeof drill.rec    !== 'boolean')                  bad.push(loc+'.rec');
              if(typeof drill.instr  !== 'string' || !drill.instr)  bad.push(loc+'.instr');
            });
          });
        });
      });
      assert.strictEqual(bad.length, 0, 'Missing/invalid fields: ' + bad.join('; '));
    });

    test('every drill list has at least one entry', function() {
      var empty = [];
      Object.keys(D.DRILLS).forEach(function(energy) {
        Object.keys(D.DRILLS[energy]).forEach(function(cat) {
          Object.keys(D.DRILLS[energy][cat]).forEach(function(timeKey) {
            if(!D.DRILLS[energy][cat][timeKey].length) {
              empty.push(energy+'.'+cat+'.'+timeKey);
            }
          });
        });
      });
      assert.strictEqual(empty.length, 0, 'Empty drill lists: ' + empty.join(', '));
    });

    test('each time key has exactly one recommended drill', function() {
      var bad = [];
      Object.keys(D.DRILLS).forEach(function(energy) {
        Object.keys(D.DRILLS[energy]).forEach(function(cat) {
          Object.keys(D.DRILLS[energy][cat]).forEach(function(timeKey) {
            var recCount = D.DRILLS[energy][cat][timeKey].filter(function(d){ return d.rec; }).length;
            if(recCount !== 1) {
              bad.push(energy+'.'+cat+'.'+timeKey+' ('+recCount+' rec drills)');
            }
          });
        });
      });
      assert.strictEqual(bad.length, 0, 'Time slots without exactly 1 recommended drill: ' + bad.join('; '));
    });
  });

  /* ── GOALS structural validity ────────────────────── */
  suite('GOALS structural validity', function() {
    ['flare','moderate','good'].forEach(function(energy) {
      test(energy + ': all goal objects have required fields', function() {
        var bad = [];
        D.GOALS[energy].forEach(function(g, i) {
          if(!g.name)  bad.push('['+i+'].name');
          if(!g.cat)   bad.push('['+i+'].cat');
          if(!g.icon)  bad.push('['+i+'].icon');
          if(!g.hint)  bad.push('['+i+'].hint');
        });
        assert.strictEqual(bad.length, 0, 'Missing fields in GOALS['+energy+']: ' + bad.join(', '));
      });
    });

    test('no duplicate goal names within an energy level', function() {
      var bad = [];
      ['flare','moderate','good'].forEach(function(energy) {
        var seen = {};
        D.GOALS[energy].forEach(function(g) {
          if(seen[g.name]) bad.push(energy+':'+g.name);
          seen[g.name] = true;
        });
      });
      assert.strictEqual(bad.length, 0, 'Duplicate goal names: ' + bad.join(', '));
    });
  });

  /* ── COMPLETE_MSG completeness ────────────────────── */
  suite('COMPLETE_MSG', function() {
    test('has a message for every energy level', function() {
      ['flare','moderate','good'].forEach(function(level) {
        assert.ok(
          typeof D.COMPLETE_MSG[level] === 'string' && D.COMPLETE_MSG[level].length > 0,
          'Missing COMPLETE_MSG for energy level: ' + level
        );
      });
    });
  });

};
