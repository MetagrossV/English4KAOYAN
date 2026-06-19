const grammarData = require('../../data/grammar_data.js');

Page({
  data: {
    stages: [],
    currentStage: null,
    currentPoint: null,
    viewMode: 'list', // list, stage, point, result
    progress: {},
    // 练习状态
    currentQuestionIndex: 0,
    userAnswers: [],
    showExplanation: false,
    // 排序题
    reorderWords: [],
    reorderAnswer: [],
    // 结果
    resultScore: 0,
    resultTotal: 0,
    resultDetails: [],
    weakPoints: []
  },

  onLoad() {
    this.loadProgress();
    this.loadStages();
  },

  onShow() {
    this.loadProgress();
    this.loadStages();
  },

  loadProgress() {
    const progress = wx.getStorageSync('grammar_progress') || {
      completed_points: [],
      current_point: 'tense_present',
      total_score: 0
    };
    this.setData({ progress });
  },

  saveProgress() {
    wx.setStorageSync('grammar_progress', this.data.progress);
  },

  loadStages() {
    const stages = grammarData.stages.map(stage => {
      const completedCount = stage.points.filter(p => 
        this.data.progress.completed_points.includes(p.id)
      ).length;
      return {
        ...stage,
        completedCount,
        totalCount: stage.points.length,
        progressPercent: Math.round((completedCount / stage.points.length) * 100)
      };
    });
    this.setData({ stages });
  },

  // 选择阶段
  onSelectStage(e) {
    const stageId = e.currentTarget.dataset.id;
    const stage = this.data.stages.find(s => s.id === stageId);
    this.setData({
      currentStage: stage,
      viewMode: 'stage'
    });
  },

  // 选择知识点
  onSelectPoint(e) {
    const pointId = e.currentTarget.dataset.id;
    const point = this.data.currentStage.points.find(p => p.id === pointId);
    
    // 初始化答题状态
    const questions = point.questions || [];
    this.setData({
      currentPoint: point,
      viewMode: 'point',
      currentQuestionIndex: 0,
      userAnswers: new Array(questions.length).fill(''),
      showExplanation: false,
      reorderWords: questions.length > 0 && questions[0].type === 'reorder' ? questions[0].words : [],
      reorderAnswer: []
    });
  },

  // 返回
  onBack() {
    const mode = this.data.viewMode;
    if (mode === 'result') {
      this.setData({ viewMode: 'list' });
    } else if (mode === 'point') {
      this.setData({ viewMode: 'stage' });
    } else if (mode === 'stage') {
      this.setData({ viewMode: 'list' });
    }
  },

  // 选择题答题
  onSelectAnswer(e) {
    const index = this.data.currentQuestionIndex;
    const answer = e.currentTarget.dataset.answer;
    const userAnswers = [...this.data.userAnswers];
    userAnswers[index] = answer;
    this.setData({ userAnswers, showExplanation: true });
  },

  // 下一题
  onNextQuestion() {
    const next = this.data.currentQuestionIndex + 1;
    const questions = this.data.currentPoint.questions;
    if (next < questions.length) {
      this.setData({
        currentQuestionIndex: next,
        showExplanation: false,
        reorderWords: questions[next].type === 'reorder' ? questions[next].words : [],
        reorderAnswer: []
      });
    } else {
      this.showResult();
    }
  },

  // 排序题 - 选择单词
  onSelectWord(e) {
    const word = e.currentTarget.dataset.word;
    const idx = e.currentTarget.dataset.index;
    const reorderWords = [...this.data.reorderWords];
    const reorderAnswer = [...this.data.reorderAnswer];
    
    reorderAnswer.push(word);
    reorderWords.splice(idx, 1);
    
    this.setData({ reorderWords, reorderAnswer });
    
    // 如果全部选完，自动提交
    if (reorderWords.length === 0) {
      const index = this.data.currentQuestionIndex;
      const userAnswers = [...this.data.userAnswers];
      userAnswers[index] = reorderAnswer.join(' ');
      this.setData({ userAnswers, showExplanation: true });
    }
  },

  // 排序题 - 撤销
  onUndoReorder() {
    const reorderAnswer = [...this.data.reorderAnswer];
    if (reorderAnswer.length === 0) return;
    const last = reorderAnswer.pop();
    const reorderWords = [...this.data.reorderWords, last];
    this.setData({ reorderWords, reorderAnswer });
  },

  // 显示结果
  showResult() {
    const questions = this.data.currentPoint.questions;
    const userAnswers = this.data.userAnswers;
    let correct = 0;
    const details = [];
    
    questions.forEach((q, i) => {
      const isCorrect = userAnswers[i] === q.answer;
      if (isCorrect) correct++;
      details.push({
        question: q.question,
        userAnswer: userAnswers[i] || '未作答',
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation
      });
    });
    
    const score = Math.round((correct / questions.length) * 100);
    
    // 更新进度
    const progress = { ...this.data.progress };
    if (score >= 60) {
      if (!progress.completed_points.includes(this.data.currentPoint.id)) {
        progress.completed_points.push(this.data.currentPoint.id);
      }
      progress.total_score += score;
    }
    this.setData({ progress });
    this.saveProgress();
    
    // 找出薄弱点
    const weakPoints = details.filter(d => !d.isCorrect).map(d => ({
      point: this.data.currentPoint.name,
      question: d.question.substring(0, 40) + '...'
    }));
    
    this.setData({
      viewMode: 'result',
      resultScore: score,
      resultTotal: questions.length,
      resultDetails: details,
      weakPoints
    });
    
    this.loadStages();
  },

  // 重新练习
  onRetry() {
    this.onSelectPoint({ currentTarget: { dataset: { id: this.data.currentPoint.id } } });
  },

  // 推荐训练（薄弱点）
  onRecommendTrain() {
    // 找到第一个未完成的知识点
    for (const stage of this.data.stages) {
      for (const point of stage.points) {
        if (!this.data.progress.completed_points.includes(point.id)) {
          this.setData({ currentStage: stage });
          wx.showToast({ title: `推荐学习：${point.name}`, icon: 'none' });
          return;
        }
      }
    }
    wx.showToast({ title: '恭喜！已完成所有知识点', icon: 'success' });
  }
});
