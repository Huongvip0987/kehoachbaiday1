// ══════════════════════════════════
// GLOBAL STATE
// ══════════════════════════════════

// Lesson ID (set by init.js)
const _LID = (typeof LESSON_ID !== 'undefined') ? LESSON_ID : 'b17';

// Current app mode: 'slides' | 'code' | 'edit' | 'cq' | 'chon' | 'kichban' | 'game'
let _currentAppMode = 'slides';

// Playground state
let demoSteps = [];
let currentStep = -1;
let previousVars = {};
let currentPresetKey = _LID === 'b16' ? 'b16_print' : 'demo_bien';
let autoPlayTimer = null;
