# ജനകീയ ക്വിസ് ☭ — Communist Knowledge Quiz

A Malayalam-language quiz application about communist history, theory, and movements.
Built with pure HTML, CSS, and JavaScript — no frameworks, no build tools.

## Project Structure

```
communist-quiz/
├── index.html              ← Main entry point
├── css/
│   ├── style.css           ← All styles (Soviet Constructivist theme)
│   └── animations.css      ← Keyframe animations only
├── js/
│   ├── questions.js        ← ONLY question data (easy to update)
│   ├── quiz.js             ← Core quiz logic (state, timer, scoring)
│   ├── ui.js               ← DOM manipulation, screen rendering
│   ├── leaderboard.js      ← Leaderboard logic (localStorage)
│   └── config.js           ← App configuration (timer, pass %, etc.)
├── assets/
│   └── fonts/              ← Local font fallbacks (if needed)
├── README.md               ← This file
└── .github/
    └── workflows/
        └── deploy.yml      ← GitHub Pages auto-deploy action
```

## Running Locally

**Option 1: Node.js** (recommended)
```bash
npx serve .
```

**Option 2: Python**
```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or the port shown) in your browser.

> **Note:** You can also open `index.html` directly in a browser — everything works without a server.

## How to Add New Questions

Questions live in `js/questions.js`. Each topic has an array of question objects.

### Question Format

```javascript
{
  q: "ചോദ്യ ടെക്സ്റ്റ് ഇവിടെ?",          // Question text (Malayalam)
  o: [                                    // Exactly 4 options (Malayalam)
    "ഓപ്ഷൻ 1",
    "ഓപ്ഷൻ 2",
    "ഓപ്ഷൻ 3",
    "ഓപ്ഷൻ 4"
  ],
  c: 0,                                   // Correct answer index (0-3)
  ex: "വിശദീകരണം ഇവിടെ.",                // Explanation (Malayalam, 2-4 sentences)
  img: "marx"                              // Image key (see IMAGES object) or null
}
```

### Steps to Add a Question

1. Open `js/questions.js`
2. Find the topic array (e.g., `QUESTION_BANK.marxist`)
3. Add your question object to the array
4. Make sure `c` matches the correct option's index (0 = first, 1 = second, etc.)
5. Save and refresh

### Available Image Keys

- `marx`, `engels`, `lenin`, `mao`, `che`, `castro`
- `namboodiripad`, `manifesto`, `red_flag`, `ho_chi_minh`
- Use `null` for no image

## How to Add a New Topic

1. In `js/config.js`, add to the `TOPICS` array:
   ```javascript
   { id: "your_id", icon: "🔥", label: "മലയാളം ലേബൽ", subtitle: "English Subtitle" }
   ```

2. In `js/questions.js`, add a new key to `QUESTION_BANK`:
   ```javascript
   QUESTION_BANK.your_id = [
     { q: "...", o: ["...","...","...","..."], c: 0, ex: "...", img: null },
     // Add 50+ questions
   ];
   ```

3. Save both files and refresh.

## How to Change Timer / Pass Threshold

Edit `js/config.js`:

```javascript
const CONFIG = {
  QUESTIONS_PER_QUIZ:  10,    // Questions per quiz session
  TIMER_SECONDS:       30,    // Seconds per question
  PASS_THRESHOLD:      0.60,  // 60% to pass
  POINTS_CORRECT:      1,     // Points for correct answer
  MAX_LEADERBOARD:     10,    // Top entries to keep
  SHUFFLE_OPTIONS:     true,  // Randomise option order
};
```

## Deploy to GitHub Pages

### Automatic (recommended)

1. Push your code to a GitHub repository's `main` branch
2. Go to **Settings → Pages**
3. Set source to **GitHub Actions**
4. The included `.github/workflows/deploy.yml` handles deployment automatically
5. Your site will be live at `https://username.github.io/repository-name/`

### Manual

1. Go to **Settings → Pages**
2. Set source to **Deploy from a branch**
3. Select `main` branch, `/ (root)` folder
4. Click Save

## Quiz Topics

| Topic | Description | Questions |
|-------|-------------|-----------|
| 📖 മാർക്‌സിസ്റ്റ് സിദ്ധാന്തം | Marxist Theory & Dialectics | 50 |
| ✊ സി.പി.ഐ.(എം) | CPI(M) Party & Politics | 50 |
| 🌹 കേരളത്തിന്റെ ചുവന്ന ചരിത്രം | Kerala's Red Legacy | 50 |
| 🇮🇳 ഇന്ത്യൻ കമ്മ്യൂണിസം | Indian Communist Movement | 50 |
| 🌍 ലോക വിപ്ലവം | Global Revolution | 50 |
| ☭ മാർക്സും ഏംഗൽസും | Marx, Engels & The Manifesto | 50 |

**Total: 300 questions**

## Technology

- Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- Zero npm dependencies at runtime
- Google Fonts: Bebas Neue + Noto Sans Malayalam
- localStorage for leaderboard persistence
- GitHub Pages compatible (all relative paths)

## License

Educational project. Questions are factual in nature and intended for learning.
