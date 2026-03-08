/**
 * ജനകീയ ക്വിസ് — UI Module
 * All DOM rendering and screen management.
 * Uses textContent for user-facing strings (XSS safe).
 */
const QuizUI = (() => {
  'use strict';

  const app = document.getElementById('app');

  /* ── Helper: create element with classes ── */
  function el(tag, classes, attrs) {
    const e = document.createElement(tag);
    if (classes) e.className = classes;
    if (attrs) {
      Object.keys(attrs).forEach(k => {
        if (k === 'textContent') e.textContent = attrs[k];
        else if (k === 'innerHTML') e.innerHTML = attrs[k];
        else e.setAttribute(k, attrs[k]);
      });
    }
    return e;
  }

  /* ── Clear and set screen ── */
  function setScreen(html) {
    app.innerHTML = '';
    if (typeof html === 'string') {
      app.innerHTML = html;
    } else if (html instanceof HTMLElement) {
      app.appendChild(html);
    }
    window.scrollTo(0, 0);
  }

  /* ═══════════════════════════════════════
     SCREEN 1: Welcome
     ═══════════════════════════════════════ */
  function renderWelcome(onStart, onLeaderboard) {
    const wrap = el('div', 'welcome screen');

    // Spinning star
    const star = el('div', 'welcome__star anim-star-spin anim-fade-in-up welcome-stagger-1', { textContent: '★' });
    star.setAttribute('aria-hidden', 'true');

    // Title with decorators
    const titleWrap = el('div', 'anim-fade-in-up welcome-stagger-2');
    const decorators = el('div', 'welcome__decorators');
    decorators.innerHTML = '<span>☭</span>';
    const title = el('h1', 'welcome__title title-display', { textContent: UI.appTitle });
    const decorators2 = el('div', 'welcome__decorators');
    decorators2.innerHTML = '<span>☭</span>';
    const titleRow = el('div', 'welcome__decorators');
    titleRow.appendChild(decorators.querySelector('span').cloneNode(true));
    titleRow.appendChild(title);
    const sickle2 = document.createElement('span');
    sickle2.textContent = '☭';
    titleRow.appendChild(sickle2);
    titleWrap.appendChild(titleRow);

    // Subtitle
    const subtitle = el('p', 'welcome__subtitle anim-fade-in-up welcome-stagger-2', { textContent: UI.appSubtitle });

    // Buttons
    const btns = el('div', 'welcome__buttons anim-fade-in-up welcome-stagger-3');

    const startBtn = el('button', 'btn btn-primary btn-block anim-glow-pulse', { textContent: UI.startBtn });
    startBtn.setAttribute('aria-label', 'Start the quiz');
    startBtn.addEventListener('click', onStart);

    const lbBtn = el('button', 'btn btn-secondary btn-block', { textContent: UI.leaderboardBtn });
    lbBtn.setAttribute('aria-label', 'View leaderboard');
    lbBtn.addEventListener('click', onLeaderboard);

    btns.appendChild(startBtn);
    btns.appendChild(lbBtn);

    // Star row
    const starsRow = el('div', 'welcome__stars-row anim-fade-in-up welcome-stagger-4');
    starsRow.innerHTML = '★ ★ ★ ★ ★';

    wrap.appendChild(star);
    wrap.appendChild(titleWrap);
    wrap.appendChild(subtitle);
    wrap.appendChild(btns);
    wrap.appendChild(starsRow);

    setScreen(wrap);
  }

  /* ═══════════════════════════════════════
     SCREEN 2: Topic Selection
     ═══════════════════════════════════════ */
  function renderTopics(onSelect, onBack) {
    const wrap = el('div', 'topics screen');

    // Title
    const title = el('h2', 'title-display title-lg topics__title anim-fade-in-up', { textContent: UI.topicSelectTitle });
    wrap.appendChild(title);

    // Grid
    const grid = el('div', 'topics__grid');

    TOPICS.forEach((topic, i) => {
      const card = el('div', `card card-hover topic-card anim-slide-in-left stagger-${i + 1}`);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', topic.label);

      const icon = el('span', 'topic-card__icon', { textContent: topic.icon });
      icon.setAttribute('aria-hidden', 'true');
      const label = el('div', 'topic-card__label', { textContent: topic.label });
      const sub = el('div', 'topic-card__subtitle', { textContent: topic.subtitle });

      card.appendChild(icon);
      card.appendChild(label);
      card.appendChild(sub);

      card.addEventListener('click', () => onSelect(topic));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(topic);
        }
      });

      grid.appendChild(card);
    });

    wrap.appendChild(grid);

    // Back button
    const backBtn = el('button', 'btn btn-secondary btn-block mt-24 anim-fade-in-up', { textContent: UI.backBtn });
    backBtn.setAttribute('aria-label', 'Go back');
    backBtn.addEventListener('click', onBack);
    wrap.appendChild(backBtn);

    setScreen(wrap);
  }

  /* ═══════════════════════════════════════
     SCREEN 3: Name Input
     ═══════════════════════════════════════ */
  function renderNameInput(topicLabel, onStart, onBack) {
    const wrap = el('div', 'name-screen screen');

    const title = el('h2', 'title-display title-lg anim-fade-in-up', { textContent: topicLabel });
    wrap.appendChild(title);

    const label = el('label', 'mb-8 anim-fade-in-up', { textContent: UI.nameLabel });
    label.setAttribute('for', 'player-name');
    wrap.appendChild(label);

    const inputWrap = el('div', 'name-screen__input-wrap anim-fade-in-up');
    const input = el('input', 'input-field');
    input.type = 'text';
    input.id = 'player-name';
    input.placeholder = UI.namePlaceholder;
    input.maxLength = 40;
    input.setAttribute('autocomplete', 'off');

    const errorMsg = el('div', 'input-error');
    errorMsg.id = 'name-error';

    inputWrap.appendChild(input);
    inputWrap.appendChild(errorMsg);
    wrap.appendChild(inputWrap);

    const startBtn = el('button', 'btn btn-primary btn-block mt-16 anim-fade-in-up', { textContent: UI.startQuizBtn });
    startBtn.setAttribute('aria-label', 'Start quiz');
    startBtn.addEventListener('click', () => {
      const name = input.value.trim();
      if (name.length < 2) {
        errorMsg.textContent = UI.nameError;
        input.focus();
        return;
      }
      errorMsg.textContent = '';
      onStart(name);
    });

    // Allow Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') startBtn.click();
    });

    wrap.appendChild(startBtn);

    const backBtn = el('button', 'btn btn-secondary btn-block mt-8', { textContent: UI.backBtn });
    backBtn.addEventListener('click', onBack);
    wrap.appendChild(backBtn);

    setScreen(wrap);

    // Focus input
    setTimeout(() => input.focus(), 300);
  }

  /* ═══════════════════════════════════════
     SCREEN 4: Quiz Question
     ═══════════════════════════════════════ */
  function renderQuestion(state, question, labels, onAnswer) {
    const wrap = el('div', 'screen');

    // Header
    const header = el('div', 'quiz-header');
    const topicSpan = el('span', 'quiz-header__topic', { textContent: state.currentTopic.label });
    const counter = el('span', 'quiz-header__counter', {
      textContent: `${UI.questionOf} ${state.currentIndex + 1}/${CONFIG.QUESTIONS_PER_QUIZ}`
    });
    const score = el('span', 'quiz-header__score');
    score.innerHTML = `★ <span class="quiz-header__score-value" id="score-display">${state.score}</span>`;
    header.appendChild(topicSpan);
    header.appendChild(counter);
    header.appendChild(score);
    wrap.appendChild(header);

    // Timer bar
    const timerWrap = el('div', 'timer-bar-wrap');
    const timerBar = el('div', 'timer-bar timer-bar--green');
    timerBar.id = 'timer-bar';
    timerBar.style.width = '100%';
    const timerText = el('span', 'timer-bar__text', { textContent: CONFIG.TIMER_SECONDS + 's' });
    timerText.id = 'timer-text';
    timerBar.appendChild(timerText);
    timerWrap.appendChild(timerBar);
    wrap.appendChild(timerWrap);

    // Question image
    if (question.img && IMAGES[question.img]) {
      const imgWrap = el('div', 'question-image-wrap anim-fade-in-up');
      const img = el('img', 'question-image');
      img.src = IMAGES[question.img];
      img.alt = question.q.substring(0, 60);
      img.loading = 'lazy';
      img.onerror = function() { this.style.display = 'none'; };
      imgWrap.appendChild(img);
      wrap.appendChild(imgWrap);
    }

    // Question text
    const qText = el('div', 'question-text anim-fade-in-up', { textContent: question.q });
    wrap.appendChild(qText);

    // Options
    const optList = el('div', 'options-list');
    optList.id = 'options-list';
    labels.forEach((opt, i) => {
      const btn = el('button', `option-btn anim-pop-in stagger-${i + 1}`);
      btn.id = `option-${i}`;
      btn.setAttribute('aria-label', `Option ${['A','B','C','D'][i]}: ${opt.text}`);

      const badge = el('span', 'option-btn__label', { textContent: ['A','B','C','D'][i] });
      const text = el('span', 'option-btn__text', { textContent: opt.text });
      const icon = el('span', 'option-btn__icon');
      icon.id = `option-icon-${i}`;

      btn.appendChild(badge);
      btn.appendChild(text);
      btn.appendChild(icon);

      btn.addEventListener('click', () => onAnswer(i));
      optList.appendChild(btn);
    });
    wrap.appendChild(optList);

    // Feedback area (hidden initially)
    const feedback = el('div', 'feedback hidden');
    feedback.id = 'feedback-area';
    wrap.appendChild(feedback);

    // Next button (hidden initially)
    const nextWrap = el('div', 'next-btn-wrap hidden');
    nextWrap.id = 'next-btn-wrap';
    const nextBtn = el('button', 'btn btn-gold btn-block', { textContent: UI.nextBtn });
    nextBtn.id = 'next-btn';
    nextWrap.appendChild(nextBtn);
    wrap.appendChild(nextWrap);

    setScreen(wrap);
  }

  /* ── Show answer feedback (after selection) ── */
  function showAnswerFeedback(selectedIdx, correctIdx, question, isTimeout) {
    // Disable all options
    const optList = document.getElementById('options-list');
    if (!optList) return;
    const buttons = optList.querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIdx) {
        btn.classList.add('option-btn--correct', 'anim-correct-glow');
        document.getElementById(`option-icon-${i}`).textContent = '✓';
      } else if (i === selectedIdx && selectedIdx !== correctIdx) {
        btn.classList.add('option-btn--wrong', 'anim-wrong-shake');
        document.getElementById(`option-icon-${i}`).textContent = '✗';
      } else {
        btn.classList.add('option-btn--dimmed');
      }
    });

    // Show feedback
    const feedback = document.getElementById('feedback-area');
    if (!feedback) return;
    feedback.classList.remove('hidden');
    feedback.innerHTML = '';

    // Status message
    const status = el('div', 'feedback__status anim-fade-in-up');
    if (isTimeout) {
      status.classList.add('feedback__status--timeout');
      status.textContent = UI.timeout;
    } else if (selectedIdx === correctIdx) {
      status.classList.add('feedback__status--correct');
      status.textContent = UI.correct;
    } else {
      status.classList.add('feedback__status--wrong');
      status.textContent = UI.wrong;
    }
    feedback.appendChild(status);

    // Correct answer note (if wrong or timeout)
    if (selectedIdx !== correctIdx) {
      const correctNote = el('div', 'feedback__correct-answer anim-fade-in-up', {
        textContent: `${UI.correctAnswer} ${['A','B','C','D'][correctIdx]} - ${question.o[correctIdx]}`
      });
      feedback.appendChild(correctNote);
    }

    // Explanation
    const expWrap = el('div', 'feedback__explanation anim-slide-down');
    const expTitle = el('div', 'feedback__explanation-title', { textContent: UI.explanation });
    const expText = el('div', '', { textContent: question.ex });
    expWrap.appendChild(expTitle);
    expWrap.appendChild(expText);
    feedback.appendChild(expWrap);

    // Show next button
    const nextWrap = document.getElementById('next-btn-wrap');
    if (nextWrap) nextWrap.classList.remove('hidden');
  }

  /* ── Update timer bar ── */
  function updateTimer(timeLeft, totalTime) {
    const bar = document.getElementById('timer-bar');
    const text = document.getElementById('timer-text');
    if (!bar || !text) return;

    const percent = (timeLeft / totalTime) * 100;
    bar.style.width = Math.max(percent, 0) + '%';
    text.textContent = Math.ceil(timeLeft) + 's';

    // Color changes
    bar.classList.remove('timer-bar--green', 'timer-bar--orange', 'timer-bar--red', 'anim-timer-pulse');
    if (timeLeft > 20) {
      bar.classList.add('timer-bar--green');
    } else if (timeLeft > 10) {
      bar.classList.add('timer-bar--orange');
    } else {
      bar.classList.add('timer-bar--red');
      if (timeLeft <= 5) {
        bar.classList.add('anim-timer-pulse');
      }
    }
  }

  /* ── Update score display ── */
  function updateScore(score) {
    const scoreEl = document.getElementById('score-display');
    if (scoreEl) {
      scoreEl.textContent = score;
      scoreEl.classList.remove('anim-score-up');
      // Force reflow to restart animation
      void scoreEl.offsetWidth;
      scoreEl.classList.add('anim-score-up');
    }
  }

  /* ═══════════════════════════════════════
     SCREEN 6: Results
     ═══════════════════════════════════════ */
  function renderResults(state, onPlayAgain, onChangeTopic, onLeaderboard) {
    const wrap = el('div', 'results screen');
    const total = CONFIG.QUESTIONS_PER_QUIZ;
    const percent = Math.round((state.score / total) * 100);
    const passed = percent >= CONFIG.PASS_THRESHOLD * 100;

    // Header
    const header = el('h2', `results__header title-display anim-fade-in-up ${passed ? 'results__header--pass' : 'results__header--fail'}`);
    header.textContent = passed ? UI.passTitle : UI.failTitle;
    wrap.appendChild(header);

    // Score big
    const scoreBig = el('div', 'results__score-big anim-fade-in-up text-gold', {
      textContent: `${state.score} / ${total}`
    });
    wrap.appendChild(scoreBig);

    // Percent display
    const percentText = el('div', 'text-center anim-fade-in-up text-muted', { textContent: `${percent}%` });
    wrap.appendChild(percentText);

    // Percent bar
    const barWrap = el('div', 'results__percent-bar anim-fade-in-up');
    const barFill = el('div', `results__percent-fill ${passed ? 'results__percent-fill--pass' : 'results__percent-fill--fail'}`);
    barFill.style.width = '0%';
    barWrap.appendChild(barFill);
    wrap.appendChild(barWrap);

    // Animate fill after render
    setTimeout(() => { barFill.style.width = percent + '%'; }, 200);

    // Rating
    const rating = _getRating(percent);
    const ratingEl = el('div', 'results__rating anim-fade-in-up', { textContent: rating });
    wrap.appendChild(ratingEl);

    // Time
    const timeStr = _formatTime(state.quizStartTime, state.quizEndTime);
    const timeEl = el('div', 'results__time anim-fade-in-up', { textContent: `${UI.timeLabel}: ${timeStr}` });
    wrap.appendChild(timeEl);

    // Answer summary (collapsible)
    const summaryWrap = el('div', 'answer-summary anim-fade-in-up');
    const toggleBtn = el('button', 'answer-summary__toggle', { textContent: '📋 ഉത്തരങ്ങൾ കാണുക / മറയ്ക്കുക' });
    const summaryList = el('div', 'answer-summary__list hidden');
    summaryList.id = 'summary-list';

    state.answers.forEach((ans, i) => {
      const q = state.questions[i];
      const item = el('div', `answer-summary__item ${ans.correct ? 'answer-summary__item--correct' : 'answer-summary__item--wrong'}`);
      const qText = el('div', 'answer-summary__item-q', {
        textContent: `${i + 1}. ${q.q}`
      });
      let ansText;
      if (ans.selectedOption === -1) {
        ansText = el('div', 'answer-summary__item-a', {
          textContent: `⏰ ${UI.timeout} | ${UI.correctAnswer} ${q.o[q.c]}`
        });
      } else {
        ansText = el('div', 'answer-summary__item-a', {
          textContent: `${ans.correct ? '✓' : '✗'} ${q.o[ans.selectedOption]} ${!ans.correct ? '| ' + UI.correctAnswer + ' ' + q.o[q.c] : ''}`
        });
      }
      item.appendChild(qText);
      item.appendChild(ansText);
      summaryList.appendChild(item);
    });

    toggleBtn.addEventListener('click', () => {
      summaryList.classList.toggle('hidden');
    });

    summaryWrap.appendChild(toggleBtn);
    summaryWrap.appendChild(summaryList);
    wrap.appendChild(summaryWrap);

    // Buttons
    const btns = el('div', 'results__buttons anim-fade-in-up');

    const playAgainBtn = el('button', 'btn btn-primary', { textContent: UI.playAgainBtn });
    playAgainBtn.addEventListener('click', onPlayAgain);

    const topicBtn = el('button', 'btn btn-secondary', { textContent: UI.changeTopicBtn });
    topicBtn.addEventListener('click', onChangeTopic);

    const lbBtn = el('button', 'btn btn-secondary', { textContent: UI.leaderboardBtn });
    lbBtn.addEventListener('click', onLeaderboard);

    btns.appendChild(playAgainBtn);
    btns.appendChild(topicBtn);
    btns.appendChild(lbBtn);
    wrap.appendChild(btns);

    setScreen(wrap);
  }

  /* ═══════════════════════════════════════
     SCREEN 7: Leaderboard
     ═══════════════════════════════════════ */
  function renderLeaderboard(currentPlayer, onBack) {
    const wrap = el('div', 'leaderboard screen');

    // Title
    const title = el('h2', 'title-display title-lg leaderboard__title anim-fade-in-up', {
      textContent: `${UI.leaderboardTitle} ★`
    });
    wrap.appendChild(title);

    // Filter
    const filterWrap = el('div', 'leaderboard__filter anim-fade-in-up');
    const select = el('select');
    select.id = 'lb-filter';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'എല്ലാ വിഷയങ്ങളും';
    select.appendChild(allOpt);
    TOPICS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => _refreshTable(select.value, currentPlayer));
    filterWrap.appendChild(select);
    wrap.appendChild(filterWrap);

    // Table wrapper
    const tableWrap = el('div', 'leaderboard__table-wrap');
    tableWrap.id = 'lb-table-wrap';
    wrap.appendChild(tableWrap);

    // Actions
    const actions = el('div', 'leaderboard__actions anim-fade-in-up');

    const backBtn = el('button', 'btn btn-secondary', { textContent: UI.backBtn });
    backBtn.addEventListener('click', onBack);

    const clearBtn = el('button', 'btn btn-sm btn-secondary', { textContent: UI.clearBtn });
    clearBtn.addEventListener('click', () => {
      _showConfirm(UI.clearConfirm, () => {
        Leaderboard.clearAll();
        _refreshTable(select.value, currentPlayer);
      });
    });

    actions.appendChild(backBtn);
    if (Leaderboard.isAvailable()) {
      actions.appendChild(clearBtn);
    }
    wrap.appendChild(actions);

    setScreen(wrap);

    // Initial table render
    _refreshTable('all', currentPlayer);
  }

  /* ── Refresh leaderboard table ── */
  function _refreshTable(topicFilter, currentPlayer) {
    const tableWrap = document.getElementById('lb-table-wrap');
    if (!tableWrap) return;
    tableWrap.innerHTML = '';

    const entries = Leaderboard.getByTopic(topicFilter);

    if (entries.length === 0) {
      const empty = el('div', 'leaderboard__empty', { textContent: UI.noEntries });
      tableWrap.appendChild(empty);
      return;
    }

    const table = el('table', 'leaderboard__table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['#', 'പേര്', 'വിഷയം', 'സ്കോർ', '%', 'സമയം', 'തീയതി'].forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    entries.forEach((entry, i) => {
      const tr = document.createElement('tr');
      tr.className = `anim-slide-in-left stagger-${Math.min(i + 1, 10)}`;

      // Highlight current player
      if (currentPlayer && entry.name === currentPlayer && entry === entries.find(e => e.name === currentPlayer)) {
        tr.classList.add('highlight');
      }

      const rankMedals = ['🥇', '🥈', '🥉'];
      const cells = [
        i < 3 ? rankMedals[i] : (i + 1).toString(),
        entry.name,
        entry.topicLabel || entry.topic,
        `${entry.score}/${entry.total}`,
        `${entry.percent}%`,
        entry.time,
        entry.date
      ];

      cells.forEach((val, ci) => {
        const td = document.createElement('td');
        if (ci === 0 && i < 3) {
          td.innerHTML = `<span class="rank-medal">${val}</span>`;
        } else {
          td.textContent = val;
        }
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
  }

  /* ── In-page confirm dialog ── */
  function _showConfirm(message, onConfirm) {
    const overlay = el('div', 'confirm-overlay');
    const box = el('div', 'confirm-box anim-pop-in');
    const msg = el('div', 'confirm-box__msg', { textContent: message });
    const btns = el('div', 'confirm-box__buttons');

    const yesBtn = el('button', 'btn btn-primary btn-sm', { textContent: 'അതെ' });
    const noBtn = el('button', 'btn btn-secondary btn-sm', { textContent: 'ഇല്ല' });

    yesBtn.addEventListener('click', () => {
      overlay.remove();
      onConfirm();
    });

    noBtn.addEventListener('click', () => overlay.remove());

    btns.appendChild(yesBtn);
    btns.appendChild(noBtn);
    box.appendChild(msg);
    box.appendChild(btns);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  /* ── Utility helpers ── */
  function _getRating(percent) {
    const keys = Object.keys(UI.ratings)
      .map(Number)
      .sort((a, b) => b - a);
    for (const threshold of keys) {
      if (percent >= threshold) return UI.ratings[threshold];
    }
    return UI.ratings[0];
  }

  function _formatTime(start, end) {
    if (!start || !end) return '0:00';
    const diffMs = end - start;
    const totalSeconds = Math.floor(diffMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /* Public API */
  return {
    renderWelcome,
    renderTopics,
    renderNameInput,
    renderQuestion,
    showAnswerFeedback,
    updateTimer,
    updateScore,
    renderResults,
    renderLeaderboard,
    _formatTime,  // exposed for quiz.js to use for leaderboard entry
  };
})();
