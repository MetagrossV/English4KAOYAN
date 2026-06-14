const dataLoader = require('../../utils/dataLoader.js');

const MARK_COLORS = [
  { id: 'Q1', bg: '#ffebee', color: '#e57373', label: 'Q1' },
  { id: 'Q2', bg: '#fff8e1', color: '#ffb74d', label: 'Q2' },
  { id: 'Q3', bg: '#e8f5e9', color: '#81c784', label: 'Q3' },
  { id: 'Q4', bg: '#e3f2fd', color: '#64b5f6', label: 'Q4' },
  { id: 'Q5', bg: '#f3e5f5', color: '#ba68c8', label: 'Q5' },
];

function buildMarkColorMap() {
  const map = {};
  MARK_COLORS.forEach(c => map[c.id] = c);
  return map;
}

function buildSentenceStyles(userMarks) {
  const styles = [];
  for (let i = 0; i < 200; i++) {
    const marks = userMarks[i];
    if (!marks || marks.length === 0) {
      styles.push('');
    } else {
      const c = MARK_COLORS.find(x => x.id === marks[0]);
      styles.push(c ? 'background:' + c.bg + ';' : '');
    }
  }
  return styles;
}

function buildQuestionClasses(questions, userAnswers, submitted) {
  return questions.map((q, idx) => {
    let cls = '';
    if (idx === 0) cls = 'active'; // 默认第一个
    if (userAnswers[q.q_no]) cls += ' answered';
    if (submitted && q.answer) {
      if (q.answer === userAnswers[q.q_no]) {
        cls += ' correct';
      } else if (userAnswers[q.q_no]) {
        cls += ' wrong';
      }
    }
    return cls.trim();
  });
}

function buildOptionClasses(question, userAnswers, submitted) {
  const qNo = question.q_no;
  const userAns = userAnswers[qNo];
  return ['A', 'B', 'C', 'D'].map(opt => {
    let cls = '';
    if (userAns === opt) cls += 'selected ';
    if (submitted && question.answer) {
      if (question.answer === opt) cls += 'correct-ans ';
      else if (userAns === opt) cls += 'wrong-ans ';
    }
    return cls.trim();
  });
}

Page({
  data: {
    paper: null,
    text: null,
    textNo: 1,
    totalTexts: 4,
    sentences: [],
    questions: [],
    userAnswers: {},
    userMarks: {},
    userTranslations: {},
    showMarkPanel: false,
    showTranslatePanel: false,
    showAIPanel: false,
    selectedSentenceIndex: -1,
    markColors: MARK_COLORS,
    markColorMap: buildMarkColorMap(),
    panelSelectedColors: {},
    hasUserMarks: false,
    currentQuestion: 0,
    submitted: false,
    correctCount: 0,
    wrongCount: 0,
    timerStart: 0,
    elapsedSeconds: 0,
    timerDisplay: '00:00',
    timerInterval: null,
    aiPrompt: '',
    // 预计算的UI状态
    sentenceStyles: [],
    questionClasses: [],
    optionClasses: ['', '', '', ''],
    showQuestionCard: true,
  },

  onLoad(options) {
    const paperId = options.paperId;
    const textNo = parseInt(options.textNo || 1);
    const paper = dataLoader.getPaperById(paperId);
    
    if (!paper) {
      wx.showToast({ title: '试卷不存在', icon: 'none' });
      return;
    }
    
    const text = paper.reading.find(t => t.text_no === textNo);
    if (!text) {
      wx.showToast({ title: '文章不存在', icon: 'none' });
      return;
    }

    const progress = dataLoader.getUserProgressForText(paperId, textNo);
    const answers = progress ? progress.answers : {};
    const marks = progress ? progress.marks : {};
    const translations = progress ? progress.translations : {};
    const submitted = !!progress;
    const elapsed = progress ? (progress.elapsedSeconds || 0) : 0;

    const sentences = text.sentences;
    const questions = text.questions;

    this.setData({
      paper,
      text,
      textNo,
      totalTexts: paper.reading.length,
      sentences,
      questions,
      userAnswers: answers,
      userMarks: marks,
      userTranslations: translations,
      hasUserMarks: Object.keys(marks).length > 0,
      submitted,
      elapsedSeconds: elapsed,
      timerDisplay: this.formatTime(elapsed),
      sentenceStyles: buildSentenceStyles(marks),
      questionClasses: buildQuestionClasses(questions, answers, submitted),
      optionClasses: questions.length > 0 ? buildOptionClasses(questions[0], answers, submitted) : ['', '', '', ''],
      showQuestionCard: questions.length > 0,
    });

    if (!submitted) {
      this.startTimer();
    }
  },

  onUnload() {
    this.stopTimer();
  },

  startTimer() {
    const start = Date.now() - this.data.elapsedSeconds * 1000;
    this.setData({ timerStart: start });
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.data.timerStart) / 1000);
      this.setData({
        elapsedSeconds: elapsed,
        timerDisplay: this.formatTime(elapsed)
      });
    }, 1000);
    this.setData({ timerInterval: interval });
  },

  stopTimer() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
  },

  refreshUI() {
    const { questions, userAnswers, userMarks, submitted, currentQuestion } = this.data;
    this.setData({
      sentenceStyles: buildSentenceStyles(userMarks),
      questionClasses: buildQuestionClasses(questions, userAnswers, submitted),
      optionClasses: questions.length > 0 ? buildOptionClasses(questions[currentQuestion], userAnswers, submitted) : ['', '', '', ''],
      hasUserMarks: Object.keys(userMarks).length > 0,
    });
  },

  onSentenceTap(e) {
    const idx = e.currentTarget.dataset.index;
    if (this.data.submitted) return;
    const marks = this.data.userMarks[idx] || [];
    const selected = {};
    marks.forEach(m => selected[m] = true);
    this.setData({
      selectedSentenceIndex: idx,
      showMarkPanel: true,
      showTranslatePanel: false,
      panelSelectedColors: selected
    });
  },

  onSentenceLongPress(e) {
    const idx = e.currentTarget.dataset.index;
    if (this.data.submitted) return;
    this.openTranslatePanel(idx);
  },

  onSentenceTranslate(e) {
    const idx = e.currentTarget.dataset.index;
    if (this.data.submitted) return;
    this.openTranslatePanel(idx);
  },

  openTranslatePanel(idx) {
    this.setData({
      selectedSentenceIndex: idx,
      showTranslatePanel: true,
      showMarkPanel: false
    });
  },

  onGoBack() {
    wx.navigateBack();
  },

  onMarkColorTap(e) {
    const colorId = e.currentTarget.dataset.color;
    const idx = this.data.selectedSentenceIndex;
    const marks = { ...this.data.userMarks };
    if (!marks[idx]) marks[idx] = [];
    const pos = marks[idx].indexOf(colorId);
    if (pos > -1) {
      marks[idx].splice(pos, 1);
      if (marks[idx].length === 0) delete marks[idx];
    } else {
      marks[idx].push(colorId);
    }
    const selected = {};
    (marks[idx] || []).forEach(m => selected[m] = true);
    this.setData({ 
      userMarks: marks,
      panelSelectedColors: selected,
    });
    this.refreshUI();
  },

  onClosePanel() {
    this.setData({
      showMarkPanel: false,
      showTranslatePanel: false,
      showAIPanel: false,
      selectedSentenceIndex: -1,
      panelSelectedColors: {}
    });
  },

  onTranslateInput(e) {
    const idx = this.data.selectedSentenceIndex;
    const translations = { ...this.data.userTranslations };
    translations[idx] = e.detail.value;
    this.setData({ userTranslations: translations });
  },

  onSaveTranslate() {
    this.setData({ showTranslatePanel: false, selectedSentenceIndex: -1 });
  },

  onAnswerSelect(e) {
    if (this.data.submitted) return;
    const qNo = e.currentTarget.dataset.qno;
    const option = e.currentTarget.dataset.option;
    const answers = { ...this.data.userAnswers };
    answers[qNo] = option;
    this.setData({ userAnswers: answers });
    this.refreshUI();
  },

  onSelectQuestion(e) {
    const index = e.currentTarget.dataset.index;
    const { questions, userAnswers, submitted } = this.data;
    this.setData({ 
      currentQuestion: index,
      optionClasses: questions.length > 0 ? buildOptionClasses(questions[index], userAnswers, submitted) : ['', '', '', ''],
    });
    // 更新 questionClasses 的 active 状态
    const qClasses = questions.map((q, idx) => {
      let cls = '';
      if (idx === index) cls = 'active';
      if (userAnswers[q.q_no]) cls += ' answered';
      if (submitted && q.answer) {
        if (q.answer === userAnswers[q.q_no]) {
          cls += ' correct';
        } else if (userAnswers[q.q_no]) {
          cls += ' wrong';
        }
      }
      return cls.trim();
    });
    this.setData({ questionClasses: qClasses });
  },

  preventClose() {},

  onSubmit() {
    this.stopTimer();
    const { questions, userAnswers } = this.data;
    let correct = 0;
    let wrong = 0;
    
    for (const q of questions) {
      const standard = q.answer;
      const user = userAnswers[q.q_no];
      if (standard && user) {
        if (standard === user) {
          correct++;
        } else {
          wrong++;
          dataLoader.saveWrongQuestion(
            this.data.paper.paper_id,
            this.data.textNo,
            q,
            user,
            this.data.userMarks,
            this.data.userTranslations,
            this.data.elapsedSeconds
          );
        }
      }
    }
    
    this.setData({
      submitted: true,
      correctCount: correct,
      wrongCount: wrong
    });
    
    this.refreshUI();
    
    dataLoader.saveUserProgress(
      this.data.paper.paper_id,
      this.data.textNo,
      userAnswers,
      this.data.userMarks,
      this.data.userTranslations,
      this.data.elapsedSeconds
    );
    
    wx.showToast({ title: '已提交，用时' + this.data.timerDisplay, icon: 'success' });
  },

  onAIGrade() {
    const prompt = this.buildAIPrompt();
    this.setData({
      aiPrompt: prompt,
      showAIPanel: true
    });
  },

  buildAIPrompt() {
    const { paper, textNo, sentences, questions, userAnswers, userMarks, userTranslations, elapsedSeconds } = this.data;
    let prompt = '【考研英语阅读 AI 批卷】\n\n';
    prompt += '试卷：' + paper.year + '年 ' + paper.exam_type + ' Text ' + textNo + '\n';
    prompt += '做题用时：' + this.formatTime(elapsedSeconds) + '\n\n';
    
    prompt += '=== 文章原文 ===\n';
    sentences.forEach((s, i) => {
      prompt += (i + 1) + '. ' + s + '\n';
      if (userTranslations[i]) {
        prompt += '   [翻译] ' + userTranslations[i] + '\n';
      }
      if (userMarks[i] && userMarks[i].length > 0) {
        prompt += '   [标记] ' + userMarks[i].join(', ') + '\n';
      }
    });
    
    prompt += '\n=== 题目与作答 ===\n';
    questions.forEach(q => {
      prompt += '\n第' + q.q_no + '题：' + q.question + '\n';
      ['A', 'B', 'C', 'D'].forEach(opt => {
        const isUser = userAnswers[q.q_no] === opt;
        const marker = isUser ? ' ★用户选择' : '';
        prompt += '  [' + opt + '] ' + (q.options[opt] || '') + marker + '\n';
      });
      if (q.answer) {
        prompt += '  [标准答案] ' + q.answer + '\n';
      }
    });
    
    prompt += '\n=== 请完成以下分析 ===\n';
    prompt += '1. 判断每道题用户答案是否正确（如果已知标准答案，请核对；如果未知，请根据文章推理给出正确答案）。\n';
    prompt += '2. 对于错题，请分析：\n';
    prompt += '   - 错误原因：是翻译理解错误、定位错误（找错关键句）、还是逻辑推理错误？\n';
    prompt += '   - 用户标记的关键句是否找对了位置？\n';
    prompt += '   - 给出正确的解题思路和关键句定位。\n';
    prompt += '3. 统计得分：正确数/总题数。\n';
    prompt += '4. 给出整体学习建议。\n';
    
    return prompt;
  },

  onCopyPrompt() {
    wx.setClipboardData({
      data: this.data.aiPrompt,
      success: () => {
        wx.showToast({ title: '已复制，可粘贴到AI工具', icon: 'success' });
      }
    });
  },

  onNextText() {
    const next = this.data.textNo + 1;
    if (next > this.data.totalTexts) {
      wx.showToast({ title: '已完成本篇', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    wx.redirectTo({
      url: '/pages/reading/reading?paperId=' + this.data.paper.paper_id + '&textNo=' + next
    });
  },

  onPrevText() {
    const prev = this.data.textNo - 1;
    if (prev < 1) return;
    wx.redirectTo({
      url: '/pages/reading/reading?paperId=' + this.data.paper.paper_id + '&textNo=' + prev
    });
  },

  onGoReview() {
    wx.navigateTo({ url: '/pages/review/review' });
  }
});
