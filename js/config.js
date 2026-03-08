/**
 * ചെങ്കതിർ — App Configuration
 * Edit these values to customise quiz behaviour.
 */
const CONFIG = {
  QUESTIONS_PER_QUIZ:  10,
  TIMER_SECONDS:       30,
  PASS_THRESHOLD:      0.60,
  POINTS_CORRECT:      1,
  POINTS_WRONG:        0,
  MAX_LEADERBOARD:     10,
  STORAGE_KEY:         'cq_leaderboard_v2',
  SHUFFLE_OPTIONS:     true,
};

const TOPICS = [
  { id: "marxist",     icon: "📖", label: "മാർക്‌സിസ്റ്റ് സിദ്ധാന്തം",    subtitle: "Marxist Theory & Dialectics" },
  { id: "cpim",        icon: "✊", label: "സി.പി.ഐ.(എം)",                  subtitle: "CPI(M) Party & Politics" },
  { id: "kerala",      icon: "🌹", label: "കേരളത്തിന്റെ ചുവന്ന ചരിത്രം",  subtitle: "Kerala's Red Legacy" },
  { id: "india",       icon: "🇮🇳", label: "ഇന്ത്യൻ കമ്മ്യൂണിസം",         subtitle: "Indian Communist Movement" },
  { id: "global",      icon: "🌍", label: "ലോക വിപ്ലവം",                   subtitle: "Global Revolution" },
  { id: "marx_engels", icon: "☭",  label: "മാർക്സും ഏംഗൽസും",          subtitle: "Marx, Engels & The Manifesto" },
];

const UI = {
  appTitle:          'ചെങ്കതിർ',
  appSubtitle:       'The Communist Knowledge Challenge',
  appTagline:        'അറിയുക, ഉയരുക',
  startBtn:          'സമരം ആരംഭിക്കുക ★',
  leaderboardBtn:    'വിപ്ലവകാരികളുടെ ഹാൾ 🏆',
  topicSelectTitle:  'വിഷയം തിരഞ്ഞെടുക്കൂ ☭',
  nameLabel:         'നിങ്ങളുടെ പേര്',
  namePlaceholder:   '',
  startQuizBtn:      'ക്വിസ് ആരംഭിക്കൂ →',
  correct:           '✓ ശരിയാണ്!',
  wrong:             '✗ തെറ്റ്!',
  timeout:           '⏰ സമയം കഴിഞ്ഞു!',
  nextBtn:           'അടുത്ത ചോദ്യം →',
  passTitle:         'വിജയം ✓',
  failTitle:         'പരാജയം ✗',
  playAgainBtn:      'വീണ്ടും കളിക്കൂ',
  changeTopicBtn:    'മറ്റൊരു വിഷയം',
  leaderboardTitle:  'വിപ്ലവകാരികളുടെ ഹാൾ',
  clearBtn:          'ലീഡർബോർഡ് മായ്ക്കുക',
  backBtn:           '← തിരിച്ച് പോകൂ',
  questionOf:        'ചോദ്യം',
  scoreLabel:        'സ്കോർ',
  timeLabel:         'സമയം',
  explanation:       'വിശദീകരണം:',
  correctAnswer:     'ശരിയുത്തരം:',
  ratings: {
    90: 'തൊഴിലാളി വർഗ്ഗത്തിന്റെ മുൻനിര! ☭',
    70: 'വർഗ്ഗ ബോധമുള്ള കൂട്ടാളി ★',
    60: 'സഹയാത്രികൻ ✊',
    40: 'ബൂർഷ്വാ അനുഭാവി 💼',
     0: 'വർഗ്ഗ ശത്രു! 👔',
  },
  noEntries:         'ഇതുവരെ ആർക്കും പ്രവേശിക്കാൻ കഴിഞ്ഞില്ല!',
  clearConfirm:      'ലീഡർബോർഡ് ശൂന്യമാക്കണോ?',
  nameError:         'ദയവായി 2+ അക്ഷരങ്ങൾ ഉള്ള പേര് നൽകൂ',
};
