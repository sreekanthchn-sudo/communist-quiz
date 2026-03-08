/**
 * ജനകീയ ക്വിസ് — Core Quiz Logic
 * State management, game flow, timer, scoring.
 * No question data here — all questions live in questions.js.
 */
(() => {
  'use strict';

  /* ═══════════════════════════════════════
     STATE — Single source of truth
     ═══════════════════════════════════════ */
  const QuizState = {
    playerName:    '',
    currentTopic:  null,
    questions:     [],
    currentIndex:  0,
    score:         0,
    answers:       [],
    timerInterval: null,
    timeLeft:      CONFIG.TIMER_SECONDS,
    quizStartTime: null,
    quizEndTime:   null,
    isAnswered:    false,

    reset() {
      this.playerName   = '';
      this.currentTopic = null;
      this.questions    = [];
      this.currentIndex = 0;
      this.score        = 0;
      this.answers      = [];
      this.clearTimer();
      this.timeLeft      = CONFIG.TIMER_SECONDS;
      this.quizStartTime = null;
      this.quizEndTime   = null;
      this.isAnswered    = false;
    },

    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
  };

  /* ═══════════════════════════════════════
     SHUFFLE UTILITIES
     ═══════════════════════════════════════ */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Pick N random questions from the bank, shuffling options if configured.
   * Returns array of question objects with `originalCorrectIndex` preserved.
   */
  function pickQuestions(topicId, count) {
    const bank = QUESTION_BANK[topicId];
    if (!bank || bank.length === 0) return [];

    const shuffled = shuffle(bank);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    return selected.map(q => {
      if (!CONFIG.SHUFFLE_OPTIONS) {
        return { ...q, shuffledOptions: q.o.map((text, i) => ({ text, origIdx: i })) };
      }

      // Create indexed options and shuffle
      const indexed = q.o.map((text, i) => ({ text, origIdx: i }));
      const shuffledOpts = shuffle(indexed);

      // Find new correct index
      const newCorrectIdx = shuffledOpts.findIndex(opt => opt.origIdx === q.c);

      return {
        q: q.q,
        o: shuffledOpts.map(opt => opt.text),
        c: newCorrectIdx,
        ex: q.ex,
        img: q.img,
        shuffledOptions: shuffledOpts,
      };
    });
  }

  /* ═══════════════════════════════════════
     SCREEN NAVIGATION
     ═══════════════════════════════════════ */

  /** Start app — show welcome */
  function showWelcome() {
    QuizState.clearTimer();
    QuizUI.renderWelcome(showTopics, () => showLeaderboard(null));
  }

  /** Show topic selection */
  function showTopics() {
    QuizState.clearTimer();
    QuizUI.renderTopics(selectTopic, showWelcome);
  }

  /** Topic selected — show name input */
  function selectTopic(topic) {
    QuizState.currentTopic = topic;
    QuizUI.renderNameInput(topic.label, startQuiz, showTopics);
  }

  /** Start quiz with player name */
  function startQuiz(name) {
    QuizState.playerName   = name;
    QuizState.currentIndex = 0;
    QuizState.score        = 0;
    QuizState.answers      = [];
    QuizState.isAnswered   = false;
    QuizState.quizStartTime = Date.now();
    QuizState.quizEndTime   = null;

    // Pick questions
    const questions = pickQuestions(QuizState.currentTopic.id, CONFIG.QUESTIONS_PER_QUIZ);
    if (questions.length === 0) {
      showError('ചോദ്യങ്ങളൊന്നും കണ്ടെത്താനായില്ല!');
      return;
    }
    QuizState.questions = questions;

    showQuestion();
  }

  /** Render current question */
  function showQuestion() {
    QuizState.clearTimer();
    QuizState.isAnswered = false;
    QuizState.timeLeft   = CONFIG.TIMER_SECONDS;

    const idx = QuizState.currentIndex;
    if (idx >= QuizState.questions.length) {
      showResults();
      return;
    }

    const question = QuizState.questions[idx];

    // Build label array for UI
    const labels = question.shuffledOptions
      ? question.shuffledOptions.map(opt => ({ text: opt.text }))
      : question.o.map(text => ({ text }));

    QuizUI.renderQuestion(QuizState, question, labels, handleAnswer);

    // Bind next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', nextQuestion);
    }

    // Start timer
    startTimer();
  }

  /** Handle answer selection */
  function handleAnswer(selectedIdx) {
    if (QuizState.isAnswered) return;
    QuizState.isAnswered = true;
    QuizState.clearTimer();

    const question = QuizState.questions[QuizState.currentIndex];
    const correct = selectedIdx === question.c;

    if (correct) {
      QuizState.score += CONFIG.POINTS_CORRECT;
      QuizUI.updateScore(QuizState.score);
    }

    QuizState.answers.push({
      questionIndex:  QuizState.currentIndex,
      selectedOption: selectedIdx,
      correct:        correct,
      timeLeft:       QuizState.timeLeft,
    });

    QuizUI.showAnswerFeedback(selectedIdx, question.c, question, false);
  }

  /** Handle timeout */
  function handleTimeout() {
    if (QuizState.isAnswered) return;
    QuizState.isAnswered = true;
    QuizState.clearTimer();

    const question = QuizState.questions[QuizState.currentIndex];

    QuizState.answers.push({
      questionIndex:  QuizState.currentIndex,
      selectedOption: -1,
      correct:        false,
      timeLeft:       0,
    });

    QuizUI.showAnswerFeedback(-1, question.c, question, true);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }

  /** Move to next question or results */
  function nextQuestion() {
    QuizState.currentIndex++;
    if (QuizState.currentIndex >= CONFIG.QUESTIONS_PER_QUIZ || QuizState.currentIndex >= QuizState.questions.length) {
      showResults();
    } else {
      showQuestion();
    }
  }

  /* ═══════════════════════════════════════
     TIMER
     ═══════════════════════════════════════ */
  function startTimer() {
    QuizState.clearTimer(); // safety: always clear before creating

    const startTime = Date.now();
    const totalMs = CONFIG.TIMER_SECONDS * 1000;

    QuizState.timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max((totalMs - elapsed) / 1000, 0);
      QuizState.timeLeft = remaining;

      QuizUI.updateTimer(remaining, CONFIG.TIMER_SECONDS);

      if (remaining <= 0) {
        QuizState.clearTimer();
        handleTimeout();
      }
    }, 100); // smooth 100ms updates
  }

  /* ═══════════════════════════════════════
     RESULTS
     ═══════════════════════════════════════ */
  function showResults() {
    QuizState.clearTimer();
    QuizState.quizEndTime = Date.now();

    const total = CONFIG.QUESTIONS_PER_QUIZ;
    const percent = Math.round((QuizState.score / total) * 100);
    const timeStr = QuizUI._formatTime(QuizState.quizStartTime, QuizState.quizEndTime);

    // Save to leaderboard
    if (Leaderboard.isAvailable()) {
      const entry = {
        name:       QuizState.playerName,
        topic:      QuizState.currentTopic.id,
        topicLabel: QuizState.currentTopic.label,
        score:      QuizState.score,
        total:      total,
        percent:    percent,
        time:       timeStr,
        date:       new Date().toISOString().slice(0, 10),
        passed:     percent >= CONFIG.PASS_THRESHOLD * 100,
      };
      Leaderboard.saveEntry(entry);
    }

    QuizUI.renderResults(
      QuizState,
      () => startQuiz(QuizState.playerName), // play again same topic
      showTopics,                             // change topic
      () => showLeaderboard(QuizState.playerName)
    );
  }

  /** Show leaderboard */
  function showLeaderboard(playerName) {
    QuizState.clearTimer();
    QuizUI.renderLeaderboard(playerName, showWelcome);
  }

  /** Show error screen */
  function showError(msg) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'welcome screen';
    wrap.innerHTML = `
      <div class="anim-fade-in-up text-center">
        <div style="font-size:3rem;margin-bottom:16px;">⚠️</div>
        <p style="margin-bottom:24px;">${msg}</p>
      </div>
    `;
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-primary';
    retryBtn.textContent = 'തിരിച്ച് പോകൂ';
    retryBtn.addEventListener('click', showWelcome);
    wrap.querySelector('.anim-fade-in-up').appendChild(retryBtn);
    app.appendChild(wrap);
  }

  /* ═══════════════════════════════════════
     INIT — Boot the app
     ═══════════════════════════════════════ */
  function init() {
    // Verify question bank exists
    if (typeof QUESTION_BANK === 'undefined') {
      showError('ചോദ്യ ബാങ്ക് ലോഡ് ചെയ്യാനായില്ല!');
      return;
    }

    // Verify at least one topic has questions
    const hasQuestions = TOPICS.some(t => QUESTION_BANK[t.id] && QUESTION_BANK[t.id].length > 0);
    if (!hasQuestions) {
      showError('ചോദ്യങ്ങളൊന്നും കണ്ടെത്താനായില്ല!');
      return;
    }

    showWelcome();
  }

  // Boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
