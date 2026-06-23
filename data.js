var GOALS={
  flare:[
    {name:'Calm Down',hint:'Reduce stress',icon:'🌊',cat:'DOWN_REGULATION'},
    {name:'Clear Mind',hint:'Reduce overwhelm',icon:'🌫️',cat:'COGNITIVE_CALMING'},
    {name:'Quick Rebalance',hint:'Brief rebalance',icon:'↩️',cat:'QUICK_RESET'},
    {name:'Sleep / Wind-Down',hint:'Rest preparation',icon:'🌙',cat:'SLEEP',full:true},
    {name:'Pre-Exercise',hint:'Gentle activation prep',icon:'🔆',cat:'PRE_EXERCISE',full:true},
    {name:'Post-Exercise',hint:'Recovery & calm down',icon:'🔅',cat:'POST_EXERCISE',full:true}
  ],
  moderate:[
    {name:'Down-Regulation',hint:'Nervous system calm',icon:'🌊',cat:'DOWN_REGULATION'},
    {name:'Cognitive Calming',hint:'Mental quiet',icon:'🌫️',cat:'COGNITIVE_CALMING'},
    {name:'Quick Rebalance',hint:'Brief rebalance',icon:'↩️',cat:'QUICK_RESET'},
    {name:'Sleep / Wind-Down',hint:'Rest preparation',icon:'🌙',cat:'SLEEP',full:true},
    {name:'Pre-Exercise',hint:'Activate & prepare',icon:'🔆',cat:'PRE_EXERCISE',full:true},
    {name:'Post-Exercise',hint:'Recovery & calm down',icon:'🔅',cat:'POST_EXERCISE',full:true}
  ],
  good:[
    {name:'Down-Regulation',hint:'Nervous system calm',icon:'🌊',cat:'DOWN_REGULATION'},
    {name:'Cognitive Focus',hint:'Mental clarity',icon:'🔷',cat:'COGNITIVE_FOCUS'},
    {name:'Quick Rebalance',hint:'Brief rebalance',icon:'↩️',cat:'QUICK_RESET'},
    {name:'Sleep / Wind-Down',hint:'Rest preparation',icon:'🌙',cat:'SLEEP',full:true},
    {name:'Pre-Exercise',hint:'Prime & activate',icon:'🔆',cat:'PRE_EXERCISE',full:true},
    {name:'Post-Exercise',hint:'Recovery & calm down',icon:'🔅',cat:'POST_EXERCISE',full:true}
  ]
};

var DRILLS={
  flare:{
    DOWN_REGULATION:{
      '1':[
        {name:'Soft Sigh Exhale',rounds:'10 rounds',rec:true, instr:'Gentle nasal inhale, then release a soft audible sigh through the mouth. Let the exhale do the work. Soften jaw and shoulders with each breath.'},
        {name:'3/5 Downshift',   rounds:'7-8 rounds',rec:false,instr:'Inhale softly for 3 counts. Exhale slowly for 5 counts through pursed lips. The longer exhale signals safety to your nervous system.'}
      ],
      '2':[
        {name:'Soft Sigh Exhale',rounds:'20 rounds',rec:true, instr:'Gentle nasal inhale, then release a soft audible sigh through the mouth. Let the exhale do the work. Soften jaw and shoulders with each breath.'},
        {name:'3/5 Downshift',   rounds:'15 rounds',rec:false,instr:'Inhale softly for 3 counts. Exhale slowly for 5 counts through pursed lips. The longer exhale signals safety to your nervous system.'}
      ]
    },
    COGNITIVE_CALMING:{
      '1':[
        {name:'Normalise Breath',rounds:'12 rounds',rec:true, instr:'Simply observe your natural breathing without changing it. Notice the rise and fall. If the breath wants to slow, allow it.'},
        {name:'Micro-Holds',     rounds:'10 rounds',rec:false,instr:'Inhale gently, pause 1-2 seconds at the top, then exhale slowly. The tiny pause creates calm without demanding effort.'}
      ],
      '2':[
        {name:'Normalise Breath',rounds:'24 rounds',rec:true, instr:'Simply observe your natural breathing without changing it. Notice the rise and fall. If the breath wants to slow, allow it.'},
        {name:'Micro-Holds',     rounds:'20 rounds',rec:false,instr:'Inhale gently, pause 1-2 seconds at the top, then exhale slowly. The tiny pause creates calm without demanding effort.'}
      ]
    },
    QUICK_RESET:{
      '1':[
        {name:'3-3-6 Reset',     rounds:'5 rounds',rec:true, instr:'Inhale for 3 counts. Hold for 3 counts. Exhale for 6 counts. Activates the parasympathetic response within seconds.'},
        {name:'One-Minute Calm', rounds:'6 rounds',rec:false,instr:'Breathe in slowly for 4 counts, breathe out for 6 counts. Focus only on the exhale lengthening.'}
      ],
      '2':[
        {name:'3-3-6 Reset',     rounds:'10 rounds',rec:true, instr:'Inhale for 3 counts. Hold for 3 counts. Exhale for 6 counts. Activates the parasympathetic response within seconds.'},
        {name:'One-Minute Calm', rounds:'12 rounds',rec:false,instr:'Breathe in slowly for 4 counts, breathe out for 6 counts. Focus only on the exhale lengthening.'}
      ]
    },
    SLEEP:{
      '1':[
        {name:'Humming + Scan',  rounds:'7-8 rounds',rec:true, instr:'Inhale through the nose, exhale with a soft hum. Slowly scan from head to feet releasing tension. Humming calms the vagal nerve.'},
        {name:'3/5 Downshift',   rounds:'7-8 rounds',rec:false,instr:'Inhale 3 counts, exhale 5 counts. The extended exhale activates the rest response, preparing the body for sleep.'}
      ],
      '2':[
        {name:'Humming + Scan',  rounds:'15 rounds',rec:true, instr:'Inhale through the nose, exhale with a soft hum. Slowly scan from head to feet releasing tension. Humming calms the vagal nerve.'},
        {name:'One-Minute Calm', rounds:'12 rounds',rec:false,instr:'Inhale 4, exhale 6. Gentle extended exhale cues the nervous system toward rest.'}
      ]
    },
    PRE_EXERCISE:{
      '1':[
        {name:'Exhale on Effort', rounds:'10 rounds',rec:true, instr:'Synchronise your exhale with movement or effort. Inhale to prepare, exhale as you move. Primes the system gently before activity.'},
        {name:'3-3-6 Reset',      rounds:'5 rounds', rec:false,instr:'Inhale 3, hold 3, exhale 6. A brief reset to clear mental fog and prepare the nervous system before gentle movement.'}
      ],
      '2':[
        {name:'Exhale on Effort', rounds:'20 rounds',rec:true, instr:'Synchronise your exhale with movement or effort. Inhale to prepare, exhale as you move. Primes the system gently before activity.'},
        {name:'Normalise Breath', rounds:'24 rounds',rec:false,instr:'Observe natural breathing for 2 minutes to establish a calm baseline before movement begins.'}
      ]
    },
    POST_EXERCISE:{
      '1':[
        {name:'Soft Sigh Exhale', rounds:'10 rounds',rec:true, instr:'Nasal inhale, soft mouth sigh on the exhale. Signals the nervous system to shift out of effort mode. Use immediately after movement.'},
        {name:'3/5 Downshift',    rounds:'7-8 rounds',rec:false,instr:'Inhale 3, exhale 5. Quickly downregulates the activation from exercise without shocking the system.'}
      ],
      '2':[
        {name:'Soft Sigh Exhale', rounds:'20 rounds',rec:true, instr:'Nasal inhale, soft mouth sigh on the exhale. Signals the nervous system to shift out of effort mode. Use immediately after movement.'},
        {name:'Humming + Scan',   rounds:'15 rounds',rec:false,instr:'Inhale through nose, hum on exhale. Scan for areas of tension from the activity. Deeply restorative post-movement.'}
      ]
    }
  },
  moderate:{
    DOWN_REGULATION:{
      '1-2':[
        {name:'Soft Sigh Exhale', rounds:'10-20 rounds',rec:true, instr:'Gentle nasal inhale, then soft audible sigh on the exhale. Let the exhale do all the work.'},
        {name:'3/5 Downshift',    rounds:'7-15 rounds', rec:false,instr:'Inhale 3 counts through the nose. Exhale 5 counts through pursed lips. Longer exhale activates rest response.'}
      ],
      '5':[
        {name:'Humming Breath',    rounds:'37 rounds',rec:true, instr:'Nasal inhale, then exhale with a steady hum for as long as comfortable. Stimulates the vagus nerve directly.'},
        {name:'Diaphragmatic 4/6', rounds:'30 rounds',rec:false,instr:'Hand on belly. Inhale 4 counts, belly rises. Exhale 6 counts, belly falls. Only belly movement.'}
      ],
      '10':[
        {name:'Diaphragmatic 4/6', rounds:'60 rounds',rec:true, instr:'Hand on belly. Inhale 4 counts, belly rises. Exhale 6 counts, belly falls. Pure diaphragmatic breathing for sustained regulation.'},
        {name:'Humming Breath',    rounds:'55 rounds',rec:false,instr:'Sustained nasal inhale and long hum exhale for 10 minutes. Deeply regulating for the nervous system.'}
      ]
    },
    COGNITIVE_CALMING:{
      '1-2':[
        {name:'Normalise Breath', rounds:'12-24 rounds',rec:true, instr:'Observe your breath without changing it. Count: in 2, out 2. Stay curious rather than controlling.'},
        {name:'Micro-Holds',      rounds:'10-20 rounds',rec:false,instr:'Inhale gently, 1-2 second pause at top, exhale slowly. The pause interrupts rumination.'}
      ],
      '5':[
        {name:'Box Breathing',    rounds:'19 rounds',rec:true, instr:'Inhale 4. Hold 4. Exhale 4. Hold 4. Classic nervous system reset. Equal sides promote mental balance.'},
        {name:'Normalise Breath', rounds:'60 rounds',rec:false,instr:'Extended mindful breathing observation — simply watch the breath without intervention for 5 minutes.'}
      ],
      '10':[
        {name:'Extended Box',     rounds:'37-38 rounds',rec:true, instr:'Inhale 4. Hold 4. Exhale 4. Hold 4. Extend to 6 counts per phase when comfortable.'},
        {name:'Box Breathing',    rounds:'38 rounds',  rec:false,instr:'Sustained 4-4-4-4 box breathing for 10 minutes. Promotes deep cognitive calm and mental clarity.'}
      ]
    },
    QUICK_RESET:{
      '1-2':[
        {name:'3-3-6 Reset',     rounds:'5-10 rounds',rec:true, instr:'Inhale 3. Hold 3. Exhale 6. Quick to do, powerful in effect.'},
        {name:'4-Breath Box',    rounds:'7-15 rounds',rec:false,instr:'Inhale 4. Hold 4. Exhale 4. Hold 4. Brief box to restore clarity.'},
        {name:'One-Minute Calm', rounds:'6-12 rounds',rec:false,instr:'Inhale 4, exhale 6. Repeat gently. The extended exhale pulls you into calm.'}
      ]
    },
    SLEEP:{
      '1-2':[
        {name:'Humming + Scan',      rounds:'7-15 rounds',rec:true, instr:'Inhale through nose, hum on exhale. Scan from crown to toes. Release each area as you pass through.'},
        {name:'3/5 Downshift',       rounds:'7-15 rounds',rec:false,instr:'Inhale 3, exhale 5. Steady extended exhale cues the nervous system toward sleep.'}
      ],
      '5':[
        {name:'Dirga',               rounds:'30 rounds',rec:true, instr:'Three-part breath: belly first, then ribcage, then chest. Exhale in reverse. Slow, full, and deeply restorative.'},
        {name:'Extended Exhale 4/8', rounds:'25 rounds',rec:false,instr:'Inhale 4 counts. Exhale 8 counts. The 1:2 ratio prepares the nervous system for sleep onset.'}
      ],
      '10':[
        {name:'Extended Exhale 4/8', rounds:'50 rounds',rec:true, instr:'Inhale 4 counts. Exhale 8 counts. The 1:2 ratio is one of the most effective patterns for sleep onset.'},
        {name:'Dirga',               rounds:'60 rounds',rec:false,instr:'Three-part belly-rib-chest inhale, reverse exhale for 10 minutes. Deeply nourishing pre-sleep practice.'}
      ]
    },
    MOVEMENT:{
      '1-2':[
        {name:'Exhale on Effort',      rounds:'10-20 rounds',rec:true, instr:'Exhale with each effort or movement. Inhale in the rest phase. Paces you and protects from post-exertional reactions.'},
        {name:'Breath-Paced Mobility', rounds:'10-15 rounds',rec:false,instr:'Each inhale guides movement in one direction, each exhale guides return. Breath leads movement.'}
      ],
      '5':[
        {name:'Breath-Paced Mobility', rounds:'30 rounds',rec:true, instr:'One full breath cycle per movement. Inhale expands, exhale contracts. Let breath be the metronome.'},
        {name:'Nasal Walking Pad',     rounds:'50 rounds',rec:false,instr:'Slow nasal-only walking at gentle pace. Match step rhythm to breath cycle for 5 minutes.'}
      ],
      '10':[
        {name:'Nasal Walking Pad',     rounds:'100 rounds',rec:true, instr:'Walk slowly breathing entirely through the nose. Match step rhythm to breath cycle at all times.'},
        {name:'Breath-Paced Mobility', rounds:'60 rounds', rec:false,instr:'Sustained breath-paced movement for 10 minutes. Inhale expands, exhale returns. Fully integrated practice.'}
      ]
    },
    PRE_EXERCISE:{
      '1-2':[
        {name:'Exhale on Effort',  rounds:'10-20 rounds',rec:true, instr:'Synchronise exhale with movement. Inhale to prepare, exhale as you move. Primes the system before activity.'},
        {name:'3-3-6 Reset',       rounds:'5-10 rounds', rec:false,instr:'Inhale 3, hold 3, exhale 6. Clears mental fog and regulates the nervous system before moderate movement.'}
      ],
      '5':[
        {name:'Breath-Paced Mobility',rounds:'30 rounds',rec:true, instr:'5-minute breath-paced warm-up. Let each inhale guide movement in, each exhale guide out. Activates without straining.'},
        {name:'Diaphragmatic 4/6',    rounds:'30 rounds',rec:false,instr:'5 minutes of belly breathing to oxygenate the body and prepare the diaphragm for movement.'}
      ],
      '10':[
        {name:'Nasal Walking Pad',    rounds:'100 rounds',rec:true, instr:'10-minute nasal walking warm-up. Builds aerobic readiness at a safe, controlled pace using nasal breathing only.'},
        {name:'Breath-Paced Mobility',rounds:'60 rounds', rec:false,instr:'10-minute breath-paced movement warm-up. Full integration of breath and movement before exercise.'}
      ]
    },
    POST_EXERCISE:{
      '1-2':[
        {name:'Soft Sigh Exhale', rounds:'10-20 rounds',rec:true, instr:'Nasal inhale, soft mouth sigh on the exhale. Immediately downregulates from exercise mode.'},
        {name:'3/5 Downshift',    rounds:'7-15 rounds', rec:false,instr:'Inhale 3, exhale 5. Quickly shifts the nervous system from sympathetic activation toward recovery.'}
      ],
      '5':[
        {name:'Humming Breath',    rounds:'37 rounds',rec:true, instr:'Nasal inhale, long hum exhale. Activates the vagus nerve for accelerated post-exercise recovery.'},
        {name:'Diaphragmatic 4/6', rounds:'30 rounds',rec:false,instr:'5 minutes of slow belly breathing after exercise to return heart rate and nervous system to baseline.'}
      ],
      '10':[
        {name:'Extended Exhale 4/8',rounds:'50 rounds',rec:true, instr:'Inhale 4, exhale 8. Deep parasympathetic activation for thorough post-exercise recovery. Reduces PEM risk.'},
        {name:'Dirga',              rounds:'60 rounds',rec:false,instr:'Three-part breath for 10 minutes post-exercise. Fully oxygenates and deeply restores after activity.'}
      ]
    }
  },
  good:{
    DOWN_REGULATION:{
      '1-2':[
        {name:'Soft Sigh Exhale', rounds:'10-20 rounds',rec:true, instr:'Nasal inhale, audible mouth sigh on the exhale. No force — pure release.'},
        {name:'3/5 Downshift',    rounds:'7-15 rounds', rec:false,instr:'Inhale 3 counts, exhale 5 counts. Calm the nervous system before it overreaches.'}
      ],
      '5':[
        {name:'Humming Breath',    rounds:'37 rounds',rec:true, instr:'Nasal inhale, long hum exhale. Feel the vibration resonating in your head and chest. Deeply regulating.'},
        {name:'Diaphragmatic 4/6', rounds:'37 rounds',rec:false,instr:'Belly rises on inhale, falls on exhale. 5 minutes of pure diaphragmatic breathing for sustained regulation.'}
      ],
      '10':[
        {name:'Diaphragmatic 4/6', rounds:'60 rounds',rec:true, instr:'Belly rises on the 4-count inhale, falls on the 6-count exhale. Chest stays soft. Pure diaphragmatic breathing.'},
        {name:'Humming Breath',    rounds:'55 rounds',rec:false,instr:'10 minutes of nasal inhale and long hum exhale. Maximum vagal activation and regulation.'}
      ]
    },
    COGNITIVE_FOCUS:{
      '1-2':[
        {name:'Normalise Breath', rounds:'12-24 rounds',rec:false,instr:'Witness your breath without interference. Baseline awareness sharpens attention.'},
        {name:'Micro-Holds',      rounds:'10-20 rounds',rec:false,instr:'Small pauses at top of inhale interrupt mental drift and restore present-moment awareness.'},
        {name:'4-Breath Box',     rounds:'7-15 rounds', rec:true, instr:'Inhale 4. Hold 4. Exhale 4. Hold 4. Balanced symmetry promotes clear cognitive function. ⭐ Recommended.'}
      ],
      '5':[
        {name:'Box Breathing',    rounds:'19 rounds',   rec:true, instr:'Equal-phase box: inhale 4, hold 4, exhale 4, hold 4. Used before demanding cognitive tasks.'},
        {name:'Micro-Holds',      rounds:'60 rounds',   rec:false,instr:'5 minutes of sustained micro-hold breathing for deep attentional training.'}
      ],
      '10':[
        {name:'Extended Box',     rounds:'37-38 rounds',rec:true, instr:'Begin with 4-count box, extend to 5-6 counts per phase as you settle. Sustained focus state.'},
        {name:'Box Breathing',    rounds:'38 rounds',   rec:false,instr:'Sustained 4-4-4-4 box breathing for 10 minutes to build deep, consistent cognitive focus.'}
      ]
    },
    QUICK_RESET:{
      '1-2':[
        {name:'3-3-6 Reset',     rounds:'5-10 rounds',rec:true, instr:'Inhale 3. Hold 3. Exhale 6. Instant reset. Effective at any point in the day.'},
        {name:'One-Minute Calm', rounds:'6-12 rounds',rec:false,instr:'Inhale 4, exhale 6. Simple, reliable, always available.'}
      ]
    },
    SLEEP:{
      '1-2':[
        {name:'Humming + Scan',      rounds:'7-15 rounds',rec:true, instr:'Hum on the exhale while scanning body tension head to toe. A powerful pre-sleep ritual.'},
        {name:'One-Minute Calm',     rounds:'6-12 rounds',rec:false,instr:'Inhale 4, exhale 6. Gentle and reliable for beginning the transition toward sleep.'}
      ],
      '5':[
        {name:'Dirga',               rounds:'30 rounds',rec:true, instr:'Three-part belly-rib-chest inhale, reverse exhale. Deeply nourishing. Perfect for transitioning toward sleep.'},
        {name:'Extended Exhale 4/8', rounds:'25 rounds',rec:false,instr:'Inhale 4, exhale 8. Long exhale activates the parasympathetic response in preparation for sleep.'}
      ],
      '10':[
        {name:'Extended Exhale 4/8', rounds:'50 rounds',rec:true, instr:'Inhale 4, exhale 8. Activates deep parasympathetic recovery — ideal for sleep onset.'},
        {name:'Dirga',               rounds:'60 rounds',rec:false,instr:'Three-part breath for 10 minutes. Completely nourishing and grounding pre-sleep practice.'}
      ]
    },
    MOVEMENT:{
      '1-2':[
        {name:'Exhale on Effort',      rounds:'10-20 rounds',rec:true, instr:'Match each exhale to your movement effort. Inhale in the rest phase.'},
        {name:'Breath-Paced Mobility', rounds:'10-15 rounds',rec:false,instr:'Each inhale guides movement in one direction, each exhale guides return.'}
      ],
      '5':[
        {name:'Breath-Paced Mobility', rounds:'30 rounds',rec:true, instr:'One full breath cycle per movement. Inhale expands, exhale contracts. Breath is the metronome.'},
        {name:'Nasal Walking Pad',     rounds:'50 rounds',rec:false,instr:'5 minutes nasal-only walking. Match step rhythm to breath cycle for steady aerobic conditioning.'}
      ],
      '10':[
        {name:'Nasal Walking Pad',     rounds:'100 rounds',rec:true, instr:'Sustained nasal-only breathing during gentle walking. Build CO2 tolerance and aerobic efficiency.'},
        {name:'Breath-Paced Mobility', rounds:'60 rounds', rec:false,instr:'10-minute fully integrated breath and movement practice. Inhale expands, exhale contracts throughout.'}
      ]
    },
    PRE_EXERCISE:{
      '1-2':[
        {name:'4-Breath Box',      rounds:'7-15 rounds', rec:true, instr:'Inhale 4, hold 4, exhale 4, hold 4. Focuses the mind, oxygenates the body, and primes the system for performance.'},
        {name:'Exhale on Effort',  rounds:'10-20 rounds',rec:false,instr:'Synchronise exhale with warm-up movements. Inhale to prepare, exhale as you move. Activates breath-movement connection.'}
      ],
      '5':[
        {name:'Breath-Paced Mobility',rounds:'30 rounds',rec:true, instr:'5-minute breath-paced warm-up. Every movement guided by breath. Activates the system safely and efficiently.'},
        {name:'Box Breathing',        rounds:'19 rounds',rec:false,instr:'5 minutes of box breathing pre-exercise to establish mental focus, steady heart rate, and nervous system readiness.'}
      ],
      '10':[
        {name:'Nasal Walking Pad',    rounds:'100 rounds',rec:true, instr:'10-minute nasal walking warm-up. Ideal aerobic preparation at a safe, breath-controlled intensity.'},
        {name:'Breath-Paced Mobility',rounds:'60 rounds', rec:false,instr:'10-minute progressive breath-paced movement. Full mind-body activation before exercise.'}
      ]
    },
    POST_EXERCISE:{
      '1-2':[
        {name:'Soft Sigh Exhale', rounds:'10-20 rounds',rec:true, instr:'Nasal inhale, audible mouth sigh. Immediately shifts the nervous system from effort mode to recovery.'},
        {name:'3/5 Downshift',    rounds:'7-15 rounds', rec:false,instr:'Inhale 3, exhale 5. Fast downregulation after performance. Reduces cortisol and returns to baseline.'}
      ],
      '5':[
        {name:'Humming Breath',    rounds:'37 rounds',rec:true, instr:'Nasal inhale, sustained hum exhale. Activates vagal tone for accelerated recovery and reduced inflammation.'},
        {name:'Diaphragmatic 4/6', rounds:'37 rounds',rec:false,instr:'5 minutes of slow belly breathing post-exercise. Returns the body to its natural, regulated rhythm.'}
      ],
      '10':[
        {name:'Extended Exhale 4/8',rounds:'50 rounds',rec:true, instr:'Inhale 4, exhale 8. Deep parasympathetic activation for full post-performance recovery. Reduces PEM risk significantly.'},
        {name:'Dirga',              rounds:'60 rounds',rec:false,instr:'Three-part breath for 10 minutes after exercise. Complete oxygenation and restoration of the nervous system.'}
      ]
    }
  }
};

var COMPLETE_MSG={
  flare:'Rest was the practice today. You met yourself where you are — that takes courage.',
  moderate:'A gentle session well done. Notice how you feel. Rest follows breath.',
  good:'You showed up fully. Carry this calm into the rest of your day.'
};

var PHASE_PATTERNS={
  'Soft Sigh Exhale':      [{p:'Inhale',s:3},{p:'Sigh out',s:4}],
  '3/5 Downshift':         [{p:'Inhale',s:3},{p:'Exhale',s:5}],
  'Normalise Breath':      [{p:'Inhale',s:3},{p:'Exhale',s:3}],
  'Micro-Holds':           [{p:'Inhale',s:3},{p:'Hold',s:2},{p:'Exhale',s:4}],
  '3-3-6 Reset':           [{p:'Inhale',s:3},{p:'Hold',s:3},{p:'Exhale',s:6}],
  'One-Minute Calm':       [{p:'Inhale',s:4},{p:'Exhale',s:6}],
  'Humming + Scan':        [{p:'Inhale',s:4},{p:'Hum out',s:6}],
  'Exhale on Effort':      [{p:'Inhale',s:3},{p:'Exhale',s:4}],
  'Humming Breath':        [{p:'Inhale',s:4},{p:'Hum out',s:7}],
  'Diaphragmatic 4/6':     [{p:'Inhale',s:4},{p:'Exhale',s:6}],
  'Box Breathing':         [{p:'Inhale',s:4},{p:'Hold',s:4},{p:'Exhale',s:4},{p:'Hold',s:4}],
  'Extended Box':          [{p:'Inhale',s:4},{p:'Hold',s:4},{p:'Exhale',s:4},{p:'Hold',s:4}],
  '4-Breath Box':          [{p:'Inhale',s:4},{p:'Hold',s:4},{p:'Exhale',s:4},{p:'Hold',s:4}],
  'Dirga':                 [{p:'Belly in',s:4},{p:'Ribs & chest',s:3},{p:'Exhale',s:6}],
  'Extended Exhale 4/8':   [{p:'Inhale',s:4},{p:'Exhale',s:8}],
  'Breath-Paced Mobility': [{p:'Inhale & expand',s:4},{p:'Exhale & return',s:5}],
  'Nasal Walking Pad':     [{p:'Inhale steps',s:4},{p:'Exhale steps',s:4}],
  'Nasal Breathing Prep':  [{p:'Inhale',s:4},{p:'Exhale',s:4}]
};

var TIME_MAP={
  flare:    [{label:'1 minute',   key:'1',   rec:true, opt:false},{label:'2 minutes',  key:'2',   rec:false,opt:false}],
  moderate: [{label:'1-2 minutes',key:'1-2', rec:true, opt:false},{label:'5 minutes',  key:'5',   rec:true, opt:false},{label:'10 minutes',key:'10',rec:false,opt:true}],
  good:     [{label:'1-2 minutes',key:'1-2', rec:false,opt:false},{label:'5 minutes',  key:'5',   rec:true, opt:false},{label:'10 minutes',key:'10',rec:false,opt:false}]
};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GOALS: GOALS,
    DRILLS: DRILLS,
    COMPLETE_MSG: COMPLETE_MSG,
    PHASE_PATTERNS: PHASE_PATTERNS,
    TIME_MAP: TIME_MAP
  };
}
