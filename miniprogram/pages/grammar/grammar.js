const { AdaptiveEngine } = require('../../utils/adaptiveEngine.js');
const grammarBank = require('../../data/grammar_bank.js');
const grammarTopics = require('../../data/grammar_topics.js');

Page({
  data: {
    viewMode: 'home', // home, training, result, topics
    engine: null,
    
    // 首页数据
    ability: { score: 0, level: '入门', color: '#f5222d' },
    radarData: [],
    topicStatuses: [],
    masteredCount: 0,
    totalCount: 20,
    
    // 训练数据
    currentQuestion: null,
    currentTopicName: '',
    questionNumber: 0,
    showExplanation: false,
    selectedAnswer: '',
    isCorrect: false,
    sessionEnded: false,
    correctCount: 0,
    wrongCount: 0,
    accuracy: 0,
    
    // 结果数据
    diagnosis: null,
    sessionLog: []
  },

  onLoad() {
    this.initEngine();
  },

  onShow() {
    this.initEngine();
  },

  initEngine() {
    const engine = new AdaptiveEngine();
    engine.loadFromStorage('grammar_mastery');
    
    const ability = engine.getOverallAbility();
    const radar = engine.getRadarData();
    const path = engine.getRecommendPath();
    
    const topicStatuses = engine.topics.map(t => ({
      ...t,
      status: engine.getTopicStatus(t.id),
      probability: Math.round(engine.mastery[t.id].probability * 100)
    }));
    
    this.setData({
      engine,
      ability,
      radarData: radar,
      topicStatuses,
      masteredCount: path.mastered,
      totalCount: engine.topics.length
    });
  },

  // 开始训练
  onStartTraining() {
    const engine = this.data.engine;
    engine.reset();
    engine.loadFromStorage('grammar_mastery'); // 恢复已有掌握度
    
    const question = engine.selectNextQuestion(grammarBank);
    const topicName = grammarTopics.topics.find(t => t.id === question.topic_id)?.name || '';
    
    this.setData({
      viewMode: 'training',
      currentQuestion: question,
      currentTopicName: topicName,
      questionNumber: 1,
      showExplanation: false,
      selectedAnswer: '',
      isCorrect: false,
      sessionEnded: false,
      sessionLog: [],
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0
    });
  },

  // 选择答案
  onSelectAnswer(e) {
    if (this.data.showExplanation) return;
    
    const answer = e.currentTarget.dataset.answer;
    const question = this.data.currentQuestion;
    const isCorrect = answer === question.answer;
    
    const engine = this.data.engine;
    engine.updateMastery(question.topic_id, isCorrect, question.difficulty, question.id);
    
    const log = [...this.data.sessionLog, {
      question: question.question.substring(0, 40) + '...',
      topic: grammarTopics.topics.find(t => t.id === question.topic_id)?.name || question.topic_id,
      isCorrect,
      difficulty: question.difficulty
    }];
    
    const correctCount = this.data.correctCount + (isCorrect ? 1 : 0);
    const wrongCount = this.data.wrongCount + (isCorrect ? 0 : 1);
    const accuracy = log.length > 0 ? Math.round(correctCount / log.length * 100) : 0;
    
    this.setData({
      showExplanation: true,
      selectedAnswer: answer,
      isCorrect,
      sessionLog: log,
      correctCount,
      wrongCount,
      accuracy
    });
  },

  // 下一题
  onNextQuestion() {
    const engine = this.data.engine;
    
    // 检查是否结束
    if (engine.shouldEndSession()) {
      this.endSession();
      return;
    }
    
    const question = engine.selectNextQuestion(grammarBank);
    if (!question) {
      this.endSession();
      return;
    }
    
    const topicName = grammarTopics.topics.find(t => t.id === question.topic_id)?.name || '';
    
    this.setData({
      currentQuestion: question,
      currentTopicName: topicName,
      questionNumber: this.data.questionNumber + 1,
      showExplanation: false,
      selectedAnswer: '',
      isCorrect: false
    });
  },

  // 结束会话
  endSession() {
    const engine = this.data.engine;
    engine.saveToStorage('grammar_mastery');
    
    const diagnosis = engine.getDiagnosis();
    const ability = engine.getOverallAbility();
    const radar = engine.getRadarData();
    const path = engine.getRecommendPath();
    
    // 更新首页数据
    const topicStatuses = engine.topics.map(t => ({
      ...t,
      status: engine.getTopicStatus(t.id),
      probability: Math.round(engine.mastery[t.id].probability * 100)
    }));
    
    this.setData({
      viewMode: 'result',
      diagnosis,
      ability,
      radarData: radar,
      topicStatuses,
      masteredCount: path.mastered,
      sessionEnded: true
    });
  },

  // 返回首页
  onBackHome() {
    this.setData({ viewMode: 'home' });
  },

  // 查看知识点
  onViewTopics() {
    this.setData({ viewMode: 'topics' });
  },

  // 返回
  onBack() {
    const mode = this.data.viewMode;
    if (mode === 'training') {
      // 训练中途退出，保存进度
      this.data.engine.saveToStorage('grammar_mastery');
      this.setData({ viewMode: 'home' });
    } else if (mode === 'result') {
      this.setData({ viewMode: 'home' });
    } else if (mode === 'topics') {
      this.setData({ viewMode: 'home' });
    }
  },

  // 重置进度
  onResetProgress() {
    wx.showModal({
      title: '确认重置',
      content: '这将清除所有语法学习进度，确定吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('grammar_mastery');
          this.initEngine();
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  }
});