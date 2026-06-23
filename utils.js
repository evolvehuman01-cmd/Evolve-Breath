var ENERGY_LABEL={flare:'Flare Day',moderate:'Moderate Day',good:'Good Day'};
var ENERGY_COLOUR={flare:'#FF8A80',moderate:'#FFD180',good:'#A5D6A7'};
var DAY_SHORT=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var MONTH_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function addMins(hhmm,mins){
  var p=hhmm.split(':'),t=parseInt(p[0])*60+parseInt(p[1])+mins;
  t=((t%1440)+1440)%1440;
  var h=Math.floor(t/60),m=t%60;
  return(h<10?'0':'')+h+':'+(m<10?'0':'')+m;
}

function fmtTime(hhmm){
  var p=hhmm.split(':'),h=parseInt(p[0]),m=parseInt(p[1]),ap=h>=12?'pm':'am';
  h=h%12||12;
  return h+(m?':'+(m<10?'0':'')+m:'')+' '+ap;
}

function parseRounds(str){var n=str.match(/\d+/g);return n?parseInt(n[n.length-1]):10}

/* Formats a Date object as HH:MM string. Used in checkReminders. */
function formatHHMM(date){
  var h=date.getHours(),m=date.getMinutes();
  return(h<10?'0':'')+h+':'+(m<10?'0':'')+m;
}

/* Pure predicate: should a reminder fire right now? */
function shouldFireReminder(reminderHHMM,currentHHMM,alreadyFiredToday){
  return !!(reminderHHMM&&currentHHMM===reminderHHMM&&!alreadyFiredToday);
}

/* Accepts an optional refDate (Date or timestamp) for deterministic testing. */
function calcStreak(sessions,refDate){
  if(!sessions.length)return 0;
  var days=new Set(sessions.map(function(s){
    return new Date(s.ts).toDateString();
  }));
  var streak=0,d=refDate?new Date(refDate):new Date();
  d.setHours(0,0,0,0);
  while(days.has(d.toDateString())){
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

function friendlyAuthError(code){
  var map={
    'auth/user-not-found':'No account found with that email.',
    'auth/wrong-password':'Incorrect password. Please try again.',
    'auth/email-already-in-use':'An account with this email already exists.',
    'auth/invalid-email':'Please enter a valid email address.',
    'auth/weak-password':'Password must be at least 6 characters.',
    'auth/popup-closed-by-user':'Sign-in cancelled.',
    'auth/network-request-failed':'Network error. Please check your connection.',
    'auth/invalid-credential':'Incorrect email or password.'
  };
  return map[code]||'Something went wrong. Please try again.';
}

function getSoundForPhase(label){
  var l=label.toLowerCase();
  if(l.indexOf('inhale')>=0||l.indexOf('belly')>=0||l.indexOf('ribs')>=0||l.indexOf('expand')>=0)
    return{type:'inhale',freq:196};
  if(l.indexOf('hold')>=0)
    return{type:'hold',freq:55};
  if(l.indexOf('hum')>=0||l.indexOf('sigh')>=0)
    return{type:'hum',freq:123};
  return{type:'exhale',freq:165};
}

function makeCrumbs(items){var labels={flare:'🔴 Flare Day',moderate:'🟠 Moderate Day',good:'🟢 Good Day'};return items.map(function(x,i){var label=labels[x]||x,active=i===items.length-1?' active':'',sep=i<items.length-1?'<span class="crumb-dot"></span>':'';return'<span class="crumb'+active+'">'+label+'</span>'+sep}).join('')}

function dotHTML(energy,title){
  return'<div class="chart-dot '+energy+'" title="'+title+'"></div>';
}

function buildSummary(sessions,label){
  if(!sessions.length)return'';
  var c={flare:0,moderate:0,good:0};
  sessions.forEach(function(s){if(c[s.energy]!==undefined)c[s.energy]++});
  return'<div class="summary-card"><div class="summary-num">'+sessions.length+'</div><div class="summary-label">'+(label||'Sessions')+'</div></div>'
    +'<div class="summary-card"><div class="summary-num" style="color:'+ENERGY_COLOUR.flare+'">'+c.flare+'</div><div class="summary-label"><span class="summary-dot flare-dot"></span>Flare</div></div>'
    +'<div class="summary-card"><div class="summary-num" style="color:'+ENERGY_COLOUR.moderate+'">'+c.moderate+'</div><div class="summary-label"><span class="summary-dot moderate-dot"></span>Moderate</div></div>'
    +'<div class="summary-card"><div class="summary-num" style="color:'+ENERGY_COLOUR.good+'">'+c.good+'</div><div class="summary-label"><span class="summary-dot good-dot"></span>Good</div></div>';
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ENERGY_LABEL: ENERGY_LABEL,
    ENERGY_COLOUR: ENERGY_COLOUR,
    DAY_SHORT: DAY_SHORT,
    MONTH_SHORT: MONTH_SHORT,
    addMins: addMins,
    fmtTime: fmtTime,
    parseRounds: parseRounds,
    formatHHMM: formatHHMM,
    shouldFireReminder: shouldFireReminder,
    calcStreak: calcStreak,
    friendlyAuthError: friendlyAuthError,
    getSoundForPhase: getSoundForPhase,
    makeCrumbs: makeCrumbs,
    dotHTML: dotHTML,
    buildSummary: buildSummary
  };
}
